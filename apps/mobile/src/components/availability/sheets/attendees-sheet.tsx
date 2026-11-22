import { Modal, Pressable, View } from "react-native";
import { SheetGrabber } from "@/components/ui/sheet-grabber";
import { Typography } from "@/components/ui/typography";

export interface AttendeesSheetProps {
	open: boolean;
	onClose: () => void;
}

export function AttendeesSheet({ open, onClose }: AttendeesSheetProps) {
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

				<View className="flex h-[75%] rounded-t-xl bg-paper p-4">
					<SheetGrabber />
					<View className="self-center border-primary border-b-2 px-6 pb-2">
						<Typography variant="button" className="text-center">
							Attendees
						</Typography>
					</View>

					<View className="mt-6">
						<Typography>Map Display</Typography>
						<Typography variant="caption" color="textSecondary">
							Filter how responder availability shows together on the map.
						</Typography>
					</View>
				</View>
			</View>
		</Modal>
	);
}
