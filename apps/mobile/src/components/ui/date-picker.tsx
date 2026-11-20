import { formatLocalDateKey, MONTHS } from "@zotmeet/shared";
import { useState } from "react";
import { Pressable, View } from "react-native";
import { Calendar } from "@/components/ui/calendar";
import { FieldShell } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { Icon } from "@/lib/icons";
import { cn } from "@/lib/utils";

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
	label = "Date",
	placeholder = "MM/DD/YYYY",
	minDate,
}: {
	value: Date | null;
	onChange: (next: Date) => void;
	label?: string;
	placeholder?: string;
	minDate?: Date;
}) {
	const [open, setOpen] = useState(false);
	const [month, setMonth] = useState(() => value ?? new Date());

	return (
		<View className="w-full gap-2">
			<Pressable
				accessibilityLabel={label}
				accessibilityRole="button"
				accessibilityState={{ expanded: open }}
				accessibilityValue={value ? { text: formatDisplay(value) } : undefined}
				onPress={() => {
					if (!open) setMonth(value ?? new Date());
					setOpen((o) => !o);
				}}
			>
				<FieldShell
					endAdornment={
						<Icon name="calendar-today" className="text-action-active" />
					}
					focused={open}
				>
					<Text
						className={cn(
							"flex-1 text-field",
							value ? "text-foreground" : "text-muted-foreground",
						)}
						numberOfLines={1}
					>
						{value ? formatDisplay(value) : placeholder}
					</Text>

					{/* Floating label: sits on the top border, and its background
					    masks the outline behind it to create the notch. */}
					<View
						className="absolute -top-3 left-2.5 bg-background px-1"
						pointerEvents="none"
					>
						<Text
							className={cn(
								"text-helper",
								open ? "text-primary" : "text-muted-foreground",
							)}
						>
							{label}
						</Text>
					</View>
				</FieldShell>
			</Pressable>

			{open ? (
				<View className="items-center">
					<Calendar
						minDate={minDate}
						month={month}
						onMonthChange={setMonth}
						onSelectRange={(keys, additive) => {
							// Ignore a drag that started on the already-selected day.
							if (!additive || keys.length === 0) return;
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
