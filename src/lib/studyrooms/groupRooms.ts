export type StudyRoomFromApi = {
	id: string;
	name: string;
	capacity: number;
	location: string;
	slots: Array<{
		studyRoomId: string;
		start: string;
		end: string;
		url: string;
		isAvailable: boolean;
	}>;
};

export type GroupedRooms = {
	location: string;
	rooms: {
		id: string;
		name: string;
		capacity: number;
	}[];
}[];

function extractRoomNumber(name: string): number | null {
	const matches = name.match(/\d+/g);
	if (!matches?.length) return null;
	const n = Number(matches[matches.length - 1]);
	return Number.isFinite(n) ? n : null;
}

export function groupRoomsByLocationAndRoom(
	rooms: StudyRoomFromApi[],
): GroupedRooms {
	const map = new Map<string, GroupedRooms[number]["rooms"]>();

	for (const r of rooms) {
		const loc = r.location || "Other";
		if (!map.has(loc)) map.set(loc, []);

		map.get(loc)!.push({
			id: r.id,
			name: r.name, // full name, e.g. "Science 176"
			capacity: r.capacity,
		});
	}

	const grouped: GroupedRooms = Array.from(map.entries()).map(
		([location, rs]) => {
			rs.sort((a, b) => {
				const aNum = extractRoomNumber(a.name);
				const bNum = extractRoomNumber(b.name);

				if (aNum !== null && bNum !== null) return aNum - bNum;
				if (aNum !== null) return -1;
				if (bNum !== null) return 1;

				return a.name.localeCompare(b.name);
			});

			return { location, rooms: rs };
		},
	);

	grouped.sort((a, b) => a.location.localeCompare(b.location));
	return grouped;
}
