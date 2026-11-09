// Web counterpart: src/components/studyrooms/heatmap/rooms-heatmap.tsx
// Differences: RN Views instead of MUI Table; room column is pinned outside the
// horizontal ScrollView (instead of position: sticky); tapping a slot opens its
// booking URL via Linking (no tooltip); sort is three Buttons instead of a Select;
// recordRecentRoom is left out until mobile has recents.
import type { StudyRooms } from "@zotmeet/shared";
import { useMemo, useState } from "react";
import { Linking, Pressable, ScrollView, View } from "react-native";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import {
	buildHalfHourIntervals,
	groupSlotsIntoIntervals,
	mergeDateAndTime,
} from "@/lib/rooms/utils";
import { cn } from "@/lib/utils";

type Room = StudyRooms["data"][number];
type SortKey = "default" | "capacity" | "availability";

const ROW_H = 64;
const HEADER_H = 40;
const NAME_W = 150;
const CELL_W = 56;

const LOCATION_SORT_ORDER: readonly string[] = [
	"Science Library",
	"Anteater Learning Pavilion",
	"Langson Library",
	"Gateway Study Center",
	"Plaza Verde",
	"Multimedia Resources Center",
];

function compareLocationSort(a: string, b: string): number {
	const ia = LOCATION_SORT_ORDER.indexOf(a);
	const ib = LOCATION_SORT_ORDER.indexOf(b);
	if (ia >= 0 && ib >= 0) return ia - ib;
	if (ia >= 0) return -1;
	if (ib >= 0) return 1;
	return a.localeCompare(b);
}

interface RoomsHeatmapProps {
	rooms: StudyRooms["data"];
	searchDate: Date;
	startTime: Date;
	endTime: Date;
}

export const RoomsHeatmap = ({
	rooms,
	searchDate,
	startTime,
	endTime,
}: RoomsHeatmapProps) => {
	const [sortBy, setSortBy] = useState<SortKey>("default");

	const intervals = useMemo(
		() => buildHalfHourIntervals(searchDate, startTime, endTime),
		[searchDate, startTime, endTime],
	);
	const windowStart = useMemo(
		() => mergeDateAndTime(searchDate, startTime),
		[searchDate, startTime],
	);

	const rows = useMemo(() => {
		const countAvailable = (room: Room) =>
			room.slots.filter(
				(s) => new Date(s.start) >= windowStart && s.isAvailable,
			).length;
		const copy = rooms.filter((r) => r.name);
		switch (sortBy) {
			case "capacity":
				copy.sort((a, b) => {
					if (!a.capacity && !b.capacity) return 0;
					if (!a.capacity) return 1;
					if (!b.capacity) return -1;
					return b.capacity - a.capacity;
				});
				break;
			case "availability":
				copy.sort((a, b) => countAvailable(b) - countAvailable(a));
				break;
			default:
				copy.sort((a, b) => compareLocationSort(a.location, b.location));
		}
		return copy.map((room) => {
			const slots = [...room.slots]
				.sort(
					(a, b) => new Date(a.start).getTime() - new Date(b.start).getTime(),
				)
				.filter((s) => new Date(s.start) >= windowStart);
			return { room, buckets: groupSlotsIntoIntervals(slots, intervals) };
		});
	}, [rooms, sortBy, windowStart, intervals]);

	return (
		<View className="w-full">
			<View className="flex-row items-center gap-2 px-4 py-2">
				{(["default", "capacity", "availability"] as const).map((key) => (
					<Button
						key={key}
						size="small"
						variant={sortBy === key ? "contained" : "outlined"}
						label={key[0].toUpperCase() + key.slice(1)}
						onPress={() => setSortBy(key)}
					/>
				))}
			</View>

			<View className="flex-row">
				<View style={{ width: NAME_W }} className="bg-background">
					<View style={{ height: HEADER_H }} className="justify-center px-2">
						<Typography variant="caption" color="textSecondary">
							Rooms
						</Typography>
					</View>
					{rows.map(({ room }) => (
						<View
							key={room.id}
							style={{ height: ROW_H }}
							className="justify-center border-border border-t px-2"
						>
							<Typography variant="caption" numberOfLines={1}>
								{room.location}
							</Typography>
							<Typography
								variant="caption"
								color="textSecondary"
								numberOfLines={1}
							>
								{room.name?.slice(0, 20)}
								{room.capacity ? `  •  Cap: ${room.capacity}` : ""}
							</Typography>
						</View>
					))}
				</View>

				<ScrollView horizontal showsHorizontalScrollIndicator={false}>
					<View>
						<View style={{ height: HEADER_H }} className="flex-row">
							{intervals.map((iv) => (
								<View
									key={iv.label}
									style={{ width: CELL_W }}
									className="items-center justify-center"
								>
									<Typography variant="caption" numberOfLines={1}>
										{iv.label}
									</Typography>
								</View>
							))}
						</View>

						{rows.map(({ room, buckets }) => (
							<View
								key={room.id}
								style={{ height: ROW_H }}
								className="flex-row"
							>
								{buckets.map((bucket) => (
									<View
										key={bucket.intervalLabel}
										style={{ width: CELL_W }}
										className="flex-row border border-border"
									>
										{bucket.slots.map((s) => (
											<Pressable
												key={s.start}
												disabled={!s.url}
												onPress={() => s.url && Linking.openURL(s.url)}
												accessibilityLabel={`${room.name}, ${s.isAvailable ? "available" : "booked"}`}
												className={cn(
													"flex-1",
													s.isAvailable ? "bg-green-300" : "bg-red-300",
												)}
											/>
										))}
									</View>
								))}
							</View>
						))}
					</View>
				</ScrollView>
			</View>
		</View>
	);
};
