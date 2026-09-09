import DateTimePicker, {
	type DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { useColorScheme } from "nativewind";
import { useState } from "react";
import { Modal, Platform, Pressable, View } from "react-native";
import { FieldButton } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { Clock } from "@/lib/icons";
import { colorsFor } from "@/lib/theme";

/** "9:00 AM" — the format the wireframes show on the meeting summary. */
export function formatTime(date: Date): string {
	const hours = date.getHours();
	const minutes = `${date.getMinutes()}`.padStart(2, "0");
	const period = hours < 12 ? "AM" : "PM";
	const hour12 = hours % 12 === 0 ? 12 : hours % 12;
	return `${hour12}:${minutes} ${period}`;
}

/** Today at the given wall-clock time — the picker only cares about h:mm. */
function timeToday(hours: number, minutes: number): Date {
	const d = new Date();
	d.setHours(hours, minutes, 0, 0);
	return d;
}

/**
 * A field that opens the platform time picker instead of the keyboard.
 *
 * iOS gets the wheel (`display="spinner"`) in a bottom sheet with its own
 * Cancel / Done, because an inline iOS spinner has no way to dismiss itself.
 * Android's picker is already a modal dialog that reports its own dismissal,
 * so it is rendered bare and committed on the "set" event.
 */
export function TimeField({
	value,
	onChange,
	placeholder,
	minuteInterval = 5,
	invalid = false,
	disabled = false,
	className,
}: {
	value?: Date;
	onChange: (next: Date) => void;
	placeholder: string;
	/** Wheel step for minutes. 5 matches how meeting times are picked. */
	minuteInterval?: 1 | 5 | 10 | 15 | 30;
	invalid?: boolean;
	disabled?: boolean;
	className?: string;
}) {
	const { colorScheme } = useColorScheme();
	const colors = colorsFor(colorScheme);

	const [open, setOpen] = useState(false);
	// What the wheel is showing while the sheet is open, before Done confirms.
	const [draft, setDraft] = useState<Date>(value ?? timeToday(9, 0));

	const openPicker = () => {
		setDraft(value ?? timeToday(9, 0));
		setOpen(true);
	};

	const handleAndroidChange = (event: DateTimePickerEvent, next?: Date) => {
		setOpen(false);
		if (event.type === "set" && next) onChange(next);
	};

	const field = (
		<FieldButton
			accessibilityLabel={placeholder}
			className={className}
			disabled={disabled}
			invalid={invalid}
			onPress={openPicker}
			placeholder={placeholder}
			startAdornment={<Clock className="text-action-active" size={24} />}
			value={value ? formatTime(value) : undefined}
		/>
	);

	if (Platform.OS === "android") {
		return (
			<>
				{field}
				{open ? (
					<DateTimePicker
						minuteInterval={minuteInterval}
						mode="time"
						onChange={handleAndroidChange}
						value={draft}
					/>
				) : null}
			</>
		);
	}

	return (
		<>
			{field}
			<Modal
				animationType="slide"
				onRequestClose={() => setOpen(false)}
				transparent
				visible={open}
			>
				{/* Tapping the scrim is the same as Cancel. */}
				<Pressable
					accessibilityLabel="Dismiss time picker"
					className="flex-1 bg-black/40"
					onPress={() => setOpen(false)}
				/>
				<View className="border-border border-t bg-background pb-8">
					<View className="flex-row items-center justify-between px-4 py-2">
						<Pressable
							accessibilityRole="button"
							hitSlop={8}
							onPress={() => setOpen(false)}
						>
							<Text className="text-button-md text-muted-foreground">
								Cancel
							</Text>
						</Pressable>
						<Text className="font-figtree-semibold text-body2">
							{placeholder}
						</Text>
						<Pressable
							accessibilityRole="button"
							hitSlop={8}
							onPress={() => {
								onChange(draft);
								setOpen(false);
							}}
						>
							<Text className="font-figtree-semibold text-button-md text-primary">
								Done
							</Text>
						</Pressable>
					</View>
					<DateTimePicker
						display="spinner"
						minuteInterval={minuteInterval}
						mode="time"
						onChange={(_event, next) => next && setDraft(next)}
						textColor={colors.foreground}
						themeVariant={colorScheme === "dark" ? "dark" : "light"}
						value={draft}
					/>
				</View>
			</Modal>
		</>
	);
}
