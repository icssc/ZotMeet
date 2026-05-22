#!/usr/bin/env node
/**
 * Generates PWA / iOS App Store icon assets from the source SVG.
 *
 * Outputs are written to `public/icons/` and `public/`.
 * Run with: `pnpm pwa:icons`
 */
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import {
	ANY_ICON_SIZES,
	APP_DESCRIPTION,
	APP_NAME,
	APPLE_TOUCH_SIZE,
	BRAND_ACCENT_HEX,
	BRAND_BACKGROUND_HEX,
	FAVICON_SIZES,
	MASKABLE_ICON_SIZES,
	PWA_SCREENSHOTS,
} from "../src/lib/pwa-config.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const SOURCE_SVG = path.join(ROOT, "public", "zotmeet-logo.svg");
const ICONS_DIR = path.join(ROOT, "public", "icons");
const SCREENSHOTS_DIR = path.join(ROOT, "public", "screenshots");

async function readSourceSvg() {
	try {
		return await fs.readFile(SOURCE_SVG);
	} catch (err) {
		throw new Error(
			`Could not read source SVG at ${path.relative(ROOT, SOURCE_SVG)}. ` +
				`Make sure the file exists before running this script.\nUnderlying error: ${err.message}`,
		);
	}
}

/**
 * Render the source SVG centered on a square canvas.
 *
 * @param {object} opts
 * @param {Buffer} opts.svg     - source SVG bytes
 * @param {number} opts.size    - output size in pixels (square)
 * @param {number} opts.padding - fraction of size reserved as padding (0..1)
 * @param {string} opts.background - background fill (hex or "transparent")
 * @returns {Promise<Buffer>}
 */
async function renderSquare({ svg, size, padding, background }) {
	const inner = Math.round(size * (1 - padding * 2));
	const rendered = await sharp(svg, { density: 512 })
		.resize(inner, inner, {
			fit: "contain",
			background: { r: 0, g: 0, b: 0, alpha: 0 },
		})
		.png()
		.toBuffer();

	const canvas = sharp({
		create: {
			width: size,
			height: size,
			channels: 4,
			background:
				background === "transparent"
					? { r: 0, g: 0, b: 0, alpha: 0 }
					: background,
		},
	});

	return canvas
		.composite([{ input: rendered, gravity: "center" }])
		.png({ compressionLevel: 9 })
		.toBuffer();
}

async function writeAnyIcon(svg, size) {
	const buf = await renderSquare({
		svg,
		size,
		padding: 0.1,
		background: BRAND_BACKGROUND_HEX,
	});
	const out = path.join(ICONS_DIR, `icon-${size}.png`);
	await fs.writeFile(out, buf);
	return { kind: "any", out, size };
}

async function writeMaskableIcon(svg, size) {
	// Maskable icons need a 20% safe zone on each edge so that aggressive
	// platform masks (Android, iOS) do not crop the brand mark.
	const buf = await renderSquare({
		svg,
		size,
		padding: 0.2,
		background: BRAND_ACCENT_HEX,
	});
	const out = path.join(ICONS_DIR, `maskable-${size}.png`);
	await fs.writeFile(out, buf);
	return { kind: "maskable", out, size };
}

async function writeAppleTouchIcon(svg) {
	// Apple touch icons must be opaque (no alpha channel). Use solid white bg.
	const buf = await renderSquare({
		svg,
		size: APPLE_TOUCH_SIZE,
		padding: 0.1,
		background: BRAND_BACKGROUND_HEX,
	});
	const opaque = await sharp(buf)
		.flatten({ background: BRAND_BACKGROUND_HEX })
		.png()
		.toBuffer();
	const out = path.join(ROOT, "public", "apple-touch-icon.png");
	await fs.writeFile(out, opaque);
	return { kind: "apple", out, size: APPLE_TOUCH_SIZE };
}

