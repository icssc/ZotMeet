export function darken(hex: string, amount = 0.15): string {
	let h = hex.replace("#", "");
	if (h.length === 3) {
		h = h
			.split("")
			.map((c) => c + c)
			.join("");
	}
	const n = Number.parseInt(h, 16);
	const scale = 1 - amount;
	const r = Math.round(((n >> 16) & 255) * scale);
	const g = Math.round(((n >> 8) & 255) * scale);
	const b = Math.round((n & 255) * scale);
	return `#${[r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("")}`;
}
