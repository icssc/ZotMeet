import { useRouter } from "expo-router";
import { X } from "lucide-react-native";
import { useState } from "react";
import { View } from "react-native";
import { Button } from "@/components/ui/button";
import { Calendar, DayCell } from "@/components/ui/calendar";
import { FormHelperText, FormLabel } from "@/components/ui/form";
import { IconButton } from "@/components/ui/icon-button";
import { Input } from "@/components/ui/input";
import { SelectableCard } from "@/components/ui/selectable-card";
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
	TabsTriggerText,
} from "@/components/ui/tabs";
import { Text } from "@/components/ui/text";
import { TimeField } from "@/components/ui/time-field";
import { startOfMonth, WEEKDAY_INITIALS } from "@/lib/date";

type DatePickerMode = "specific" | "weekly";
type LocationChoice = "recommend" | "known";

/**
 * "[Meetings] Create Meeting (Specific Dates)" from the ZotMeet Hi-Fi
 * Wireframes (node 211:12581), built from the shared native primitives.
 *
 * Local state only — this is the UI half. Wiring it to the meeting-creation
 * server actions (`src/server/actions/meeting`) is a separate pass.
 */
export function CreateMeetingForm() {
	const router = useRouter();
	const canDismiss = router.canGoBack();

	const [name, setName] = useState("");
	const [startTime, setStartTime] = useState<Date | undefined>();
	const [endTime, setEndTime] = useState<Date | undefined>();
	const [mode, setMode] = useState<DatePickerMode>("specific");
	const [month, setMonth] = useState(() => startOfMonth(new Date()));
	const [selectedDates, setSelectedDates] = useState<string[]>([]);
	const [selectedWeekdays, setSelectedWeekdays] = useState<number[]>([]);
	const [location, setLocation] = useState<LocationChoice>("recommend");

	const endsBeforeItStarts =
		!!startTime && !!endTime && endTime.getTime() <= startTime.getTime();

	/**
	 * Applies one sweep from the calendar. Mirrors `updateSelectedRange` in the
	 * web app's `src/components/creation/calendar/calendar.tsx`: a sweep that
	 * began on an unselected day adds the range, and one that began on a
	 * selected day clears it.
	 */
	const applyDateRange = (keys: string[], additive: boolean) =>
		setSelectedDates((current) => {
			if (!additive) {
				const removing = new Set(keys);
				return current.filter((value) => !removing.has(value));
			}
			const next = new Set(current);
			for (const key of keys) next.add(key);
			return [...next].sort();
		});

	const toggleWeekday = (index: number) =>
		setSelectedWeekdays((current) =>
			current.includes(index)
				? current.filter((value) => value !== index)
				: [...current, index],
		);

	return (
		<View className="flex-1 gap-[60px] bg-paper px-6 pt-6 pb-[100px]">
			<View>
				<View className="w-full flex-row items-center justify-end px-4">
					{canDismiss ? (
						<IconButton
							accessibilityLabel="Close"
							onPress={() => router.back()}
						>
							<X className="text-action-active" size={24} />
						</IconButton>
					) : (
						// Keeps the heading optically centred when there is no X.
						<View className="size-10" />
					)}
				</View>
				<View className="w-full items-center pt-2 pb-3">
					<Text className="font-figtree-medium text-foreground text-h5">
						Create Meeting
					</Text>
				</View>
			</View>

			<View className="w-full items-center gap-10">
				<Input
					accessibilityLabel="Meeting name"
					onChangeText={setName}
					placeholder="New Meeting"
					value={name}
				/>

				<View className="w-full flex-row gap-6">
					<TimeField
						className="flex-1"
						onChange={setStartTime}
						placeholder="Start Time"
						value={startTime}
					/>
					<TimeField
						className="flex-1"
						invalid={endsBeforeItStarts}
						onChange={setEndTime}
						placeholder="End Time"
						value={endTime}
					/>
				</View>
				{endsBeforeItStarts ? (
					<FormHelperText className="text-destructive">
						End time is before the start time.
					</FormHelperText>
				) : null}

				<View className="w-full max-w-[320px] items-center gap-3">
					<Tabs
						onValueChange={(value) => setMode(value as DatePickerMode)}
						value={mode}
					>
						<TabsList variant="underline">
							<TabsTrigger value="specific">
								<TabsTriggerText>Specific dates</TabsTriggerText>
							</TabsTrigger>
							<TabsTrigger value="weekly">
								<TabsTriggerText>Days of the week</TabsTriggerText>
							</TabsTrigger>
						</TabsList>

						<TabsContent value="specific">
							<Calendar
								month={month}
								onMonthChange={setMonth}
								onSelectRange={applyDateRange}
								selectedKeys={selectedDates}
							/>
						</TabsContent>

						<TabsContent value="weekly">
							<View className="w-full max-w-[320px] flex-row justify-center gap-0.5 py-4">
								{WEEKDAY_INITIALS.map((initial, index) => (
									<DayCell
										key={`${initial}-${index}`}
										label={initial}
										onPress={() => toggleWeekday(index)}
										selected={selectedWeekdays.includes(index)}
									/>
								))}
							</View>
						</TabsContent>
					</Tabs>

					<FormHelperText>Select the days that apply.</FormHelperText>
				</View>

				<View className="w-full gap-3">
					<FormLabel>SELECT ONE</FormLabel>
					<SelectableCard
						description="Get room recommendations."
						onPress={() => setLocation("recommend")}
						selected={location === "recommend"}
						title="Find & Book a room with ZotMeet"
					/>
					<SelectableCard
						description="Set location for responders."
						onPress={() => setLocation("known")}
						selected={location === "known"}
						title="I know where my meeting is"
					/>
				</View>
			</View>

			<Button elevated label="Create Meeting" />
		</View>
	);
}
