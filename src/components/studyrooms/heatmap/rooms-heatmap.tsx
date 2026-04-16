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
import Link from "next/link";
import { useMemo, useState } from "react";
import {
	buildHalfHourIntervals,
	formatISOToLocalTime,
	groupSlotsIntoIntervals,
	mergeDateAndTime,
} from "@/lib/rooms/utils";
import type { StudyRooms } from "@/lib/types/studyrooms";
import { cn } from "@/lib/utils";

interface RoomsHeatmapProps {
	rooms: StudyRooms["data"];
	searchDate: Date;
	startTime: Date;
	endTime: Date;
}

type SortKey =
	| "default"
	| "location"
	| "capacity"
	| "availability"
	| "techEnhanced";

export const RoomsHeatmap = ({
	rooms,
	searchDate,
	startTime,
	endTime,
}: RoomsHeatmapProps) => {
	const [sortBy, setSortBy] = useState<SortKey>("default");

	const intervals = buildHalfHourIntervals(searchDate, startTime, endTime);
	const windowStart = mergeDateAndTime(searchDate, startTime);

	const sortedRooms = useMemo(() => {
		const copy = rooms.filter((r) => r.name);
		switch (sortBy) {
			case "location":
				return copy.sort((a, b) => a.location.localeCompare(b.location));
			case "capacity":
				return copy.sort((a, b) => {
					if (!a.capacity && !b.capacity) return 0;
					if (!a.capacity) return 1;
					if (!b.capacity) return -1;
					return a.capacity - b.capacity;
				});
			case "availability": {
				const countAvailable = (room: (typeof rooms)[number]) =>
					room.slots.filter(
						(s) => new Date(s.start) >= windowStart && s.isAvailable,
					).length;
				return copy.sort((a, b) => countAvailable(b) - countAvailable(a));
			}
			case "techEnhanced":
				return copy.sort(
					(a, b) => Number(b.techEnhanced) - Number(a.techEnhanced),
				);
			default:
				return copy;
		}
	}, [rooms, sortBy, windowStart]);

	return (
		<div>
			<Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 1 }}>
				<FormControl size="small" sx={{ minWidth: 160 }}>
					<InputLabel>Sort by</InputLabel>
					<Select
						value={sortBy}
						label="Sort by"
						onChange={(e) => setSortBy(e.target.value as SortKey)}
					>
						<MenuItem value="default">Default</MenuItem>
						<MenuItem value="location">Location</MenuItem>
						<MenuItem value="capacity">Capacity</MenuItem>
						<MenuItem value="availability">Availability</MenuItem>
						<MenuItem value="techEnhanced">Tech Enhanced</MenuItem>
					</Select>
				</FormControl>
			</Stack>
			<Table size="small" sx={{ borderCollapse: "collapse", borderSpacing: 0 }}>
				<TableHead>
					<TableRow>
						<TableCell>Rooms</TableCell>
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
								<TableCell className="whitespace-nowrap">
									<p>{room.location}</p>
									<div className="flex items-center gap-2 text-xs">
										<p className="text-xs">{room.name}</p>
										<p>{room.capacity ? `•  Cap: ${room.capacity}` : null}</p>
									</div>
									<p className="text-xs">{room.description?.slice(0, 50)}</p>
								</TableCell>

								{buckets.map((bucket) => (
									<TableCell
										key={bucket.intervalLabel}
										className="border border-gray-300"
										sx={{ padding: 0, height: "1px" }}
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
		</div>
	);
};
