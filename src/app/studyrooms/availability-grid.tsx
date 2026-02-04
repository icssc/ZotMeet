"use client";

import { Box, Typography } from "@mui/material";
import * as React from "react";
import type {
	GroupedRooms,
	StudyRoomFromApi,
} from "@/lib/studyrooms/groupRooms";

type Props = {
	mode: "header" | "body";
	groupedRooms: GroupedRooms;
	roomsFromApi: StudyRoomFromApi[];

	rowHeightPx?: number;
	groupHeaderHeightPx?: number;
	timeHeaderHeightPx?: number;

	startHour?: number;
	endHour?: number;
	slotMinutes?: 15 | 30 | 60;
	colWidthPx?: number;

	// ✅ used for horizontal scroll syncing
	scrollRef?: React.RefObject<HTMLDivElement | null>;
	onScroll?: () => void;
};

function formatHourLabel(hour: number) {
	const h = hour % 12 === 0 ? 12 : hour % 12;
	const ampm = hour < 12 ? "am" : "pm";
	return `${h}:00${ampm}`;
}

function buildTimeKeys(
	startHour: number,
	endHour: number,
	slotMinutes: number,
) {
	const totalMinutes = (endHour - startHour) * 60;
	const count = Math.ceil(totalMinutes / slotMinutes);
	const keys: string[] = [];
	for (let i = 0; i < count; i++) {
		const mins = i * slotMinutes;
		const h = startHour + Math.floor(mins / 60);
		const m = mins % 60;
		keys.push(`${h}:${String(m).padStart(2, "0")}`);
	}
	return keys;
}

function timeKeyFromISO(iso: string) {
	const d = new Date(iso);
	return `${d.getHours()}:${String(d.getMinutes()).padStart(2, "0")}`;
}

export default function AvailabilityGrid({
	mode,
	groupedRooms,
	roomsFromApi,
	rowHeightPx = 44,
	groupHeaderHeightPx = 36,
	timeHeaderHeightPx = 48,
	startHour = 0,
	endHour = 24,
	slotMinutes = 30,
	colWidthPx = 60,
	scrollRef,
	onScroll,
}: Props) {
	const timeKeys = React.useMemo(
		() => buildTimeKeys(startHour, endHour, slotMinutes),
		[startHour, endHour, slotMinutes],
	);

	const slotsCount = timeKeys.length;
	const gridWidth = slotsCount * colWidthPx;

	const availableByRoom = React.useMemo(() => {
		const map = new Map<string, Set<string>>();
		for (const room of roomsFromApi) {
			const set = new Set<string>();
			for (const s of room.slots ?? []) {
				if (s.isAvailable) set.add(timeKeyFromISO(s.start));
			}
			map.set(room.id, set);
		}
		return map;
	}, [roomsFromApi]);

	const hours = React.useMemo(() => {
		const out: number[] = [];
		for (let h = startHour; h < endHour; h++) out.push(h);
		return out;
	}, [startHour, endHour]);

	// ✅ HEADER ONLY: ref + onScroll must be on the overflowX container
	if (mode === "header") {
		return (
			<Box
				ref={scrollRef}
				onScroll={onScroll}
				sx={{
					overflowX: "auto",
					overflowY: "hidden",
					// helps trackpads feel consistent
					WebkitOverflowScrolling: "touch",
				}}
			>
				<Box
					sx={{
						width: gridWidth,
						minWidth: gridWidth,
						height: timeHeaderHeightPx,
						display: "flex",
					}}
				>
					{hours.map((h) => {
						const hourWidth = (60 / slotMinutes) * colWidthPx;
						return (
							<Box
								key={h}
								sx={{
									width: hourWidth,
									minWidth: hourWidth,
									borderRight: "1px solid",
									borderColor: "divider",
									px: 1,
									display: "flex",
									alignItems: "center",
								}}
							>
								<Typography variant="caption" fontWeight={700}>
									{formatHourLabel(h)}
								</Typography>
							</Box>
						);
					})}
				</Box>
			</Box>
		);
	}

	// ✅ BODY ONLY: ref + onScroll must be on the overflowX container
	return (
		<Box>
			<Box
				ref={scrollRef}
				onScroll={onScroll}
				sx={{
					overflowX: "auto",
					overflowY: "hidden",
					WebkitOverflowScrolling: "touch",
				}}
			>
				<Box sx={{ width: gridWidth, minWidth: gridWidth }}>
					{groupedRooms.map((group) => (
						<Box key={group.location}>
							{/* group header spacer row to align with sidebar */}
							<Box
								sx={{
									height: groupHeaderHeightPx,
									borderBottom: "1px solid",
									borderColor: "divider",
									bgcolor: "background.paper",
								}}
							/>

							{group.rooms.map((room) => {
								const available =
									availableByRoom.get(room.id) ?? new Set<string>();

								return (
									<Box
										key={room.id}
										sx={{
											height: rowHeightPx,
											borderBottom: "1px solid",
											borderColor: "divider",
											display: "grid",
											gridTemplateColumns: `repeat(${slotsCount}, ${colWidthPx}px)`,
										}}
									>
										{timeKeys.map((k, idx) => {
											const isAvail = available.has(k);
											return (
												<Box
													key={`${room.id}-${k}`}
													sx={{
														borderRight: "1px solid",
														borderColor:
															idx % (60 / slotMinutes) === 0
																? "divider"
																: "rgba(0,0,0,0.10)",
														bgcolor: isAvail
															? "rgba(46, 125, 50, 0.25)"
															: "rgba(211, 47, 47, 0.12)",
													}}
												/>
											);
										})}
									</Box>
								);
							})}
						</Box>
					))}
				</Box>
			</Box>

			{/* Legend */}
			<Box sx={{ display: "flex", gap: 2, alignItems: "center", px: 2, py: 1 }}>
				<Box
					sx={{
						width: 14,
						height: 14,
						bgcolor: "rgba(46, 125, 50, 0.6)",
						borderRadius: 0.5,
					}}
				/>
				<Typography variant="caption">Available</Typography>

				<Box
					sx={{
						width: 14,
						height: 14,
						bgcolor: "rgba(211, 47, 47, 0.35)",
						borderRadius: 0.5,
					}}
				/>
				<Typography variant="caption">Unavailable</Typography>
			</Box>
		</Box>
	);
}
