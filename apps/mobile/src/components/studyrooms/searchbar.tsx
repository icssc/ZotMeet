// Mirrors src/components/studyrooms/search-bar.tsx.

import DateTimePicker from "@react-native-community/datetimepicker";
import { useColorScheme } from "nativewind";
import { useState } from "react";
import { Platform, Pressable, View } from "react-native";
import Legend from "@/components/studyrooms/legend";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DatePicker } from "@/components/ui/date-picker";
import { Drawer } from "@/components/ui/drawer";
import { FieldButton, Input } from "@/components/ui/input";
import { Pill } from "@/components/ui/pill";
import { Text } from "@/components/ui/text";
import { Icon } from "@/lib/icons";
import { colorsFor } from "@/lib/theme";

export function formatTime(date: Date): string {
	const hours = date.getHours();
	const minutes = `${date.getMinutes()}`.padStart(2, "0");
	const period = hours < 12 ? "AM" : "PM";
	const hour12 = hours % 12 === 0 ? 12 : hours % 12;
	return `${hour12}:${minutes} ${period}`;
}
export default function SearchBar({
	buildings,
	onChangeText,
	date,
	setDate,
	startTime,
	setStartTime,
	endTime,
	setEndTime,
	buildingsSelected,
	setBuildingsSelected,
}: {
	buildings: readonly string[];
	onChangeText?: (text: string) => void;
	date: Date;
	startTime: Date;
	endTime: Date;
	setDate: (date: Date) => void;
	setStartTime: (time: Date) => void;
	setEndTime: (time: Date) => void;
	buildingsSelected: string[];
	setBuildingsSelected: (buildings: string[]) => void;
}) {
	const availabilityColor = "#86efac";
	const notAvailableColor = "#fca5a5";

	const [isDrawerOpen, setIsDrawerOpen] = useState(false);
	const { colorScheme } = useColorScheme();
	const colors = colorsFor(colorScheme);

	const [activeTime, setActiveTime] = useState<"start" | "end" | null>(null);
	const toggleTime = (which: "start" | "end") =>
		setActiveTime((prev) => (prev === which ? null : which));

	const activeValue = activeTime === "start" ? startTime : endTime;

	const toggleBuilding = (b: string) =>
		setBuildingsSelected(
			buildingsSelected.includes(b)
				? buildingsSelected.filter((x) => x !== b)
				: [...buildingsSelected, b],
		);
	const closeDrawer = () => {
		setIsDrawerOpen(false);
		setActiveTime(null);
	};
	return (
		<Card className="flex-row items-center justify-between gap-4 rounded-xl py-4 pr-0 pl-4 shadow-md">
			<Input
				containerClassName="flex-1 w-auto"
				className="py-0"
				style={{
					fontSize: 18,
					lineHeight: 22,
					textAlignVertical: "center",
					includeFontPadding: false,
				}}
				placeholder="Search Rooms"
				startAdornment={<Icon name="search" size={28} />}
				onChangeText={onChangeText}
				autoCapitalize="none"
				autoCorrect={false}
				returnKeyType="search"
			/>
			<Pressable
				accessibilityLabel="Open search filters"
				accessibilityRole="button"
				onPress={() => setIsDrawerOpen(true)}
				className="shrink-0 items-center justify-center px-2 py-1 active:opacity-60"
			>
				<Icon name="filter-list" size={24} className="text-action-active" />
				<Text className="text-[10px] text-foreground" numberOfLines={1}>
					Filter & Sort
				</Text>
			</Pressable>
			<View className="p-1">
				<Drawer open={isDrawerOpen} onClose={() => closeDrawer()}>
					<Legend
						availabilityColor={availabilityColor}
						notAvailableColor={notAvailableColor}
					/>
					<View className="p-1">
						<Text className="mt-4 font-semibold text-foreground text-xl">
							Room Settings
						</Text>
						<Text className="text-muted-foreground text-sm">
							Filter through UCI buildings and room amenities to find the study
							room for you.
						</Text>
						<View className="mt-4">
							<DatePicker label="Date" value={date} onChange={setDate} />
						</View>
						<View className="w-full flex-row justify-end">
							<Button
								color="inherit"
								label="Clear Selected"
								onPress={() => setDate(new Date())}
							/>
						</View>

						<View className="mt-4 flex-row items-center gap-7">
							<View className="flex-1">
								<FieldButton
									label="Start time"
									placeholder="9:00 AM"
									onPress={() => toggleTime("start")}
									startAdornment={
										<Icon
											name="access-time"
											className="text-action-active"
											size={24}
										/>
									}
									value={startTime ? formatTime(startTime) : undefined}
								/>
							</View>
							<View className="flex-1">
								<FieldButton
									label="End time"
									placeholder="5:00 PM"
									onPress={() => toggleTime("end")}
									startAdornment={
										<Icon
											name="access-time"
											className="text-action-active"
											size={24}
										/>
									}
									value={endTime ? formatTime(endTime) : undefined}
								/>
							</View>
						</View>

						{activeTime ? (
							<View className="w-full items-center">
								<DateTimePicker
									display="spinner"
									minuteInterval={5}
									mode="time"
									onChange={(event, next) => {
										// Android always shows a system dialog, so close on any result.
										if (Platform.OS === "android") {
											setActiveTime(null);
											if (event.type !== "set") return;
										}
										if (!next) return;
										if (activeTime === "start") setStartTime(next);
										else setEndTime(next);
									}}
									textColor={colors.foreground}
									themeVariant={colorScheme === "dark" ? "dark" : "light"}
									value={activeValue ?? new Date(0, 0, 0, 9, 0, 0)}
								/>
							</View>
						) : null}
						<View className="w-full flex-row justify-end">
							<Button
								color="inherit"
								label="Clear Selected"
								onPress={() => {
									setStartTime(new Date(0, 0, 0, 9, 0, 0));
									setEndTime(new Date(0, 0, 0, 17, 0, 0));
								}}
							/>
						</View>
						<Text className="text-muted-foreground">Buildings</Text>
						<View className="flex-row flex-wrap gap-2 pt-2">
							{buildings.map((building) => (
								<Pill
									key={building}
									label={building}
									onPress={() => toggleBuilding(building)}
									selected={buildingsSelected.includes(building)}
								/>
							))}
						</View>
					</View>
				</Drawer>
			</View>
		</Card>
	);
}
