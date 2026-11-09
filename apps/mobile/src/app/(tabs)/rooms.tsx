// Web counterpart: src/app/.../rooms/page.tsx
// Differences: SearchBar replaces web's MobileIsland + Drawer; no filter sheet yet;
// search is not debounced (useMemo instead of web's ref/timer/startTransition).

import type { StudyRooms } from "@zotmeet/shared";
import { fetchStudyRoomsShared } from "@zotmeet/shared/src/studyrooms/get-rooms";
import { useEffect, useMemo, useState } from "react";
import {
	KeyboardAvoidingView,
	Platform,
	ScrollView,
	Text,
	View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { RoomsHeatmap } from "@/components/studyrooms/rooms-heatmap";
import SearchBar from "@/components/studyrooms/searchbar";
import { Screen } from "@/components/ui/screen";

export const BUILDINGS = [
	"Anteater Learning Pavilion",
	"Science Library",
	"Langson Library",
	"Gateway Study Center",
	"Plaza Verde",
	"Multimedia Resources Center",
] as const;

/* needs to be moved at some point from utils.ts */
const WINDOW_MS = 6 * 60 * 60 * 1000;

export function getNextHalfHour(from: Date = new Date()): Date {
	const d = new Date(from);
	const remainder = d.getMinutes() % 30;
	if (remainder === 0 && d.getSeconds() === 0 && d.getMilliseconds() === 0)
		return d;
	d.setMinutes(d.getMinutes() + (remainder === 0 ? 30 : 30 - remainder), 0, 0);
	return d;
}

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

// ASSUMPTION: formats below. Copy whatever web's Sidebar passes to
// fetchStudyRoomsShared for `date` and `timeRange`.
const pad = (n: number) => String(n).padStart(2, "0");
const toDateParam = (d: Date) =>
	`${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const toTimeParam = (d: Date) => `${pad(d.getHours())}:${pad(d.getMinutes())}`;

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
	const [rooms, setRooms] = useState<StudyRooms["data"] | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [query, setQuery] = useState("");

	useEffect(() => {
		const controller = new AbortController();
		fetchStudyRoomsShared(
			{
				date: toDateParam(defaultDate),
				timeRange: `${toTimeParam(defaultStart)}-${toTimeParam(defaultEnd)}`,
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
	}, [defaultDate, defaultStart, defaultEnd]);

	const filteredRooms = useMemo(() => {
		if (rooms === null) return null;
		const q = query.toLowerCase();
		if (!q) return rooms;
		return rooms.filter(
			(r) =>
				r.location.toLowerCase().includes(q) ||
				r.name.toLowerCase().includes(q),
		);
	}, [rooms, query]);
	const insets = useSafeAreaInsets();
	return (
		<Screen title="Rooms" scroll={false}>
			<KeyboardAvoidingView
				className="flex-1"
				behavior={Platform.OS === "ios" ? "padding" : undefined}
			>
				<ScrollView
					className="flex-1"
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
							searchDate={defaultDate}
							startTime={defaultStart}
							endTime={defaultEnd}
						/>
					)}
				</ScrollView>

				<View className="px-4 pt-2 pb-2">
					<SearchBar buildings={BUILDINGS} onChangeText={setQuery} />
				</View>
			</KeyboardAvoidingView>
		</Screen>
	);
}
