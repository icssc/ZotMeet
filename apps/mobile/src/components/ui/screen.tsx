import { RefreshControl, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Text } from "@/components/ui/text";

/**
 * Shared page chrome: safe-area padding, a title block, and a scrolling body.
 * Roughly the native equivalent of the web app's `px-4 py-8 sm:px-8` wrapper.
 * Pass `scroll={false}` when the screen manages its own scrolling and pins
 * something (e.g. a search bar) to the bottom.
 */
export function Screen({
	title,
	subtitle,
	actions,
	onRefresh,
	refreshing = false,
	scroll = true,
	children,
}: {
	title: string;
	subtitle?: string;
	/** Buttons on the title row's right — the web's mobile header actions. */
	actions?: React.ReactNode;
	/** Enables pull-to-refresh; `refreshing` keeps the indicator shown. */
	onRefresh?: () => void;
	refreshing?: boolean;
	/** false: no outer ScrollView; children fill the remaining height. */
	scroll?: boolean;
	children: React.ReactNode;
}) {
	const insets = useSafeAreaInsets();

	const header = (
		<View className="flex-row items-center justify-between gap-4">
			<View className="min-w-0 flex-1 gap-1">
				<Text className="font-figtree-bold text-3xl">{title}</Text>
				{subtitle ? (
					<Text className="text-base text-muted-foreground">{subtitle}</Text>
				) : null}
			</View>
			{actions}
		</View>
	);

	if (!scroll) {
		return (
			<View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
				<View className="px-4 pt-4 pb-2">{header}</View>
				<View className="flex-1">{children}</View>
			</View>
		);
	}

	return (
		<View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
			<ScrollView
				contentContainerClassName="grow gap-4 px-4 pt-4 pb-10"
				showsVerticalScrollIndicator={false}
				refreshControl={
					onRefresh ? (
						<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
					) : undefined
				}
			>
				{header}
				{children}
			</ScrollView>
		</View>
	);
}
