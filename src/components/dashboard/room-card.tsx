"use client";

import PeopleIcon from "@mui/icons-material/People";
import { Box, Card, CardActionArea, Typography } from "@mui/material";
import type { ReactNode } from "react";
import {
	type MetaEntry,
	MetaRow,
} from "@/components/dashboard/dashboard-parts";
import { type RecentRoom, recordRecentRoom } from "@/lib/rooms/recent-rooms";
import { formatLocation } from "@/lib/types/studyrooms";

/** A room card's rendered height, for the loading tiles that stand in for it. */
export const ROOM_CARD_SKELETON_HEIGHT = 85;

export function RoomCard({
	room,
	action,
}: {
	room: RecentRoom;
	action: ReactNode;
}) {
	const meta: MetaEntry[] = [
		{ key: "name", label: room.name },
		{ key: "capacity", label: String(room.capacity), icon: PeopleIcon },
		...(room.floor ? [{ key: "floor", label: room.floor }] : []),
	];

	return (
		<Card elevation={1} sx={{ borderRadius: 1 }}>
			<CardActionArea
				href={room.url}
				target="_blank"
				rel="noopener noreferrer"
				onClick={() => recordRecentRoom(room)}
				sx={{ p: 2 }}
			>
				<Box sx={{ display: "flex", alignItems: "center", gap: 4 }}>
					<Typography variant="h6" component="h3" noWrap sx={{ flex: 1 }}>
						{formatLocation(room.location)}
					</Typography>
					{action}
				</Box>
				<MetaRow entries={meta} />
			</CardActionArea>
		</Card>
	);
}
