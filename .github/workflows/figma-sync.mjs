// Figma → GitHub design sync
//
// For every open issue that contains a Figma frame link, this script:
//   1. Adds the "ready-for-dev" label when the frame is marked Ready for dev in Figma
//      (and removes it if the status is cleared).
//   2. Keeps one auto-updating comment on the issue with a preview image of the frame,
//      its status, and a link back to Figma.
//
// Preview images are stored on a separate branch (design-previews) so they never
// clutter your main branch. Frames are only re-rendered when the Figma file changes.

import crypto from "node:crypto";

const FIGMA_TOKEN = process.env.FIGMA_TOKEN;
const GH_TOKEN = process.env.GITHUB_TOKEN;
const [OWNER, REPO] = (process.env.GITHUB_REPOSITORY || "").split("/");
const PREVIEW_BRANCH = process.env.PREVIEW_BRANCH || "design-previews";
const READY_LABEL = process.env.READY_LABEL || "ready-for-dev";
const TIME_ZONE = process.env.TIME_ZONE || "America/Los_Angeles";
const MARKER = "<!-- figma-preview";

if (!FIGMA_TOKEN) throw new Error("Missing FIGMA_TOKEN secret.");
if (!GH_TOKEN || !OWNER || !REPO)
	throw new Error("Missing GitHub token or repository context.");

// Matches links like https://www.figma.com/design/ABC123/My-File?node-id=42-17&t=xyz
const FIGMA_LINK =
	/https:\/\/(?:www\.)?figma\.com\/(?:design|file|proto)\/([A-Za-z0-9]+)[^\s)>\]]*?[?&]node-id=(\d+(?:-|:|%3A)\d+)[^\s)>\]]*/i;

const STATUS_TEXT = {
	READY_FOR_DEV: "✅ Ready for dev",
	COMPLETED: "✔️ Completed",
	NONE: "🛠️ In progress (not marked ready yet)",
};

// ---------- API helpers ----------

async function gh(path, { method = "GET", body, allow404 = false } = {}) {
	const res = await fetch(`https://api.github.com${path}`, {
		method,
		body,
		headers: {
			Authorization: `Bearer ${GH_TOKEN}`,
			Accept: "application/vnd.github+json",
			"X-GitHub-Api-Version": "2022-11-28",
			...(body ? { "Content-Type": "application/json" } : {}),
		},
	});
	if (res.status === 404 && allow404) return null;
	if (!res.ok)
		throw new Error(
			`GitHub ${method} ${path} → ${res.status}: ${await res.text()}`,
		);
	return res.status === 204 ? null : res.json();
}

async function figma(path) {
	const res = await fetch(`https://api.figma.com${path}`, {
		headers: { "X-Figma-Token": FIGMA_TOKEN },
	});
	if (!res.ok)
		throw new Error(`Figma ${path} → ${res.status}: ${await res.text()}`);
	return res.json();
}

// ---------- GitHub setup ----------

async function listOpenIssues() {
	const all = [];
	for (let page = 1; ; page++) {
		const batch = await gh(
			`/repos/${OWNER}/${REPO}/issues?state=open&per_page=100&page=${page}`,
		);
		all.push(...batch.filter((i) => !i.pull_request)); // the issues API also returns PRs
		if (batch.length < 100) return all;
	}
}

async function ensureBranch() {
	const ref = await gh(
		`/repos/${OWNER}/${REPO}/git/ref/heads/${PREVIEW_BRANCH}`,
		{ allow404: true },
	);
	if (ref) return;
	const repo = await gh(`/repos/${OWNER}/${REPO}`);
	const base = await gh(
		`/repos/${OWNER}/${REPO}/git/ref/heads/${repo.default_branch}`,
	);
	await gh(`/repos/${OWNER}/${REPO}/git/refs`, {
		method: "POST",
		body: JSON.stringify({
			ref: `refs/heads/${PREVIEW_BRANCH}`,
			sha: base.object.sha,
		}),
	});
	console.log(`Created branch ${PREVIEW_BRANCH} for preview images.`);
}

