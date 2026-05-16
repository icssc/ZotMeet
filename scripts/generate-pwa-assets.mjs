#!/usr/bin/env node
/**
 * Generates PWA / iOS App Store icon assets from the source SVG.
 *
 * Outputs are written to `public/icons/` and `public/`.
 * Run with: `node scripts/generate-pwa-assets.mjs`
 */
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const SOURCE_SVG = path.join(ROOT, "public", "zotmeet-logo.svg");
const ICONS_DIR = path.join(ROOT, "public", "icons");

// Brand colors (must stay in sync with `app/manifest.ts` and globals.css).
const BACKGROUND_HEX = "#FFFFFF";
const ACCENT_HEX = "#F26489";

const ANY_SIZES = [72, 96, 128, 144, 152, 192, 256, 384, 512, 1024];
const MASKABLE_SIZES = [192, 512];
const APPLE_TOUCH_SIZE = 180;
const FAVICON_SIZES = [16, 32, 48];

async function ensureDir(dir) {
	await fs.mkdir(dir, { recursive: true });
}

/**
 * Render the source SVG centered on a square canvas.
 *
 * @param {object} opts
 * @param {number} opts.size - output size in pixels (square)
 * @param {number} opts.padding - fraction of size reserved as padding (0..1)
 * @param {string} opts.background - background fill (hex or "transparent")
 * @returns {Promise<Buffer>}
 */
async function renderSquare({ size, padding, background }) {
	const inner = Math.round(size * (1 - padding * 2));
	const svgBuffer = await fs.readFile(SOURCE_SVG);
	const rendered = await sharp(svgBuffer, { density: 512 })
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

async function writeAnyIcon(size) {
	const buf = await renderSquare({
		size,
		padding: 0.1,
		background: BACKGROUND_HEX,
	});
	const out = path.join(ICONS_DIR, `icon-${size}.png`);
	await fs.writeFile(out, buf);
	console.log(`  any:      ${path.relative(ROOT, out)}  (${size}x${size})`);
}

async function writeMaskableIcon(size) {
	// Maskable icons need a 20% safe zone on each edge so that aggressive
	// platform masks (Android, iOS) do not crop the brand mark.
	const buf = await renderSquare({
		size,
		padding: 0.2,
		background: ACCENT_HEX,
	});
	const out = path.join(ICONS_DIR, `maskable-${size}.png`);
	await fs.writeFile(out, buf);
	console.log(`  maskable: ${path.relative(ROOT, out)}  (${size}x${size})`);
}

async function writeAppleTouchIcon() {
	// Apple touch icons must be opaque (no alpha channel). Use solid white bg.
	const buf = await renderSquare({
		size: APPLE_TOUCH_SIZE,
		padding: 0.1,
		background: BACKGROUND_HEX,
	});
	// Strip alpha to ensure opaque output, which iOS expects.
	const opaque = await sharp(buf)
		.flatten({ background: BACKGROUND_HEX })
		.png()
		.toBuffer();
	const out = path.join(ROOT, "public", "apple-touch-icon.png");
	await fs.writeFile(out, opaque);
	console.log(
		`  apple:    ${path.relative(ROOT, out)}  (${APPLE_TOUCH_SIZE}x${APPLE_TOUCH_SIZE})`,
	);
}

async function writeFavicons() {
	for (const size of FAVICON_SIZES) {
		const buf = await renderSquare({
			size,
			padding: 0.05,
			background: "transparent",
		});
		const out = path.join(ICONS_DIR, `favicon-${size}.png`);
		await fs.writeFile(out, buf);
		console.log(`  favicon:  ${path.relative(ROOT, out)}  (${size}x${size})`);
	}
}

async function main() {
	console.log("Generating PWA icon assets…");
	await ensureDir(ICONS_DIR);

	for (const size of ANY_SIZES) await writeAnyIcon(size);
	for (const size of MASKABLE_SIZES) await writeMaskableIcon(size);
	await writeAppleTouchIcon();
	await writeFavicons();

	console.log("\nDone.");
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
