import { View } from "react-native";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";

/**
 * MUI `<FormLabel>` / `<FormHelperText>` equivalents. The Figma frames use the
 * label as an all-caps group heading ("SELECT ONE") and the helper text as the
 * hint under a field group ("Select the days that apply.").
 */
export function FormLabel({
	children,
	className,
}: {
	children: React.ReactNode;
	className?: string;
}) {
	return (
		<Text className={cn("text-caption text-muted-foreground", className)}>
			{children}
		</Text>
	);
}

export function FormHelperText({
	children,
	className,
}: {
	children: React.ReactNode;
	className?: string;
}) {
	return (
		<View className="px-4 py-1">
			<Text className={cn("text-helper text-muted-foreground", className)}>
				{children}
			</Text>
		</View>
	);
}
