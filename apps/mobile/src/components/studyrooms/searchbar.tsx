// Mirrors src/components/studyrooms/search-bar.tsx.

import { useState } from "react";
import { View } from "react-native";
import Legend from "@/components/studyrooms/legend";
import { Card } from "@/components/ui/card";
import { Drawer } from "@/components/ui/drawer";
import { IconButton } from "@/components/ui/icon-button";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { TimeField } from "@/components/ui/time-field";
import { Icon } from "@/lib/icons";
import { DatePicker } from "../ui/date-picker";

export default function SearchBar() {
	const availabilityColor = "#86efac";
	const notAvailableColor = "#fca5a5";
	const handleSearch = (text: string) => {
		console.log("Searching for:", text);
	};
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);
	const [startTime, setStartTime] = useState<Date | null>(null);
	const [endTime, setEndTime] = useState<Date | null>(null);

	const [draftDate, setDraftDate] = useState<Date | null>(null);

	return (
		<Card className="box-shadow-md mx-6 flex-row items-center gap-1 rounded-xl p-2">
			<Input
				containerClassName="flex-[4]"
				placeholder="Search Rooms"
				startAdornment={<Icon name="search" />}
				onSubmitEditing={(e) => handleSearch(e.nativeEvent.text)}
				autoCapitalize="none"
				autoCorrect={false}
				returnKeyType="search"
			/>
			<IconButton
				accessibilityLabel="Open search filters"
				onPress={() => setIsDrawerOpen(true)}
				className="flex-1 flex-col items-center justify-center"
			>
				<Icon name="filter-list" size={25} />
				<Text className="text-[10px]" numberOfLines={1}>
					Filter & Sort
				</Text>
			</IconButton>
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
						<DatePicker value={draftDate} onChange={setDraftDate} />
					</View>

					<View className="mt-4 flex-row items-center gap-2">
						<View className="flex-1">
							<TimeField placeholder="Start time" onChange={setStartTime} />
						</View>
						<View className="flex-1">
							<TimeField placeholder="End time" onChange={setEndTime} />
						</View>
					</View>
				</View>
			</Drawer>
		</Card>
	);
}
