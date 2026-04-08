"use client";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { StudyRooms } from "@/lib/types/studyrooms";

interface RoomResultsProps {
	rooms: StudyRooms["data"];
}

export function RoomResults({ rooms }: RoomResultsProps) {
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
										})}
										{" – "}
										{new Date(slot.end).toLocaleTimeString("en-US", {
											hour: "numeric",
											minute: "2-digit",
											hour12: true,
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
