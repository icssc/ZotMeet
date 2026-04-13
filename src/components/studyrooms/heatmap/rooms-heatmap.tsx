import {
	ButtonBase,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	Tooltip,
} from "@mui/material";
import Link from "next/link";
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

export const RoomsHeatmap = ({
	rooms,
	searchDate,
	startTime,
	endTime,
}: RoomsHeatmapProps) => {
	const intervals = buildHalfHourIntervals(searchDate, startTime, endTime);
	const windowStart = mergeDateAndTime(searchDate, startTime);

	return (
		<div>
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
					{rooms.map((room) => {
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
										<p>{room.capacity && `•  Cap: ${room.capacity}`}</p>
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
