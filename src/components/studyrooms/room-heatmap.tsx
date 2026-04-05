"use client";

import {
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Tooltip,
	Typography,
} from "@mui/material";
import { Fragment } from "react";

import type { StudyRooms } from "@/lib/types/studyrooms";

interface RoomHeatmapProps {
	rooms: StudyRooms["data"];
	timeRange: string;
}

const parseTimeStringToMinutes = (time: string): number => {
	const isPM = time.endsWith("pm");
	const isAM = time.endsWith("am");
	const cleaned = time.replace("am", "").replace("pm", "");
	const [h, m] = cleaned.split(":").map(Number);
	let hours = h;
	if (isPM && h !== 12) hours += 12;
	if (isAM && h === 12) hours = 0;
	return hours * 60 + (m || 0);
};

const slotUTCMinutes = (isoString: string): number => {
	const d = new Date(isoString);
	return d.getUTCHours() * 60 + d.getUTCMinutes();
};

const formatMinutes = (mins: number): string => {
	const totalMins = mins % (24 * 60);
	const hours = Math.floor(totalMins / 60);
	const minutes = totalMins % 60;
	const period = hours >= 12 ? "pm" : "am";
	const displayHour = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
	return `${displayHour}:${String(minutes).padStart(2, "0")}${period}`;
};

const ROOM_COL_WIDTH = 220;
const SLOT_COL_WIDTH = 52;

export function RoomHeatmap({ rooms, timeRange }: RoomHeatmapProps) {
	if (rooms.length === 0) {
		return (
			<Typography color="text.secondary" sx={{ mt: 2 }}>
				No rooms found.
			</Typography>
		);
	}

	const [startStr, endStr] = timeRange.split("-");
	const startMins = parseTimeStringToMinutes(startStr);
	const endMins = parseTimeStringToMinutes(endStr);

	// Generate one column per 30-minute slot
	const slotColumns: number[] = [];
	for (let mins = startMins; mins < endMins; mins += 30) {
		slotColumns.push(mins);
	}

	// Group rooms by location, preserving insertion order
	const locationMap = new Map<string, StudyRooms["data"]>();
	for (const room of rooms) {
		if (!locationMap.has(room.location)) {
			locationMap.set(room.location, []);
		}
		locationMap.get(room.location)?.push(room);
	}

	// Build slot lookup: roomId -> Map<startUTCMins, { isAvailable, url }>
	type SlotInfo = { isAvailable: boolean; url: string };
	const slotLookup = new Map<string, Map<number, SlotInfo>>();
	for (const room of rooms) {
		const map = new Map<number, SlotInfo>();
		for (const slot of room.slots) {
			const mins = slotUTCMinutes(slot.start);
			map.set(mins, { isAvailable: slot.isAvailable, url: slot.url });
		}
		slotLookup.set(room.id, map);
	}

	return (
		<TableContainer
			component={Paper}
			variant="outlined"
			sx={{ maxHeight: "70vh", overflow: "auto", mt: 2 }}
		>
			<Table
				stickyHeader
				size="small"
				sx={{ tableLayout: "fixed", borderCollapse: "separate" }}
			>
				<TableHead>
					<TableRow>
						{/* Sticky top-left corner */}
						<TableCell
							sx={{
								width: ROOM_COL_WIDTH,
								minWidth: ROOM_COL_WIDTH,
								position: "sticky",
								left: 0,
								zIndex: 4,
								bgcolor: "background.paper",
								fontWeight: 700,
								borderRight: "1px solid",
								borderColor: "divider",
							}}
						>
							Rooms
						</TableCell>

						{slotColumns.map((mins) => (
							<TableCell
								key={mins}
								align="left"
								sx={{
									width: SLOT_COL_WIDTH,
									minWidth: SLOT_COL_WIDTH,
									px: 0.5,
									py: 0.75,
									fontSize: "0.7rem",
									whiteSpace: "nowrap",
									fontWeight: mins % 60 === 0 ? 600 : 400,
									color: mins % 60 === 0 ? "text.primary" : "text.disabled",
									borderLeft: "1px solid",
									borderColor: "divider",
									zIndex: 2,
								}}
							>
								{mins % 60 === 0 ? formatMinutes(mins) : ""}
							</TableCell>
						))}
					</TableRow>
				</TableHead>

				<TableBody>
					{Array.from(locationMap.entries()).map(
						([location, locationRooms]) => (
							<Fragment key={location}>
								{/* Location header row */}
								<TableRow>
									<TableCell
										colSpan={slotColumns.length + 1}
										sx={{
											bgcolor: "grey.50",
											fontWeight: 700,
											fontSize: "0.78rem",
											py: 0.75,
											px: 1.5,
											color: "text.secondary",
											letterSpacing: "0.04em",
											textTransform: "uppercase",
											position: "sticky",
											left: 0,
										}}
									>
										{location}
									</TableCell>
								</TableRow>

								{/* Room rows */}
								{locationRooms.map((room) => {
									const roomSlots = slotLookup.get(room.id);
									return (
										<TableRow
											key={room.id}
											hover
											sx={{ "&:last-child td": { borderBottom: 0 } }}
										>
											{/* Sticky room name column */}
											<TableCell
												sx={{
													position: "sticky",
													left: 0,
													zIndex: 1,
													bgcolor: "background.paper",
													borderRight: "1px solid",
													borderColor: "divider",
													minWidth: ROOM_COL_WIDTH,
													maxWidth: ROOM_COL_WIDTH,
													py: 0.5,
												}}
											>
												<Typography
													variant="body2"
													fontWeight={600}
													noWrap
													sx={{ lineHeight: 1.3 }}
												>
													{room.name}
												</Typography>
												<Typography variant="caption" color="text.secondary">
													Cap {room.capacity}
												</Typography>
											</TableCell>

											{/* Slot cells */}
											{slotColumns.map((mins) => {
												const slotInfo = roomSlots?.get(mins);
												const isAvailable = slotInfo?.isAvailable;
												const url = slotInfo?.url;

												const bgColor =
													isAvailable === undefined
														? "transparent"
														: isAvailable
															? "#c8e6c9"
															: "#ffcdd2";

												const hoverBg =
													isAvailable === undefined
														? undefined
														: isAvailable
															? "#a5d6a7"
															: "#ef9a9a";

												return (
													<Tooltip
														key={mins}
														title={
															isAvailable === undefined
																? ""
																: `${formatMinutes(mins)} – ${formatMinutes(mins + 30)}: ${isAvailable ? "Available" : "Booked"}`
														}
														arrow
														placement="top"
													>
														<TableCell
															sx={{
																bgcolor: bgColor,
																p: 0,
																height: 40,
																cursor: isAvailable ? "pointer" : "default",
																borderLeft: "1px solid",
																borderColor: "divider",
																transition: "background-color 0.15s",
																"&:hover": isAvailable
																	? { bgcolor: hoverBg }
																	: {},
															}}
															onClick={() => {
																if (isAvailable && url) {
																	window.open(url, "_blank");
																}
															}}
														/>
													</Tooltip>
												);
											})}
										</TableRow>
									);
								})}
							</Fragment>
						),
					)}
				</TableBody>
			</Table>
		</TableContainer>
	);
}
