import { View } from "react-native";
import { Raised } from "@/components/ui/raised";
import { Text } from "@/components/ui/text";
import { Check } from "@/lib/icons";
import { cn } from "@/lib/utils";

/**
 * A single-select option card — the "Member" component in the Figma
 * wireframes, used for the "SELECT ONE" location choice on Create Meeting.
 * Selected state tints the surface with `primary-tint` and reveals a
 * checkmark; both states carry the shared 3D ledge.
 */
export function SelectableCard({
	title,
	description,
	selected = false,
	onPress,
	className,
}: {
	title: string;
	description?: string;
	selected?: boolean;
	onPress?: () => void;
	className?: string;
}) {
	return (
		<Raised
			accessibilityRole="radio"
			accessibilityState={{ selected }}
			className={cn(
				"flex-row items-center gap-3 rounded-control border border-input-standard p-4",
				selected ? "bg-primary-tint" : "bg-paper",
			)}
			containerClassName={className}
			onPress={onPress}
			radiusClassName="rounded-control"
		>
			<View className="flex-1 gap-0.5">
				<Text className="font-figtree-medium text-foreground text-subtitle1">
					{title}
				</Text>
				{description ? (
					<Text className="text-body2 text-muted-foreground">
						{description}
					</Text>
				) : null}
			</View>
			{selected ? (
				<Check className="text-primary" size={24} strokeWidth={2} />
			) : null}
		</Raised>
	);
}