async function ensureLabel() {
	const label = await gh(
		`/repos/${OWNER}/${REPO}/labels/${encodeURIComponent(READY_LABEL)}`,
		{ allow404: true },
	);
	if (label) return;
	await gh(`/repos/${OWNER}/${REPO}/labels`, {
		method: "POST",
		body: JSON.stringify({
			name: READY_LABEL,
			color: "0e8a16",
			description: "Figma design marked Ready for dev",
		}),
	});
	console.log(`Created label ${READY_LABEL}.`);
}

async function findPreviewComment(issueNumber) {
	for (let page = 1; ; page++) {
		const batch = await gh(
			`/repos/${OWNER}/${REPO}/issues/${issueNumber}/comments?per_page=100&page=${page}`,
		);
		const hit = batch.find((c) => c.body?.includes(MARKER));
		if (hit) return hit;
		if (batch.length < 100) return null;
	}
}

// The preview comment carries a hidden line like:
// <!-- figma-preview lastModified=2026-10-27T15:30:00Z status=READY_FOR_DEV img=ab12... -->
function parseState(body = "") {
	const m = body.match(/<!-- figma-preview (.*?) -->/);
	if (!m) return {};
	return Object.fromEntries(m[1].split(" ").map((pair) => pair.split("=")));
}

function gitBlobSha(buf) {
	return crypto
		.createHash("sha1")
		.update(`blob ${buf.length}\0`)
		.update(buf)
		.digest("hex");
}

async function savePreview(path, buf, message) {
	const existing = await gh(
		`/repos/${OWNER}/${REPO}/contents/${path}?ref=${PREVIEW_BRANCH}`,
		{ allow404: true },
	);
	if (existing && existing.sha === gitBlobSha(buf)) return; // image unchanged, skip the commit
	await gh(`/repos/${OWNER}/${REPO}/contents/${path}`, {
		method: "PUT",
		body: JSON.stringify({
			message,
			content: buf.toString("base64"),
			branch: PREVIEW_BRANCH,
			...(existing ? { sha: existing.sha } : {}),
		}),
	});
}

async function syncLabel(issue, ready) {
	const has = issue.labels.some(
		(l) => (typeof l === "string" ? l : l.name) === READY_LABEL,
	);
	if (ready && !has) {
		await gh(`/repos/${OWNER}/${REPO}/issues/${issue.number}/labels`, {
			method: "POST",
			body: JSON.stringify({ labels: [READY_LABEL] }),
		});
	} else if (!ready && has) {
		await gh(
			`/repos/${OWNER}/${REPO}/issues/${issue.number}/labels/${encodeURIComponent(READY_LABEL)}`,
			{
				method: "DELETE",
			},
		);
	}
}

function renderComment({ issue, doc, status, lastModified, img, url }) {
	const imgUrl =
		`https://github.com/${OWNER}/${REPO}/blob/${PREVIEW_BRANCH}/previews/issue-${issue.number}.png` +
		`?raw=true&v=${(img || "").slice(0, 8)}`;
	const changed = new Date(lastModified).toLocaleString("en-US", {
		timeZone: TIME_ZONE,
	});
	return [
		`${MARKER} lastModified=${lastModified} status=${status} img=${img || ""} -->`,
		`### 🎨 ${doc.name}`,
		img
			? `![Design preview](${imgUrl})`
			: "_No preview available for this frame._",
		"",
		`**Status:** ${STATUS_TEXT[status] || status}`,
		`[Open in Figma](${url}) · Last design change: ${changed}`,
		"",
		"<sub>Updated automatically by the Figma sync Action.</sub>",
	].join("\n");
}

// ---------- Sync logic ----------

