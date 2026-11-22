import type { Member } from "@zotmeet/shared";
import { Modal, Pressable, View } from "react-native";
import { Avatar } from "@/components/ui/avatar";
import { Chip } from "@/components/ui/chip";
import { SheetGrabber } from "@/components/ui/sheet-grabber";
import { Switch } from "@/components/ui/switch";
import { Typography } from "@/components/ui/typography";
import { useAvailabilityStore } from "@/store/useAvailabilityStore";

export interface AttendeesSheetProps {
	open: boolean;
	onClose: () => void;
	members: Member[];
}

export function AttendeesSheet({
	open,
	onClose,
	members,
}: AttendeesSheetProps) {
	const showBestTimes = useAvailabilityStore((s) => s.showBestTimes);
	const setShowBestTimes = useAvailabilityStore((s) => s.setShowBestTimes);

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
							<Switch value={showBestTimes} onValueChange={setShowBestTimes} />
							<Typography>Best Times</Typography>
						</View>
					</View>

					<View className="mt-4">
						<Typography>Responders</Typography>
						<Typography variant="caption" color="textSecondary">
							{members.length} Available
						</Typography>
					</View>

					<View className="mt-6 flex-row flex-wrap gap-2">
						{members.map((member) => (
							<Chip
								key={member.memberId}
								avatar={
									<Avatar
										src={member.profilePicture}
										alt={member.displayName}
									/>
								}
								label={member.displayName}
								color="primary"
							/>
						))}
					</View>
				</View>
			</View>
		</Modal>
	);
}
