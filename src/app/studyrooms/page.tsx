"use client";

import { useState } from "react";
import { RoomResults } from "@/components/studyrooms/room-results";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { fetchStudyRooms } from "@/lib/studyrooms/getrooms";
import type { StudyRooms } from "@/lib/types/studyrooms";

export default function Page() {
	const [date, setDate] = useState("");
	const [startTime, setStartTime] = useState("");
	const [endTime, setEndTime] = useState("");
	const [location, setLocation] = useState("");
	const [rooms, setRooms] = useState<StudyRooms["data"] | null>(null);

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		const { data } = await fetchStudyRooms({
			date,
			timeRange: `${startTime}-${endTime}`,
			location: location || undefined,
		});
		setRooms(data);
	}

	return (
		<div>
			<form onSubmit={handleSubmit} className="flex flex-col gap-2">
				<Input
					type="date"
					value={date}
					onChange={(e) => setDate(e.target.value)}
					required
				/>
				<Input
					type="time"
					value={startTime}
					onChange={(e) => setStartTime(e.target.value)}
					required
				/>
				<Input
					type="time"
					value={endTime}
					onChange={(e) => setEndTime(e.target.value)}
					required
				/>
				<Input
					type="text"
					placeholder="Location (optional)"
					value={location}
					onChange={(e) => setLocation(e.target.value)}
				/>
				<Button type="submit">Search</Button>
			</form>
			{rooms && <RoomResults rooms={rooms} />}
		</div>
	);
}
