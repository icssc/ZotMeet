const DURATION_SUFFIX_REGEX =
	/\s*\((\d+(?:\.\d+)?)\s*(hours?|hrs?|minutes?|mins?)\)\s*$/i;

export function stripRoomDurationSuffix(name: string): string {
	return name.replace(DURATION_SUFFIX_REGEX, "").trim();
}

export function parseRoomDurationMinutes(name: string): number | null {
	const match = name.match(DURATION_SUFFIX_REGEX);
	if (!match) return null;
	const value = Number(match[1]);
	const isHours = match[2].toLowerCase().startsWith("h");
	return isHours ? value * 60 : value;
}

export const BUILDINGS = [
	"Anteater Learning Pavilion",
	"Science Library",
	"Langson Library",
	"Gateway Study Center",
	"Plaza Verde",
	"Multimedia Resources Center",
] as const;
export type Building = (typeof BUILDINGS)[number];

export const LOCATION_DISPLAY_NAMES: Record<Building, string> = {
	"Anteater Learning Pavilion": "ALP",
	"Science Library": "Sci Lib",
	"Langson Library": "Langson",
	"Gateway Study Center": "Gateway",
	"Plaza Verde": "PV",
	"Multimedia Resources Center": "MRC",
};

export function formatLocation(location: string): string {
	return LOCATION_DISPLAY_NAMES[location as Building] ?? location;
}

/** The building a free-text location search means, e.g. "sci" → Science Library. */
export function matchBuilding(query: string): Building | null {
	const q = query.trim().toLowerCase();
	if (!q) return null;
	const labels = (b: Building) =>
		[b, LOCATION_DISPLAY_NAMES[b]].map((s) => s.toLowerCase());
	const qWords = q.split(/\s+/);
	return (
		BUILDINGS.find((b) => labels(b).includes(q)) ??
		BUILDINGS.find((b) => labels(b).some((l) => l.startsWith(q))) ??
		BUILDINGS.find((b) =>
			qWords.some((w) =>
				b
					.toLowerCase()
					.split(" ")
					.some((bw) => bw.startsWith(w)),
			),
		) ??
		BUILDINGS.find((b) => labels(b).some((l) => l.includes(q))) ??
		null
	);
}

/** Pulls a room id/number from API names like "Science 227" or "Study Pod 1A". */
export function extractRoomNumber(roomName: string): string | null {
	const base = stripRoomDurationSuffix(roomName);
	const trailing = base.match(/(\d+[A-Za-z]?)\s*$/);
	if (trailing) return trailing[1];
	const first = base.match(/\b(\d+[A-Za-z]?)\b/);
	return first ? first[1] : null;
}

/** Chip label, e.g. "Science Library" + "Science 227" → "Sci Lib 227". */
export function formatRoomChipLabel(
	location: string,
	roomName: string,
): string {
	const shortLocation = formatLocation(location);
	const roomNumber = extractRoomNumber(roomName);
	if (roomNumber) return `${shortLocation} ${roomNumber}`;
	const baseName = stripRoomDurationSuffix(roomName);
	return baseName || shortLocation;
}