async function syncIssue(item, doc, lastModified, renderUrl) {
	const { issue } = item;
	if (!doc) {
		console.warn(
			`#${issue.number}: frame ${item.nodeId} not found (deleted, or the token's account can't see it).`,
		);
		return;
	}

	const status = doc.devStatus?.type || "NONE";
	await syncLabel(issue, status === "READY_FOR_DEV" || status === "COMPLETED");

	let img = item.state.img || "";
	if (renderUrl) {
		const res = await fetch(renderUrl);
		if (!res.ok) throw new Error(`Downloading render failed: ${res.status}`);
		const buf = Buffer.from(await res.arrayBuffer());
		img = gitBlobSha(buf);
		await savePreview(
			`previews/issue-${issue.number}.png`,
			buf,
			`Update design preview for #${issue.number}`,
		);
	}

	const unchanged =
		item.state.status === status &&
		item.state.lastModified === lastModified &&
		(item.state.img || "") === img;
	if (unchanged) return;

	const body = JSON.stringify({
		body: renderComment({
			issue,
			doc,
			status,
			lastModified,
			img,
			url: item.url,
		}),
	});
	if (item.comment) {
		await gh(`/repos/${OWNER}/${REPO}/issues/comments/${item.comment.id}`, {
			method: "PATCH",
			body,
		});
	} else {
		await gh(`/repos/${OWNER}/${REPO}/issues/${issue.number}/comments`, {
			method: "POST",
			body,
		});
	}
	console.log(
		`#${issue.number}: ${status}${renderUrl ? " (preview refreshed)" : ""}`,
	);
}

async function syncFile(fileKey, items) {
	const ids = [...new Set(items.map((i) => i.nodeId))];
	const data = await figma(
		`/v1/files/${fileKey}/nodes?ids=${encodeURIComponent(ids.join(","))}&depth=1`,
	);
	const { lastModified } = data;

	for (const item of items) {
		item.comment = await findPreviewComment(item.issue.number);
		item.state = parseState(item.comment?.body);
	}

	// Only ask Figma to render frames whose file changed since the last preview.
	const toRender = [
		...new Set(
			items
				.filter((i) => i.state.lastModified !== lastModified || !i.state.img)
				.map((i) => i.nodeId),
		),
	];
	let imageUrls = {};
	if (toRender.length) {
		const res = await figma(
			`/v1/images/${fileKey}?ids=${encodeURIComponent(toRender.join(","))}&format=png&scale=2`,
		);
		if (res.err) throw new Error(`Figma render error: ${res.err}`);
		imageUrls = res.images || {};
	}

	let failures = 0;
	for (const item of items) {
		try {
			await syncIssue(
				item,
				data.nodes?.[item.nodeId]?.document,
				lastModified,
				imageUrls[item.nodeId],
			);
		} catch (err) {
			failures++;
			console.error(`#${item.issue.number}: ${err.message}`);
		}
	}
	return failures;
}

async function main() {
	const issues = await listOpenIssues();
	const linked = [];
	for (const issue of issues) {
		const m = issue.body?.match(FIGMA_LINK);
		if (m)
			linked.push({
				issue,
				fileKey: m[1],
				nodeId: m[2].replace(/-|%3A/i, ":"),
				url: m[0],
			});
	}
	console.log(`Found ${linked.length} open issue(s) with a Figma frame link.`);
	if (!linked.length) return;

	await ensureBranch();
	await ensureLabel();

	const byFile = new Map();
	for (const item of linked) {
		if (!byFile.has(item.fileKey)) byFile.set(item.fileKey, []);
		byFile.get(item.fileKey).push(item);
	}

	let failures = 0;
	for (const [fileKey, items] of byFile) {
		try {
			failures += await syncFile(fileKey, items);
		} catch (err) {
			failures += items.length;
			console.error(`Figma file ${fileKey}: ${err.message}`);
		}
	}
	if (failures) process.exitCode = 1;
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
