import { useSyncExternalStore } from "react";
import {
	getRecentRooms,
	getServerRecentRooms,
	subscribeRecentRooms,
} from "@/lib/rooms/recent-rooms";

/** Recently opened study rooms; always empty during SSR and hydration. */
export function useRecentRooms() {
	return useSyncExternalStore(
		subscribeRecentRooms,
		getRecentRooms,
		getServerRecentRooms,
	);
}
