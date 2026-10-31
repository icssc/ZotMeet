// Mirrors src/components/studyrooms/search-bar.tsx.

import { useState } from "react";
import { Pressable, View } from "react-native";
import Legend from "@/components/studyrooms/legend";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DatePicker } from "@/components/ui/date-picker";
import { Drawer } from "@/components/ui/drawer";
import { IconButton } from "@/components/ui/icon-button";
import { Input } from "@/components/ui/input";
import { Pill } from "@/components/ui/pill";
import { Text } from "@/components/ui/text";
import { TimeField } from "@/components/ui/time-field";
import { Icon } from "@/lib/icons";
export default function SearchBar() {
	const availabilityColor = "#86efac";
	const notAvailableColor = "#fca5a5";
	const handleSearch = (text: string) => {
		console.log("Searching for:", text);
	};
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);
	const [startTime, setStartTime] = useState<Date | null>(
		new Date(0, 0, 0, 9, 0, 0),
	);
	const [endTime, setEndTime] = useState<Date | null>(
		new Date(0, 0, 0, 17, 0, 0),
	);

	const [draftDate, setDraftDate] = useState<Date | null>(null);

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
				onSubmitEditing={(e) => handleSearch(e.nativeEvent.text)}
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
			<Drawer open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}>
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
						<DatePicker
							label="Date"
							value={draftDate}
							onChange={setDraftDate}
						/>
					</View>
					<View className="w-full flex-row justify-end">
						<Button
							color="inherit"
							label="Clear Selected"
							onPress={() => setDraftDate(null)}
						/>
					</View>

					<View className="mt-4 flex-row items-center gap-7">
						<View className="flex-1">
							<TimeField
								label="Start time"
								placeholder="9:00 AM"
								value={startTime}
								onChange={setStartTime}
							/>
						</View>
						<View className="flex-1">
							<TimeField
								label="End time"
								placeholder="5:00 PM"
								value={endTime}
								onChange={setEndTime}
							/>
						</View>
					</View>
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
					<View className="flex-row gap-2 pt-2">
						<Pill label="Building A" onPress={() => {}} />
					</View>
				</View>
			</Drawer>
		</Card>
	);
}
