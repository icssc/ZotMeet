"use client";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { StudyRooms } from "@/lib/types/studyrooms";

interface RoomResultsProps {
	rooms: StudyRooms["data"];
	startTime: Date | null;
	endTime: Date | null;
}

export function RoomResults({ rooms, startTime, endTime }: RoomResultsProps) {
	const toMinutes = (d: Date) => d.getHours() * 60 + d.getMinutes();
	const windowStart = startTime ? toMinutes(startTime) : 0;
	const windowEnd = endTime ? toMinutes(endTime) : 24 * 60;

	const isInWindow = (isoString: string) => {
		const pstStr = new Date(isoString).toLocaleTimeString("en-US", {
			timeZone: "America/Los_Angeles",
			hour: "2-digit",
			minute: "2-digit",
			hour12: false,
		});
		const [h, m] = pstStr.split(":").map(Number);
		const minutes = h * 60 + m;
		return minutes >= windowStart && minutes < windowEnd;
	};
	if (rooms.length === 0) {
		return (
			<Typography variant="body2" color="text.secondary">
				No rooms found.
			</Typography>
		);
	}

	return (
		<Box sx={{ p: 2 }}>
			<Stack divider={<Divider />} spacing={2}>
				{rooms.map((room) => (
					<Stack key={room.id} spacing={1}>
						<Stack direction="row" alignItems="center" spacing={1}>
							<Typography fontWeight="bold">{room.name}</Typography>
							<Typography variant="body2" color="text.secondary">
								— {room.location}, capacity {room.capacity}
								{room.techEnhanced && " (tech enhanced)"}
							</Typography>
							<Button
								size="small"
								variant="outlined"
								onClick={() => console.log("payload:", room)}
							>
								Select Room
							</Button>
						</Stack>
						<Stack spacing={0.5} sx={{ pl: 2 }}>
							{[...room.slots]
								.filter((slot) => isInWindow(slot.start))
								.sort((a, b) => a.start.localeCompare(b.start))
								.slice(0, 5)
								.map((slot) => (
									<Typography
										key={`${slot.studyRoomId}-${slot.start}`}
										variant="body2"
										color={slot.isAvailable ? "success.main" : "error.main"}
									>
										{new Date(slot.start).toLocaleTimeString("en-US", {
											hour: "numeric",
											minute: "2-digit",
											hour12: true,
											timeZone: "America/Los_Angeles",
										})}
										{" – "}
										{new Date(slot.end).toLocaleTimeString("en-US", {
											hour: "numeric",
											minute: "2-digit",
											hour12: true,
											timeZone: "America/Los_Angeles",
										})}
										{": "}
										{slot.isAvailable ? "Available" : "Unavailable"}
									</Typography>
								))}
						</Stack>
					</Stack>
				))}
			</Stack>
		</Box>
	);
}
