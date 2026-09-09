import { ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Text } from "@/components/ui/text";

/**
 * Shared page chrome: safe-area padding, a title block, and a scrolling body.
 * Roughly the native equivalent of the web app's `px-4 py-8 sm:px-8` wrapper.
 */
export function Screen({
	title,
	subtitle,
	children,
}: {
	title: string;
	subtitle?: string;
	children: React.ReactNode;
}) {
	const insets = useSafeAreaInsets();

	return (
		<View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
			<ScrollView
				contentContainerClassName="gap-4 px-4 pt-4 pb-10"
				showsVerticalScrollIndicator={false}
			>
				<View className="gap-1">
					<Text className="font-figtree-bold text-3xl">{title}</Text>
					{subtitle ? (
						<Text className="text-base text-muted-foreground">{subtitle}</Text>
					) : null}
				</View>
				{children}
			</ScrollView>
		</View>
	);
}
