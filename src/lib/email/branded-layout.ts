export type BrandedTransactionalEmailInput = {
	subject: string;
	headline: string;
	bodyLines: string[];
	ctaLabel: string;
	ctaUrl: string;
	footerLearnMoreUrl: string;
	footerTopic: "meetings" | "groups";
	/** Absolute URL for the bottom illustration; defaults to `/email/invite-hero.png` on your site origin. */
	illustrationUrl?: string;
};

const BRAND_PINK = "#FF87A6";
const PAGE_BG = "#f3f4f6";
const CARD_BORDER = "#e5e7eb";
const TEXT_MUTED = "#4b5563";
const TEXT_HEADING = "#111827";

function escapeHtml(s: string): string {
	return s
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#39;");
}

/** Only allow web URLs in <a href> and <img src> to avoid data injection. */
function safeWebUrl(url: string): string {
	const u = new URL(url.trim());
	if (u.protocol !== "https:" && u.protocol !== "http:") {
		throw new Error("Email URL must use http or https");
	}
	return u.href;
}

function safeEmailSubject(s: string): string {
	return s.replace(/[\r\n]/g, " ").trim();
}

/**
 * Emails load logo and hero images from this origin. Set `NEXT_PUBLIC_BASE_URL`
 * to your deployed HTTPS URL in production so images render for recipients.
 */
function getPublicOrigin(): string {
	const raw =
		process.env.NEXT_PUBLIC_BASE_URL?.trim() || "http://localhost:3000";
	return raw.replace(/\/$/, "");
}

function publicAssetUrl(path: string): string {
	const origin = getPublicOrigin();
	const p = path.startsWith("/") ? path : `/${path}`;
	return safeWebUrl(`${origin}${p}`);
}

function defaultIllustrationUrl(): string {
	return publicAssetUrl("/email/invite-hero.png");
}

function logoUrl(): string {
	return publicAssetUrl("/email/zotmeet-logo.png");
}

export function createBrandedTransactionalEmail(
	input: BrandedTransactionalEmailInput,
) {
	const verifiedCtaUrl = safeWebUrl(input.ctaUrl);
	const verifiedFooterUrl = safeWebUrl(input.footerLearnMoreUrl);
	const illustration = safeWebUrl(
		input.illustrationUrl ?? defaultIllustrationUrl(),
	);
	const verifiedLogoUrl = logoUrl();
	const subject = safeEmailSubject(input.subject);
	const topicWord = input.footerTopic === "groups" ? "groups" : "meetings";

	const bodyHtml = input.bodyLines
		.map(
			(line) =>
				`<p style="margin:0 0 16px;font-family:Helvetica,Arial,sans-serif;font-size:15px;line-height:1.55;color:${TEXT_MUTED};">${escapeHtml(line)}</p>`,
		)
		.join("");

	const textBody = [
		input.headline,
		"",
		...input.bodyLines,
		"",
		`${input.ctaLabel}: ${verifiedCtaUrl}`,
		"",
		`Learn more about ZotMeet ${topicWord}: ${verifiedFooterUrl}`,
	].join("\n");

	return {
		subject,
		text: textBody,
		html: `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>${escapeHtml(subject)}</title>
  </head>
  <body style="margin:0;padding:0;background-color:${PAGE_BG};">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:${PAGE_BG};padding:24px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:560px;background-color:#ffffff;border:1px solid ${CARD_BORDER};border-radius:12px;overflow:hidden;">
            <tr>
              <td style="padding:32px 28px 8px;text-align:center;">
                <img src="${escapeHtml(verifiedLogoUrl)}" width="64" height="64" alt="ZotMeet" style="display:block;margin:0 auto 20px;border-radius:14px;" />
                <h1 style="margin:0;font-family:Helvetica,Arial,sans-serif;font-size:22px;line-height:1.3;font-weight:700;color:${TEXT_HEADING};">${escapeHtml(input.headline)}</h1>
              </td>
            </tr>
            <tr>
              <td style="padding:8px 28px 8px;text-align:left;">
                ${bodyHtml}
              </td>
            </tr>
            <tr>
              <td align="center" style="padding:8px 28px 24px;">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" style="margin:0 auto;">
                  <tr>
                    <td bgcolor="${BRAND_PINK}" style="border-radius:10px;mso-line-height-rule:exactly;">
                      <a href="${escapeHtml(verifiedCtaUrl)}" style="display:inline-block;padding:14px 32px;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:600;color:#ffffff;text-decoration:none;border-radius:10px;">${escapeHtml(input.ctaLabel)}</a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:0;line-height:0;font-size:0;">
                <img src="${escapeHtml(illustration)}" width="560" alt="" style="display:block;width:100%;max-width:560px;height:auto;border:0;" />
              </td>
            </tr>
            <tr>
              <td style="padding:20px 28px 28px;text-align:center;">
                <p style="margin:0;font-family:Helvetica,Arial,sans-serif;font-size:14px;line-height:1.5;color:${TEXT_MUTED};">
                  <a href="${escapeHtml(verifiedFooterUrl)}" style="color:${BRAND_PINK};font-weight:600;text-decoration:underline;">Learn more</a>
                  <span> about ZotMeet ${topicWord}.</span>
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`.trim(),
	};
}