async function writeFavicon(svg, size) {
	const buf = await renderSquare({
		svg,
		size,
		padding: 0.05,
		background: "transparent",
	});
	const out = path.join(ICONS_DIR, `favicon-${size}.png`);
	await fs.writeFile(out, buf);
	return { kind: "favicon", out, size };
}

function escapeXml(text) {
	return text
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll('"', "&quot;");
}

function logResult({ kind, out, size, label }) {
	const tag = `${kind}:`.padEnd(12);
	const dims = label ?? (typeof size === "number" ? `${size}x${size}` : size);
	console.log(`  ${tag}${path.relative(ROOT, out)}  (${dims})`);
}

/**
 * Build a store screenshot with brand colors and the app mark.
 *
 * @param {object} opts
 * @param {Buffer} opts.svg
 * @param {number} opts.width
 * @param {number} opts.height
 * @param {string} opts.label
 * @returns {Promise<Buffer>}
 */
async function renderScreenshot({ svg, width, height, label }) {
	const logoSize = Math.round(Math.min(width, height) * 0.22);
	const logo = await renderSquare({
		svg,
		size: logoSize,
		padding: 0.08,
		background: BRAND_BACKGROUND_HEX,
	});

	const titleSize = Math.round(width * 0.09);
	const bodySize = Math.round(width * 0.04);
	const titleY = Math.round(height * 0.52);
	const bodyY = titleY + Math.round(bodySize * 1.8);

	const overlay = Buffer.from(`
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#EEEEEE"/>
      <stop offset="100%" stop-color="#EAEFF2"/>
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#bg)"/>
  <rect x="0" y="0" width="100%" height="18%" fill="${BRAND_ACCENT_HEX}" opacity="0.12"/>
  <text x="50%" y="${titleY}" text-anchor="middle" font-family="system-ui, -apple-system, Segoe UI, sans-serif"
    font-size="${titleSize}" font-weight="700" fill="#1e293b">${APP_NAME}</text>
  <text x="50%" y="${bodyY}" text-anchor="middle" font-family="system-ui, -apple-system, Segoe UI, sans-serif"
    font-size="${bodySize}" fill="#64748b">${escapeXml(APP_DESCRIPTION)}</text>
  <text x="50%" y="${height - Math.round(height * 0.06)}" text-anchor="middle" font-family="system-ui, -apple-system, Segoe UI, sans-serif"
    font-size="${Math.round(bodySize * 0.85)}" fill="#94a3b8">${escapeXml(label)}</text>
</svg>`);

	const logoTop = Math.round(height * 0.2);
	const logoLeft = Math.round((width - logoSize) / 2);

	return sharp(overlay)
		.composite([{ input: logo, top: logoTop, left: logoLeft }])
		.resize(width, height)
		.png({ compressionLevel: 9 })
		.toBuffer();
}

async function writeScreenshot(svg, { file, sizes, label }) {
	const [width, height] = sizes.split("x").map(Number);
	const buf = await renderScreenshot({ svg, width, height, label });
	const out = path.join(SCREENSHOTS_DIR, file);
	await fs.writeFile(out, buf);
	return { kind: "screenshot", out, size: sizes, label: sizes };
}

async function main() {
	console.log("Generating PWA assets (icons + screenshots)...");
	await fs.mkdir(ICONS_DIR, { recursive: true });
	await fs.mkdir(SCREENSHOTS_DIR, { recursive: true });

	const svg = await readSourceSvg();

	const jobs = [
		...ANY_ICON_SIZES.map((s) => writeAnyIcon(svg, s)),
		...MASKABLE_ICON_SIZES.map((s) => writeMaskableIcon(svg, s)),
		...FAVICON_SIZES.map((s) => writeFavicon(svg, s)),
		...PWA_SCREENSHOTS.map((shot) => writeScreenshot(svg, shot)),
		writeAppleTouchIcon(svg),
	];

	const results = await Promise.all(jobs);
	// Sort for stable, readable output regardless of which job finished first.
	results
		.sort((a, b) => a.kind.localeCompare(b.kind) || a.size - b.size)
		.forEach(logResult);

	console.log("\nDone.");
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
