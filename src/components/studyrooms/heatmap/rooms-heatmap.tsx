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

interface RoomsHeatmapProps {
	rooms: StudyRooms["data"];
	timeRange: string;
	startTime: Date;
	endTime: Date;
}

export const RoomsHeatmap = ({
	rooms,
	startTime,
	endTime,
}: RoomsHeatmapProps) => {
	const timestamps = buildTimeArray(
		startTime.toISOString(),
		endTime.toISOString(),
	);

	return (
		<div className="">
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

							{[...room.slots]
								.sort(
									(a, b) =>
										new Date(a.start).getTime() - new Date(b.start).getTime(),
								)
								.map((s) => {
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
