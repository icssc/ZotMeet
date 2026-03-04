"use client";

import type { StudyRooms } from "@/lib/types/studyrooms";

interface RoomResultsProps {
	rooms: StudyRooms["data"];
}

export function RoomResults({ rooms }: RoomResultsProps) {
	if (rooms.length === 0) {
		return <p>No rooms found.</p>;
	}

	return (
		<ul>
			{rooms.map((room) => (
				<li key={room.id}>
					<strong>{room.name}</strong> — {room.location}, capacity{" "}
					{room.capacity}
					{room.techEnhanced && " (tech enhanced)"}
					<button
						type="button"
						style={{
							backgroundColor: "blue",
							color: "white",
							padding: "2px 8px",
						}}
						onClick={() => console.log("Selected room:", room)}
					>
						Select Room
					</button>
					<ul>
						{room.slots.slice(0, 5).map((slot) => (
							<li key={`${slot.studyRoomId}-${slot.start}`}>
								{slot.start} – {slot.end}:{" "}
								{slot.isAvailable ? "Available" : "Unavailable"}
							</li>
						))}
					</ul>
				</li>
			))}
		</ul>
	);
}
