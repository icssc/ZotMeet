"use client";

import { Button } from "@/components/ui/button";
import type { StudyRooms } from "@/lib/types/studyrooms";

interface RoomResultsProps {
	rooms: StudyRooms["data"];
}

export function RoomResults({ rooms }: RoomResultsProps) {
	if (rooms.length === 0) {
		return <p className="text-muted-foreground text-sm">No rooms found.</p>;
	}

	return (
		<ul className="flex flex-col gap-4">
			{rooms.map((room) => (
				<li key={room.id} className="flex flex-col gap-1">
					<div className="flex items-center gap-2">
						<strong>{room.name}</strong>
						<span className="text-muted-foreground text-sm">
							— {room.location}, capacity {room.capacity}
							{room.techEnhanced && " (tech enhanced)"}
						</span>
						<Button
							type="button"
							size="sm"
							onClick={() => console.log("payload:", room)}
						>
							Select Room
						</Button>
					</div>
					<ul className="flex flex-col gap-1 pl-4">
						{[...room.slots]
							.sort((a, b) => a.start.localeCompare(b.start))
							.slice(0, 5)
							.map((slot) => (
								<li
									key={`${slot.studyRoomId}-${slot.start}`}
									className="text-sm"
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
								</li>
							))}
					</ul>
				</li>
			))}
		</ul>
	);
}
