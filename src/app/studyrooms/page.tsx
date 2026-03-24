"use client";

import { useState } from "react";
import { RoomResults } from "@/components/studyrooms/room-results";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { fetchStudyRooms } from "@/lib/studyrooms/get-rooms";
import type { StudyRooms } from "@/lib/types/studyrooms";

export default function Page() {
	const [date, setDate] = useState("");
	const [timeRange, setTimeRange] = useState("");
	const [location, setLocation] = useState("");
	const [capacityMin, setCapacityMin] = useState("");
	const [capacityMax, setCapacityMax] = useState("");
	const [isTechEnhanced, setIsTechEnhanced] = useState<boolean | undefined>(
		undefined,
	);
	const [rooms, setRooms] = useState<StudyRooms["data"] | null>(null);
	const [error, setError] = useState<string | null>(null);

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		setError(null);
		setRooms(null);
		try {
			const { data } = await fetchStudyRooms({
				date,
				timeRange,
				location: location || undefined,
				capacityMin: capacityMin ? Number(capacityMin) : undefined,
				capacityMax: capacityMax ? Number(capacityMax) : undefined,
				isTechEnhanced,
			});
			setRooms(data);
		} catch (err) {
			setError(err instanceof Error ? err.message : "API call failed");
		}
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
					type="text"
					placeholder="Time range e.g. 11:00am-5:00pm (UTC)"
					value={timeRange}
					onChange={(e) => setTimeRange(e.target.value)}
					required
				/>
				<Input
					type="text"
					placeholder="Location (optional)"
					value={location}
					onChange={(e) => setLocation(e.target.value)}
				/>
				<Input
					type="number"
					placeholder="Min capacity (optional)"
					value={capacityMin}
					onChange={(e) => setCapacityMin(e.target.value)}
				/>
				<Input
					type="number"
					placeholder="Max capacity (optional)"
					value={capacityMax}
					onChange={(e) => setCapacityMax(e.target.value)}
				/>
				<select
					value={isTechEnhanced === undefined ? "" : String(isTechEnhanced)}
					onChange={(e) =>
						setIsTechEnhanced(
							e.target.value === "" ? undefined : e.target.value === "true",
						)
					}
				>
					<option value="">Tech enhanced (any)</option>
					<option value="true">Tech enhanced: Yes</option>
					<option value="false">Tech enhanced: No</option>
				</select>
				<Button type="submit">Search</Button>
			</form>
			{error && <p>{error}</p>}
			{rooms && <RoomResults rooms={rooms} timeRange={timeRange} />}
		</div>
	);
}
