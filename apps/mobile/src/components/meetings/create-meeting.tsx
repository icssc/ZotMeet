import {
	ANCHOR_DATES,
	convertTimeToUTC,
	sortMeetingIsoDatesAsc,
} from "@zotmeet/shared";
import { useRouter } from "expo-router";
import { useState } from "react";
import { View } from "react-native";
import { Button } from "@/components/ui/button";
import { Calendar, DayCell } from "@/components/ui/calendar";
import { FormHelperText, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SelectableCard } from "@/components/ui/selectable-card";
import { SheetGrabber } from "@/components/ui/sheet-grabber";
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
	TabsTriggerText,
} from "@/components/ui/tabs";
import { Text } from "@/components/ui/text";
import { TimeField } from "@/components/ui/time-field";
import { createMeeting } from "@/lib/api/meetings";
import {
	dateKeyToLocalMidnightIso,
	dateToHourMinuteString,
	startOfMonth,
	WEEKDAY_INITIALS,
} from "@/lib/date";

type DatePickerMode = "specific" | "weekly";
type LocationChoice = "recommend" | "known";

export function CreateMeetingForm() {
	const router = useRouter();
	const [name, setName] = useState("");
	const [startTime, setStartTime] = useState<Date | undefined>();
	const [endTime, setEndTime] = useState<Date | undefined>();
	const [mode, setMode] = useState<DatePickerMode>("specific");
	const [month, setMonth] = useState(() => startOfMonth(new Date()));
	const [selectedDates, setSelectedDates] = useState<string[]>([]);
	const [selectedWeekdays, setSelectedWeekdays] = useState<number[]>([]);
	const [location, setLocation] = useState<LocationChoice>("recommend");
	const [isCreating, setIsCreating] = useState(false);
	const [submitError, setSubmitError] = useState<string | null>(null);

	const endsBeforeItStarts =
		!!startTime && !!endTime && endTime.getTime() <= startTime.getTime();

	// Same gate as the web form's `hasValidInputs` in
	// `src/components/creation/creation.tsx`.
	const hasValidInputs =
		name.trim().length > 0 &&
		!!startTime &&
		!!endTime &&
		!endsBeforeItStarts &&
		(mode === "specific"
			? selectedDates.length > 0
			: selectedWeekdays.length > 0);

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

	// Mirrors `handleCreation` in the web app's `creation.tsx`: times are
	// entered as local wall-clock and stored as UTC, anchored on the first
	// meeting date; a "days of the week" meeting stores `ANCHOR_DATES` instead
	// of real dates. The location choice is UI only for now — the web form
	// does not send a location either.
	const submit = async () => {
		if (!hasValidInputs || !startTime || !endTime) return;

		setIsCreating(true);
		setSubmitError(null);

		const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
		const dates = sortMeetingIsoDatesAsc(
			mode === "specific"
				? selectedDates.map(dateKeyToLocalMidnightIso)
				: selectedWeekdays.map((weekday) =>
						ANCHOR_DATES[weekday].toISOString(),
					),
		);
		const referenceDate = dates[0];

		try {
			const { id } = await createMeeting({
				title: name.trim(),
				fromTime: convertTimeToUTC(
					dateToHourMinuteString(startTime),
					userTimezone,
					referenceDate,
				),
				toTime: convertTimeToUTC(
					dateToHourMinuteString(endTime),
					userTimezone,
					referenceDate,
				),
				timezone: userTimezone,
				dates,
				meetingType: mode === "specific" ? "dates" : "days",
				description: "",
			});
			// `replace` swaps this modal for the meeting screen, so backing out of
			// the meeting returns to the Meetings list rather than the form.
			router.replace({
				pathname: "/availability/[slug]",
				params: { slug: id },
			});
		} catch (error) {
			setSubmitError(
				error instanceof Error ? error.message : "Failed to create meeting.",
			);
			setIsCreating(false);
		}
	};

	return (
		<View className="flex-1 gap-[60px] bg-paper px-6 pt-6 pb-[100px]">
			<View>
				<SheetGrabber />
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
						End time must be after the start time.
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

			<View className="w-full gap-3">
				{submitError ? (
					<FormHelperText className="text-destructive">
						{submitError}
					</FormHelperText>
				) : null}
				<Button
					disabled={!hasValidInputs || isCreating}
					label={isCreating ? "Creating…" : "Create Meeting"}
					onPress={submit}
					size="large"
					variant="contained"
				/>
			</View>
		</View>
	);
}
