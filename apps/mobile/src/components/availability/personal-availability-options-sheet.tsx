import { Modal, Pressable, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/ui/icon-button";
import { SheetGrabber } from "@/components/ui/sheet-grabber";
import { Text } from "@/components/ui/text";
import { Typography } from "@/components/ui/typography";
import { Icon } from "@/lib/icons";

export interface PersonalAvailabilityOptionsSheetProps {
	open: boolean;
	onClose: () => void;
	onClearAvailability: () => void;
	canClear: boolean;
}

/**
 * Mobile stand-in for the web's `PersonalAvailabilitySidebar` sheet layout
 * (opened from "More Options"). Paint modes live on the island; this sheet
 * exposes the rest of the desktop settings that are available without extra
 * APIs yet — clear availability, with import / calendar overlays noted.
 */
export function PersonalAvailabilityOptionsSheet({
	open,
	onClose,
	onClearAvailability,
	canClear,
}: PersonalAvailabilityOptionsSheetProps) {
	const insets = useSafeAreaInsets();

	return (
		<Modal
			animationType="slide"
			onRequestClose={onClose}
			transparent
			visible={open}
		>
			<View className="flex-1 justify-end bg-black/40">
				<Pressable
					accessibilityLabel="Dismiss options"
					className="flex-1"
					onPress={onClose}
				/>
				<View
					className="max-h-[85%] rounded-t-xl border border-border bg-paper px-4 pt-2"
					style={{ paddingBottom: Math.max(insets.bottom, 16) }}
				>
					<SheetGrabber />
					<View className="mb-2 flex-row items-center justify-between">
						<Typography variant="h6">Availability Settings</Typography>
						<IconButton
							accessibilityLabel="Close"
							onPress={onClose}
							size="small"
						>
							<Icon name="close" />
						</IconButton>
					</View>

					<ScrollView className="min-h-0" showsVerticalScrollIndicator={false}>
						<Text className="mb-3 text-caption text-muted-foreground">
							Use the island to switch between Available, If Needed, and
							Unavailable, then drag over the calendar — same options as
							desktop.
						</Text>

						<Button
							className="mb-4 w-full"
							color="inherit"
							disabled={!canClear}
							onPress={() => {
								onClearAvailability();
								onClose();
							}}
							variant="outlined"
						>
							Clear availability
						</Button>

						<Typography variant="button">
							Import Previous Availability
						</Typography>
						<Text className="mt-1 mb-4 text-caption text-muted-foreground">
							Import from past meetings will land here once the mobile API is
							wired — use the web app for now.
						</Text>

						<Typography variant="button">Calendar Overlays</Typography>
						<Text className="mt-1 text-caption text-muted-foreground">
							Google Calendar overlays match the desktop sidebar and are coming
							to mobile next.
						</Text>
					</ScrollView>
				</View>
			</View>
		</Modal>
	);
}
