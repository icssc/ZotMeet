// Writes a QR code pointing at the deployed preview into the exported site
// itself, so the PR comment can embed an image served from that same origin.
// Generating it here rather than calling a public QR service keeps the entire
// preview path inside infrastructure the org already owns — there is no
// third-party account or free tier to inherit at handoff.
import { mkdir } from "node:fs/promises";
import path from "node:path";
import QRCode from "qrcode";

const url = process.argv[2];

if (!url) {
	console.error("usage: emit-preview-qr.mjs <url>");
	process.exit(1);
}

const outFile = path.join(import.meta.dirname, "..", "dist", "qr.png");

await mkdir(path.dirname(outFile), { recursive: true });
// PNG rather than SVG: GitHub's image proxy serves PNG reliably in comments,
// while externally-hosted SVG is often blocked.
await QRCode.toFile(outFile, url, { width: 512, margin: 2 });

console.log(`Wrote ${outFile} -> ${url}`);
