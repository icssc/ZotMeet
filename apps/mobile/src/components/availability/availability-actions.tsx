import { cloneElement, isValidElement } from "react";
import { Pressable, type PressableProps, View } from "react-native";
import { Text } from "@/components/ui/text";
import { Icon } from "@/lib/icons";
import { cn } from "@/lib/utils";

/**
 * One "Floating Action Bar/Option" from the wireframes: an 18px icon above a
 * label. The label wraps naturally at the option's fixed width, so a longer
 * one like "Schedule Meeting" breaks onto two lines the way it does in Figma.
 */
export function AvailabilityAction({
	icon,
	label,
	className,
	disabled,
	selected,
	...props
}: PressableProps & {
	icon: React.ReactNode;
	label: string;
	/** Pink outline wash used when a paint mode is active (Figma selected state). */
	selected?: boolean;
}) {
	const sizedIcon = isValidElement<{ size?: number }>(icon)
		? cloneElement(icon, { size: icon.props.size ?? 18 })
		: icon;

	return (
		<Pressable
			accessibilityLabel={label}
			accessibilityRole="button"
			accessibilityState={{ disabled: !!disabled, selected: !!selected }}
			className={cn(
				"h-[52px] w-[61px] items-center justify-center gap-1 rounded-control",
				"active:opacity-60",
				selected && "border border-primary bg-primary/5",
				disabled && "opacity-50",
				className,
			)}
			disabled={disabled}
			{...props}
		>
			{sizedIcon}
			<Text className="text-center text-[10px] leading-[12px] tracking-[0.3px]">
				{label}
			</Text>
		</Pressable>
	);
}

export interface AvailabilityActionsProps {
	attendees: { responded: number; total: number };
	/** The viewer has a saved response — the web's `hasAvailability` label switch. */
	hasAvailability?: boolean;
	onShowResponses?: () => void;
	onAddAvailability?: () => void;
	onScheduleMeeting?: () => void;
}

/**
 * Native counterpart to the web app's
 * `components/availability/availability-actions.tsx`: the row of actions a
 * meeting offers. On the web these are MUI buttons in the sidebar or island;
 * here they are the three icon-over-label options of the wireframe's floating
 * control bar.
 *
 * Attendees / Schedule handlers stay optional until those flows land; Add
 * Availability is wired from `Availability` into personal edit mode.
 */
export function AvailabilityActions({
	attendees,
	hasAvailability = false,
	onShowResponses,
	onAddAvailability,
	onScheduleMeeting,
}: AvailabilityActionsProps) {
	return (
		<>
			<AvailabilityAction
				icon={<Icon name="group-add" />}
				label={`${attendees.responded}/${attendees.total} Attendees`}
				onPress={onShowResponses}
			/>
			<View className="h-[30px] w-px bg-border" />
			<AvailabilityAction
				icon={<Icon name="create" />}
				label={hasAvailability ? "Edit Availability" : "Add Availability"}
				onPress={onAddAvailability}
			/>
			<AvailabilityAction
				icon={<Icon name="event" />}
				label="Schedule Meeting"
				onPress={onScheduleMeeting}
			/>
		</>
	);
}
