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
import { buildTimeArray, formatISOToLocalTime } from "@/lib/rooms/utils";
import type { StudyRooms } from "@/lib/types/studyrooms";
import { cn } from "@/lib/utils";

const slotStart = "2026-04-06T11:00:00Z"; // 11:00am UTC
const slotEnd = "2026-04-06T17:00:00Z"; // 5:00pm UTC

const timestamps = buildTimeArray(slotStart, slotEnd);

interface RoomsHeatmapProps {
	rooms: StudyRooms["data"];
	timeRange: string;
}

export const RoomsHeatmap = ({ rooms, timeRange }: RoomsHeatmapProps) => {
	return (
		<div className="">
			<p>{timeRange}</p>
			<Table size="small" sx={{ borderCollapse: "collapse", borderSpacing: 0 }}>
				<TableHead>
					<TableRow>
						<TableCell>Rooms</TableCell>
						{timestamps.map((t) => (
							<TableCell key={t} align="center">
								<p className="w-14 whitespace-nowrap">{t}</p>
							</TableCell>
						))}
					</TableRow>
				</TableHead>

				<TableBody>
					{rooms.map((room) => (
						<TableRow key={room.id}>
							<TableCell className="whitespace-nowrap">
								<p>{room.location}</p>

								<div className="flex items-center gap-2 text-xs">
									<p className="text-xs">{room.name}</p>
									<p>{room.capacity && `•  Cap: ${room.capacity}`}</p>
								</div>
								<p className="text-xs">{room.description?.slice(0, 50)}</p>
							</TableCell>

							{room.slots.map((s) => {
								return (
									<TableCell
										key={s.start}
										className="border border-gray-300"
										sx={{ padding: 0, height: "1px" }}
									>
										<ButtonBase
											component={Link}
											target="_blank"
											href={s.url}
											className={"h-full w-full"}
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
									</TableCell>
								);
							})}
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
};
