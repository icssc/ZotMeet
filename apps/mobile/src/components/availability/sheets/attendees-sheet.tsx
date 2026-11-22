import type { Member } from "@zotmeet/shared";
import { Modal, Pressable, View } from "react-native";
import { SheetGrabber } from "@/components/ui/sheet-grabber";
import { Switch } from "@/components/ui/switch";
import { Typography } from "@/components/ui/typography";

export interface AttendeesSheetProps {
	open: boolean;
	onClose: () => void;
	members: Member[];
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

					<View className="mt-4 flex-row gap-6">
						<View className="flex-row items-center gap-2">
							<Switch />
							<Typography>Best Times</Typography>
						</View>

						<View className="flex-row items-center gap-2">
							<Switch />
							<Typography>"If-Needed" Times</Typography>
						</View>
					</View>

					<View className="mt-4">
						<Typography>Responders</Typography>
						<Typography variant="caption" color="textSecondary">
							Available
						</Typography>
					</View>
				</View>
			</View>
		</Modal>
	);
}
