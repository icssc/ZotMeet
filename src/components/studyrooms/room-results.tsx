"use client";

import type { StudyRooms } from "@/lib/types/studyrooms";

interface RoomResultsProps {
	rooms: StudyRooms["data"];
	timeRange: string;
}

function parseTimeRangeToUTCMinutes(timeRange: string): {
	startMins: number;
	endMins: number;
} {
	const [startStr, endStr] = timeRange.split("-");
	return {
		startMins: parseTimeStringToMinutes(startStr),
		endMins: parseTimeStringToMinutes(endStr),
	};
}

function parseTimeStringToMinutes(time: string): number {
	const isPM = time.endsWith("pm");
	const isAM = time.endsWith("am");
	const cleaned = time.replace("am", "").replace("pm", "");
	const [h, m] = cleaned.split(":").map(Number);
	let hours = h;
	if (isPM && h !== 12) hours += 12;
	if (isAM && h === 12) hours = 0;
	return hours * 60 + (m || 0);
}

function slotUTCMinutes(isoString: string): number {
	const d = new Date(isoString);
	return d.getUTCHours() * 60 + d.getUTCMinutes();
}

export function RoomResults({ rooms, timeRange }: RoomResultsProps) {
	if (rooms.length === 0) {
		return <p>No rooms found.</p>;
	}

	const { startMins, endMins } = parseTimeRangeToUTCMinutes(timeRange);

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
						onClick={() => console.log("payload:", room)}
					>
						Select Room
					</button>
					<ul>
						{[...room.slots]
							.sort((a, b) => a.start.localeCompare(b.start))
							.filter((slot) => {
								const mins = slotUTCMinutes(slot.start);
								return mins >= startMins && mins < endMins;
							})
							.slice(0, 5)
							.map((slot) => (
								<li key={`${slot.studyRoomId}-${slot.start}`}>
									{new Date(slot.start).toLocaleTimeString("en-US", {
										hour: "numeric",
										minute: "2-digit",
										hour12: true,
										timeZone: "UTC",
									})}
									{" – "}
									{new Date(slot.end).toLocaleTimeString("en-US", {
										hour: "numeric",
										minute: "2-digit",
										hour12: true,
										timeZone: "UTC",
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
