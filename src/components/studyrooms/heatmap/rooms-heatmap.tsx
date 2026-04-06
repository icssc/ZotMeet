import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
} from "@mui/material";
import Link from "next/link";
import type { StudyRooms } from "@/lib/types/studyrooms";

const slotStart = "2026-04-06T11:00:00Z"; // 11:00am UTC
const slotEnd = "2026-04-06T17:00:00Z"; // 5:00pm UTC

const formatISOToLocalTime = (isoString: string): string => {
	return new Date(isoString)
		.toLocaleTimeString("en-US", {
			hour: "numeric",
			minute: "2-digit",
			hour12: true,
			timeZone: "UTC",
		})
		.toLowerCase();
};

const start = new Date(slotStart);
const end = new Date(slotEnd);

const timestamps: string[] = [];
//const slots: string[] = [];
let current = new Date(start);
while (current < end) {
	//  slots.push(current.toISOString())
	timestamps.push(formatISOToLocalTime(current.toISOString()));

	current = new Date(current.getTime() + 30 * 60 * 1000); // + 30 min
}

const ROOMS = ["Room A", "Room B", "Room C"];

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
								<p className="text-xs">{room.name}</p>
							</TableCell>

							{room.slots.map((s) => {
								return (
									<TableCell key={s.start} className="!p-0 border">
										<Link href={s.url} className="block h-full w-full">
											<div
												className={`h-12 w-full ${s.isAvailable ? "bg-green-300" : "bg-red-300"}`}
											/>
										</Link>
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
