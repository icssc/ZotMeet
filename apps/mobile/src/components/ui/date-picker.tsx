// Native counterpart to MUI's <DatePicker> (field + calendar).
// Native: the calendar expands inline instead of opening a popover.
import { formatLocalDateKey, MONTHS } from "@zotmeet/shared";
import { useState } from "react";
import { View } from "react-native";
import { Calendar } from "@/components/ui/calendar";
import { FieldButton } from "@/components/ui/input";
import { Icon } from "@/lib/icons";

function fromKey(key: string): Date {
	// Local midnight; new Date("YYYY-MM-DD") would parse as UTC.
	const [y, m, d] = key.split("-").map(Number);
	return new Date(y, m - 1, d);
}

function formatDisplay(date: Date): string {
	return `${MONTHS[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

export function DatePicker({
	value,
	onChange,
	placeholder = "Date",
	minDate,
}: {
	value: Date | null;
	onChange: (next: Date) => void;
	placeholder?: string;
	minDate?: Date;
}) {
	const [open, setOpen] = useState(false);
	const [month, setMonth] = useState(() => value ?? new Date());

	return (
		<View className="w-full gap-2">
			<FieldButton
				endAdornment={
					<Icon name="calendar-today" className="text-action-active" />
				}
				onPress={() => setOpen((o) => !o)}
				placeholder={placeholder}
				value={value ? formatDisplay(value) : undefined}
			/>
			{open ? (
				<View className="items-center">
					<Calendar
						minDate={minDate}
						mode="single"
						month={month}
						onMonthChange={setMonth}
						onSelectRange={(keys) => {
							onChange(fromKey(keys[0]));
							setOpen(false);
						}}
						selectedKeys={value ? [formatLocalDateKey(value)] : []}
					/>
				</View>
			) : null}
		</View>
	);
}
