import { cva, type VariantProps } from "class-variance-authority";
import { Pressable, View } from "react-native";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";

const pillVariants = cva(
	"flex-row items-center justify-center gap-1 self-start rounded-full border",
	{
		variants: {
			size: {
				small: "px-2 py-0.5",
				medium: "px-3 py-1",
			},
			selected: {
				true: "border-primary bg-[#FF87A64D]",
				false: "border-input-outlined bg-transparent",
			},
		},
		defaultVariants: { size: "medium", selected: false },
	},
);

const pillTextVariants = cva("font-figtree-medium", {
	variants: {
		size: { small: "text-helper", medium: "text-body2" },
		selected: {
			true: "text-secondary-foreground",
			false: "text-foreground",
		},
	},
	defaultVariants: { size: "medium", selected: false },
});

type PillProps = VariantProps<typeof pillVariants> & {
	label: string;
	onPress?: () => void;
	startAdornment?: React.ReactNode;
	disabled?: boolean;
	className?: string;
};

export function Pill({
	label,
	onPress,
	startAdornment,
	disabled = false,
	size,
	selected = false,
	className,
}: PillProps) {
	const face = cn(
		pillVariants({ size, selected }),
		disabled && "opacity-50",
		className,
	);
	const content = (
		<>
			{startAdornment}
			<Text className={pillTextVariants({ size, selected })} numberOfLines={1}>
				{label}
			</Text>
		</>
	);

	if (!onPress) return <View className={face}>{content}</View>;

	return (
		<Pressable
			accessibilityRole="button"
			accessibilityState={{ disabled, selected: !!selected }}
			className={cn(face, "active:opacity-80")}
			disabled={disabled}
			onPress={onPress}
		>
			{content}
		</Pressable>
	);
}
