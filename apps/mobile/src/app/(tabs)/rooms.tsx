import type { StudyRooms } from "@zotmeet/shared";
import { BUILDINGS } from "@zotmeet/shared";
import { fetchStudyRoomsShared } from "@zotmeet/shared/src/studyrooms/get-rooms";
import { useEffect, useMemo, useState } from "react";
import {
	KeyboardAvoidingView,
	Platform,
	ScrollView,
	Text,
	View,
} from "react-native";
import { RoomsHeatmap } from "@/components/studyrooms/rooms-heatmap";
import SearchBar from "@/components/studyrooms/searchbar";
import { Screen } from "@/components/ui/screen";
import { getNextHalfHour, WINDOW_MS } from "@/lib/rooms/utils";

export function getDefaultWindow() {
	const now = new Date();
	const start = getNextHalfHour(now);

	const elevenPm = new Date(now);
	elevenPm.setHours(23, 0, 0, 0);

	if (start >= elevenPm) {
		const nextDay = new Date(now);
		nextDay.setDate(nextDay.getDate() + 1);
		nextDay.setHours(11, 0, 0, 0);
		const end = new Date(nextDay.getTime() + WINDOW_MS);
		return { start: nextDay, end };
	}

	const rawEnd = new Date(start.getTime() + WINDOW_MS);
	const end = rawEnd > elevenPm ? elevenPm : rawEnd;
	return { start, end };
}

const pad = (n: number) => String(n).padStart(2, "0");
const toDateParam = (d: Date) =>
	`${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const toTimeParam = (d: Date) =>
	`${d.getHours() % 12 || 12}:${pad(d.getMinutes())}${d.getHours() >= 12 ? "pm" : "am"}`;

export default function RoomsScreen() {
	const [{ defaultDate, defaultStart, defaultEnd }] = useState(() => {
		const { start, end } = getDefaultWindow();
		return {
			defaultStart: start,
			defaultEnd: end,
			defaultDate: new Date(
				start.getFullYear(),
				start.getMonth(),
				start.getDate(),
			),
		};
	});
	const [date, setDate] = useState(defaultDate);
	const [startTime, setStartTime] = useState(defaultStart);
	const [endTime, setEndTime] = useState(defaultEnd);
	const [rooms, setRooms] = useState<StudyRooms["data"] | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [query, setQuery] = useState("");
	const [buildingsSelected, setBuildingsSelected] = useState<string[]>([]);

	useEffect(() => {
		const controller = new AbortController();
		fetchStudyRoomsShared(
			{
				date: toDateParam(date),
				timeRange: `${toTimeParam(startTime)}-${toTimeParam(endTime)}`,
			},
			{ signal: controller.signal },
		)
			.then((res) => setRooms(res.data))
			.catch((e) => {
				if (controller.signal.aborted) return;
				setError(e instanceof Error ? e.message : "Failed to load rooms");
				setRooms([]);
			});
		return () => controller.abort();
	}, [date, startTime, endTime]);

	const filteredRooms = useMemo(() => {
		if (rooms === null) return null;
		const q = query.trim().toLowerCase();
		console.log(
			"Filtering rooms with query:",
			q,
			"and buildingsSelected:",
			buildingsSelected,
		);
		return rooms.filter((r) => {
			const matchesBuilding =
				buildingsSelected.length === 0 ||
				buildingsSelected.includes(r.location);

			const matchesQuery =
				!q ||
				r.location.toLowerCase().includes(q) ||
				r.name.toLowerCase().includes(q);

			return matchesBuilding && matchesQuery;
		});
	}, [rooms, query, buildingsSelected]);
	return (
		<Screen title="Rooms" scroll={false}>
			<ScrollView
				className="flex-1"
				contentContainerClassName="pb-28" // room so the last rows scroll above the bar
				keyboardShouldPersistTaps="handled"
				keyboardDismissMode="on-drag"
			>
				{filteredRooms === null ? (
					<Text className="p-4 text-muted-foreground">
						Loading available rooms...
					</Text>
				) : error ? (
					<Text className="p-4 text-destructive">{error}</Text>
				) : filteredRooms.length === 0 ? (
					<Text className="p-4 text-muted-foreground">
						No rooms match your search. Try different dates or filters.
					</Text>
				) : (
					<RoomsHeatmap
						rooms={filteredRooms}
						searchDate={date}
						startTime={startTime}
						endTime={endTime}
					/>
				)}
			</ScrollView>

			<KeyboardAvoidingView
				pointerEvents="box-none"
				behavior={Platform.OS === "ios" ? "padding" : undefined}
				className="absolute inset-x-0 bottom-0"
			>
				<View className="px-4 pb-6" pointerEvents="box-none">
					<SearchBar
						buildings={BUILDINGS}
						onChangeText={setQuery}
						date={date}
						setDate={setDate}
						startTime={startTime}
						setStartTime={setStartTime}
						endTime={endTime}
						setEndTime={setEndTime}
						buildingsSelected={buildingsSelected}
						setBuildingsSelected={setBuildingsSelected}
					/>
				</View>
			</KeyboardAvoidingView>
		</Screen>
	);
}
