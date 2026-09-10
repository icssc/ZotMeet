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
function AvailabilityAction({
	icon,
	label,
	className,
	disabled,
	...props
}: PressableProps & {
	icon: React.ReactNode;
	label: string;
}) {
	// Hand the icon its size the way `IconButton` does, so callers write
	// `<Icon.Users />` and the action decides how big it renders.
	const sizedIcon = isValidElement<{ size?: number }>(icon)
		? cloneElement(icon, { size: icon.props.size ?? 18 })
		: icon;

	return (
		<Pressable
			accessibilityLabel={label}
			accessibilityRole="button"
			accessibilityState={{ disabled: !!disabled }}
			className={cn(
				"h-[52px] w-[61px] items-center justify-center gap-1 rounded-control",
				"active:opacity-60",
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
	onShowResponses?: () => void;
	onAddAvailability?: () => void;
	onScheduleMeeting?: () => void;
}

/**
 * Native counterpart to the web app's
 * `components/availability/availability-actions.tsx`: the row of actions a
 * meeting offers. On the web these are MUI buttons in the sidebar or island;
 * here they are the three icon-over-label options of the wireframe's floating
 * control bar, with MUI's `<Divider vertical>` splitting the response count
 * from the two actions.
 *
 * Front end only: the handlers are optional and nothing is wired to them yet.
 */
export function AvailabilityActions({
	attendees,
	onShowResponses,
	onAddAvailability,
	onScheduleMeeting,
}: AvailabilityActionsProps) {
	return (
		<>
			<AvailabilityAction
				icon={<Icon.Users />}
				label={`${attendees.responded}/${attendees.total} Attendees`}
				onPress={onShowResponses}
			/>
			<View className="h-[30px] w-px bg-border" />
			<AvailabilityAction
				icon={<Icon.Pencil />}
				label="Add Availability"
				onPress={onAddAvailability}
			/>
			<AvailabilityAction
				icon={<Icon.CalendarDays />}
				label="Schedule Meeting"
				onPress={onScheduleMeeting}
			/>
		</>
	);
}
