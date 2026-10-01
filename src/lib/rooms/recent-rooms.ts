/**
 * The rooms this browser opened on UCI Libraries' booking site, newest first,
 * for the dashboard's "Recently Visited Rooms". Per-viewer convenience only:
 * it lives in localStorage, so it is empty on a new device and in private
 * windows, and every read/write tolerates storage being unavailable.
 */

import { z } from "zod";

const recentRoomSchema = z.object({
	id: z.string(),
	/** Room name without the booking-duration suffix, e.g. "Science 483". */
	name: z.string(),
	/** Building as the API names it, e.g. "Science Library". */
	location: z.string(),
	capacity: z.number(),
	floor: z.string().nullable(),
	/**
	 * The room's booking page, not the slot link that was clicked: a slot URL
	 * pins a date/time that has passed by the time the card is reopened.
	 */
	url: z.string(),
});

export type RecentRoom = z.infer<typeof recentRoomSchema>;

const STORAGE_KEY = "zotmeet:recent-rooms";
const MAX_RECENT_ROOMS = 10;
const EMPTY: RecentRoom[] = [];

const listeners = new Set<() => void>();
let cachedRaw: string | null = null;
let cachedRooms: RecentRoom[] = EMPTY;

function readRaw(): string | null {
	try {
		return window.localStorage.getItem(STORAGE_KEY);
	} catch {
		return null;
	}
}

function writeRaw(value: string | null) {
	try {
		if (value === null) window.localStorage.removeItem(STORAGE_KEY);
		else window.localStorage.setItem(STORAGE_KEY, value);
	} catch {
		// Storage blocked or full: the list just doesn't persist.
	}
	for (const listener of listeners) listener();
}

export function getRecentRooms(): RecentRoom[] {
	const raw = readRaw();
	if (raw === cachedRaw) return cachedRooms;
	cachedRaw = raw;
	try {
		const parsed: unknown = raw ? JSON.parse(raw) : [];
		// Drop malformed entries (hand-edited storage, an older shape) rather
		// than let one crash the dashboard.
		cachedRooms = Array.isArray(parsed)
			? parsed.flatMap((entry) => {
					const result = recentRoomSchema.safeParse(entry);
					return result.success ? [result.data] : [];
				})
			: EMPTY;
	} catch {
		cachedRooms = EMPTY;
	}
	return cachedRooms;
}

export function getServerRecentRooms(): RecentRoom[] {
	return EMPTY;
}

export function subscribeRecentRooms(listener: () => void) {
	listeners.add(listener);
	const onStorage = (e: StorageEvent) => {
		if (e.key === STORAGE_KEY) listener();
	};
	window.addEventListener("storage", onStorage);
	return () => {
		listeners.delete(listener);
		window.removeEventListener("storage", onStorage);
	};
}

const isSameRoom = (a: RecentRoom, b: RecentRoom) =>
	a.location === b.location && a.name === b.name;

export function recordRecentRoom(room: RecentRoom) {
	const next = [room, ...getRecentRooms().filter((r) => !isSameRoom(r, room))];
	writeRaw(JSON.stringify(next.slice(0, MAX_RECENT_ROOMS)));
}

export function clearRecentRooms() {
	writeRaw(null);
}
