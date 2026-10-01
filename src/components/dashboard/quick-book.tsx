"use client";

import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import SensorsIcon from "@mui/icons-material/Sensors";
import { Box, Button, Skeleton, Typography } from "@mui/material";
import { format } from "date-fns";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
	SectionCard,
	SectionHeading,
} from "@/components/dashboard/dashboard-parts";
import { RoomCard } from "@/components/dashboard/room-card";
import { fetchStudyRooms } from "@/lib/rooms/get-rooms";
import type { RecentRoom } from "@/lib/rooms/recent-rooms";
import {
	formatISOToLocalTime,
	getFreeUntil,
	getQuickBookWindow,
	getRoomFloor,
	toLocalStr,
} from "@/lib/rooms/utils";
import { stripRoomDurationSuffix } from "@/lib/types/studyrooms";

const QUICK_BOOK_ROOMS = 6;
const QUICK_BOOK_MIN_CAPACITY = 4;

type FreeRoom = RecentRoom & { freeUntil: Date };

type QuickBookState =
	| { status: "loading" }
	| { status: "error" }
	| { status: "ready"; rooms: FreeRoom[] };

// Rooms with 4 cap and  de-duplicated by building + base name.
function useFreeRoomsNow(): QuickBookState {
	const [state, setState] = useState<QuickBookState>({ status: "loading" });

	useEffect(() => {
		const controller = new AbortController();
		const now = new Date();
		const { start, end } = getQuickBookWindow(now);

		if (end <= start) {
			setState({ status: "ready", rooms: [] });
			return;
		}

		fetchStudyRooms(
			{
				date: format(start, "yyyy-MM-dd"),
				timeRange: `${toLocalStr(start)}-${toLocalStr(end)}`,
				capacityMin: QUICK_BOOK_MIN_CAPACITY,
			},
			{ signal: controller.signal },
		)
			.then(({ data }) => {
				const byRoom = new Map<string, FreeRoom>();
				for (const room of data) {
					// The API occasionally returns placeholder rooms with no name.
					if (!room.name || !room.location) continue;
					const freeUntil = getFreeUntil(room.slots, now);
					if (!freeUntil) continue;
					const name = stripRoomDurationSuffix(room.name);
					const key = `${room.location}:${name}`;
					const existing = byRoom.get(key);
					if (existing && existing.freeUntil >= freeUntil) continue;
					byRoom.set(key, {
						id: room.id,
						name,
						location: room.location,
						capacity: room.capacity,
						floor: getRoomFloor(room),
						url: room.url,
						freeUntil,
					});
				}
				const rooms = [...byRoom.values()]
					.sort(
						(a, b) =>
							b.freeUntil.getTime() - a.freeUntil.getTime() ||
							a.name.localeCompare(b.name),
					)
					.slice(0, QUICK_BOOK_ROOMS);
				setState({ status: "ready", rooms });
			})
			.catch((err) => {
				if ((err as Error)?.name === "AbortError") return;
				console.error("Failed to load Quick Book rooms:", err);
				setState({ status: "error" });
			});

		return () => controller.abort();
	}, []);

	return state;
}

export function QuickBook() {
	const state = useFreeRoomsNow();

	return (
		<SectionCard
			component="section"
			sx={{
				p: { xs: 2, sm: 3.75 },
				display: "flex",
				flexDirection: "column",
				gap: 3,
			}}
		>
			<Box
				sx={{
					display: "flex",
					alignItems: { xs: "flex-start", sm: "center" },
					flexDirection: { xs: "column", sm: "row" },
					gap: 1.5,
				}}
			>
				<Box sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 1 }}>
					<SectionHeading>Quick Book</SectionHeading>
					<Typography variant="body1" color="text.secondary">
						Study rooms on campus that are free right now.
					</Typography>
				</Box>
				<Button
					component={Link}
					href="/studyrooms"
					size="small"
					endIcon={<ChevronRightIcon sx={{ color: "inherit" }} />}
					sx={{ typography: "caption", color: "primary.main" }}
				>
					View all meeting rooms
				</Button>
			</Box>

			{state.status === "loading" ? (
				<RoomGrid>
					{Array.from({ length: QUICK_BOOK_ROOMS }, (_, i) => (
						<Skeleton key={i} variant="rounded" height={85} />
					))}
				</RoomGrid>
			) : state.status === "error" ? (
				<Typography color="text.secondary">
					Couldn't load study rooms. Try again later.
				</Typography>
			) : state.rooms.length === 0 ? (
				<Typography color="text.secondary">
					No study rooms are free right now.
				</Typography>
			) : (
				<RoomGrid>
					{state.rooms.map((room) => (
						<RoomCard
							key={room.id}
							room={room}
							action={<FreeUntil until={room.freeUntil} />}
						/>
					))}
				</RoomGrid>
			)}
		</SectionCard>
	);
}

function RoomGrid({ children }: { children: React.ReactNode }) {
	return (
		<Box
			sx={{
				display: "grid",
				gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" },
				columnGap: 4.5,
				rowGap: 1.5,
			}}
		>
			{children}
		</Box>
	);
}

function FreeUntil({ until }: { until: Date }) {
	return (
		<Box
			sx={{
				display: "flex",
				alignItems: "center",
				gap: 0.5,
				flexShrink: 0,
				color: "success.main",
			}}
		>
			<SensorsIcon sx={{ fontSize: 16, color: "inherit" }} />
			<Typography variant="caption" color="inherit">
				Free until {formatISOToLocalTime(until.toISOString())}
			</Typography>
		</Box>
	);
}
