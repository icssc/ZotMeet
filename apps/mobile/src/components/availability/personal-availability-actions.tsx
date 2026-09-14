import type { PaintMode } from "@zotmeet/shared";
import * as Haptics from "expo-haptics";
import { View } from "react-native";
import { AvailabilityAction } from "@/components/availability/availability-actions";
import { Icon } from "@/lib/icons";
import { useAvailabilityStore } from "@/store/useAvailabilityStore";

/** Legend swatches matching the web's `PERSONAL_AVAILABILITY_OPTIONS`. */
function PaintSwatch({ mode }: { mode: PaintMode }) {
	if (mode === "available") {
		return <View className="size-[18px] rounded-full bg-primary" />;
	}
	if (mode === "if-needed") {
		return (
			<View className="size-[18px] overflow-hidden rounded-full border-2 border-primary">
				<View className="absolute inset-0 bg-paper" />
				<View
					className="absolute bg-primary"
					style={{
						width: 3,
						height: 28,
						left: 2,
						top: -5,
						transform: [{ rotate: "45deg" }],
					}}
				/>
				<View
					className="absolute bg-primary"
					style={{
						width: 3,
						height: 28,
						left: 8,
						top: -5,
						transform: [{ rotate: "45deg" }],
					}}
				/>
			</View>
		);
	}
	return <View className="size-[18px] rounded-full border-2 border-border" />;
}

const PAINT_OPTIONS: { value: PaintMode; label: string }[] = [
	{ value: "available", label: "Available" },
	{ value: "if-needed", label: "If Needed" },
	{ value: "unavailable", label: "Unavailable" },
];

export interface PersonalAvailabilityActionsProps {
	onMoreOptions: () => void;
}

/**
 * Floating control bar for personal edit mode — Figma "[Meetings] Add
 * Availability" island: More Options | Available | If Needed | Unavailable.
 */
export function PersonalAvailabilityActions({
	onMoreOptions,
}: PersonalAvailabilityActionsProps) {
	const paintMode = useAvailabilityStore((s) => s.paintMode);
	const setPaintMode = useAvailabilityStore((s) => s.setPaintMode);

	return (
		<>
			<AvailabilityAction
				icon={<Icon name="expand-more" />}
				label="More Options"
				onPress={onMoreOptions}
			/>
			<View className="h-[30px] w-px bg-border" />
			{PAINT_OPTIONS.map(({ value, label }) => (
				<AvailabilityAction
					key={value}
					icon={<PaintSwatch mode={value} />}
					label={label}
					onPress={() => {
						if (value !== paintMode) {
							// A picker tick, as the calendar gives on a day change.
							Haptics.selectionAsync().catch(() => {});
						}
						setPaintMode(value);
					}}
					selected={paintMode === value}
				/>
			))}
		</>
	);
}
