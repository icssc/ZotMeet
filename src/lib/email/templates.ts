type InviteEmailInput = {
	title: string;
	message: string;
	url: string;
};

function escapeHtml(s: string): string {
	return s
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#39;");
}

// Only allow web URLs in <a href> to avoid data injection.
function safeWebUrl(url: string): string {
	const u = new URL(url.trim());
	if (u.protocol !== "https:" && u.protocol !== "http:") {
		throw new Error("Invite URL must use http or https");
	}
	return u.href;
}

function safeEmailSubject(s: string): string {
	return s.replace(/[\r\n]/g, " ").trim();
}

export function createInviteEmail({ title, message, url }: InviteEmailInput) {
	const verifiedUrl = safeWebUrl(url);
	const subject = safeEmailSubject(title);

	return {
		subject,
		text: `${message}\n\nOpen ZotMeet: ${verifiedUrl}`,
		html: `
        <div>
          <h1>${escapeHtml(title)}</h1>
          <p>${escapeHtml(message)}</p>
          <p>
            <a href="${escapeHtml(verifiedUrl)}">Open ZotMeet</a>
          </p>
        </div>
      `,
	};
}
