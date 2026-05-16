import {
	ButtonBase,
	FormControl,
	InputLabel,
	MenuItem,
	Select,
	Stack,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	Tooltip,
} from "@mui/material";
import Box from "@mui/material/Box";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import {
	buildHalfHourIntervals,
	formatISOToLocalTime,
	groupSlotsIntoIntervals,
	mergeDateAndTime,
} from "@/lib/rooms/utils";
import { BUILDINGS, type StudyRooms } from "@/lib/types/studyrooms";
import { cn } from "@/lib/utils";

interface RoomsHeatmapProps {
	rooms: StudyRooms["data"];
	searchDate: Date;
	startTime: Date;
	endTime: Date;
}

type SortKey = "default" | "capacity" | "availability";

const LOCATION_SORT_ORDER: readonly string[] = [
	"Science Library",
	...BUILDINGS.filter((b) => b !== "Science Library"),
];

function compareLocationSort(a: string, b: string): number {
	const ia = LOCATION_SORT_ORDER.indexOf(a);
	const ib = LOCATION_SORT_ORDER.indexOf(b);
	const aKnown = ia >= 0;
	const bKnown = ib >= 0;
	if (aKnown && bKnown) return ia - ib;
	if (aKnown && !bKnown) return -1;
	if (!aKnown && bKnown) return 1;
	return a.localeCompare(b);
}

export const RoomsHeatmap = ({
	rooms,
	searchDate,
	startTime,
	endTime,
}: RoomsHeatmapProps) => {
	const [sortBy, setSortBy] = useState<SortKey>("default");

	const intervals = buildHalfHourIntervals(searchDate, startTime, endTime);
	const windowStart = useMemo(
		() => mergeDateAndTime(searchDate, startTime),
		[searchDate, startTime],
	);
	const scrollRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const el = scrollRef.current;
		if (!el) return;
		const handler = (e: WheelEvent) => {
			const useHorizontalDelta = Math.abs(e.deltaX) >= Math.abs(e.deltaY);
			const delta = useHorizontalDelta ? e.deltaX : -e.deltaY;
			if (delta === 0) return;
			el.scrollLeft += delta;
			e.preventDefault();
		};
		el.addEventListener("wheel", handler, { passive: false });
		return () => el.removeEventListener("wheel", handler);
	}, []);

	const sortedRooms = useMemo(() => {
		const copy = rooms.filter((r) => r.name);
		switch (sortBy) {
			case "default":
				return copy.sort((a, b) => compareLocationSort(a.location, b.location));
			case "capacity":
				return copy.sort((a, b) => {
					if (!a.capacity && !b.capacity) return 0;
					if (!a.capacity) return 1;
					if (!b.capacity) return -1;
					return b.capacity - a.capacity;
				});
			case "availability": {
				const countAvailable = (room: (typeof rooms)[number]) =>
					room.slots.filter(
						(s) => new Date(s.start) >= windowStart && s.isAvailable,
					).length;
				return copy.sort((a, b) => countAvailable(b) - countAvailable(a));
			}
			default: {
				const _exhaustive: never = sortBy;
				return _exhaustive;
			}
		}
	}, [rooms, sortBy, windowStart]);

	return (
		<Box>
			<Stack
				direction="row"
				alignItems="center"
				spacing={2}
				sx={{ mb: 1, py: 1, px: 2 }}
			>
				<FormControl size="small" sx={{ minWidth: 160 }}>
					<InputLabel>Sort by</InputLabel>
					<Select
						value={sortBy}
						label="Sort by"
						onChange={(e) => setSortBy(e.target.value as SortKey)}
					>
						<MenuItem value="default">Default</MenuItem>
						<MenuItem value="capacity">Capacity</MenuItem>
						<MenuItem value="availability">Availability</MenuItem>
					</Select>
				</FormControl>
			</Stack>
			<Box
				sx={{ overflowX: "auto", overflowY: "hidden", position: "relative" }}
				ref={scrollRef}
			>
				<Table
					size="small"
					sx={{
						borderCollapse: "separate",
						borderSpacing: 0,
						fontSize: "0.7rem",
					}}
				>
					<TableHead>
						<TableRow>
							<TableCell
								sx={(theme) => ({
									position: "sticky",
									left: -3,
									zIndex: 3,
									minWidth: 200,
									backgroundColor: theme.palette.background.paper,
									boxShadow: `1px 0 0 ${theme.palette.divider}`,
								})}
							>
								Rooms
							</TableCell>
							{intervals.map((iv) => (
								<TableCell key={iv.label} align="center">
									<p className="w-14 whitespace-nowrap">{iv.label}</p>
								</TableCell>
							))}
						</TableRow>
					</TableHead>

					<TableBody>
						{sortedRooms.map((room) => {
							const sorted = [...room.slots]
								.sort(
									(a, b) =>
										new Date(a.start).getTime() - new Date(b.start).getTime(),
								)
								.filter((s) => new Date(s.start) >= windowStart);

							const buckets = groupSlotsIntoIntervals(sorted, intervals);

							return (
								<TableRow key={room.id}>
									<TableCell
										className="whitespace-nowrap"
										sx={(theme) => ({
											position: "sticky",
											left: -3,
											zIndex: 2,
											minWidth: 200,
											backgroundColor: theme.palette.background.paper,
										})}
									>
										<p className="">{room.location}</p>
										<div className="flex items-center gap-2 text-xs">
											<p className="text-xs">{room.name?.slice(0, 20)}</p>
											<p>{room.capacity ? `•  Cap: ${room.capacity}` : null}</p>
										</div>
										<p className="hidden text-xs sm:block">
											{room.description?.slice(0, 50)}
										</p>
									</TableCell>

									{buckets.map((bucket) => (
										<TableCell
											key={bucket.intervalLabel}
											className="border border-gray-300"
											sx={{
												padding: 0,
												height: "1px",
											}}
										>
											<div className="flex h-full">
												{bucket.slots.map((s) => (
													<ButtonBase
														key={s.start}
														component={Link}
														target="_blank"
														href={s.url}
														className="h-full"
														sx={{ flex: 1 }}
													>
														<Tooltip
															placement="top"
															title={`${formatISOToLocalTime(s.start)} - ${formatISOToLocalTime(s.end)}`}
														>
															<span
																className={cn(
																	"h-full w-full",
																	s.isAvailable ? "bg-green-300" : "bg-red-300",
																)}
															/>
														</Tooltip>
													</ButtonBase>
												))}
											</div>
										</TableCell>
									))}
								</TableRow>
							);
						})}
					</TableBody>
				</Table>
			</Box>
		</Box>
	);
};
