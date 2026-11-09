import {
	formatGroupMeetingDates,
	type GroupMeetingItem,
	groupMeetingStatus,
} from "@zotmeet/shared";
import { useRouter } from "expo-router";
import { Pressable, View } from "react-native";
import { Avatar } from "@/components/ui/avatar";
import { Typography } from "@/components/ui/typography";
import { Icon } from "@/lib/icons";

/** Native counterpart to the web's `GroupMeetingCard` (in `group-member-list.tsx`). */
export function GroupMeetingCard({ meeting }: { meeting: GroupMeetingItem }) {
	const router = useRouter();
	const status = groupMeetingStatus(meeting);

	return (
		<Pressable
			accessibilityRole="button"
			accessibilityLabel={meeting.title}
			className="gap-2 rounded-lg border border-divider bg-card px-4 py-3 active:opacity-80"
			onPress={() =>
				router.push({
					pathname: "/availability/[slug]",
					params: { slug: meeting.id },
				})
			}
		>
			<View className="flex-row items-center gap-2">
				<Typography variant="body1" noWrap className="min-w-0 flex-1">
					{meeting.title}
				</Typography>
				<Typography variant="caption" color="textSecondary" noWrap>
					Created By {meeting.hostName}
				</Typography>
				<Avatar
					size={18}
					alt={meeting.hostName}
					fallback={meeting.hostName.charAt(0).toUpperCase()}
				/>
			</View>

			<View className="flex-row items-center gap-1.5">
				<Icon
					name="calendar-today"
					size={16}
					className="text-muted-foreground"
				/>
				<Typography variant="body2" color="textSecondary">
					{formatGroupMeetingDates(meeting)}
				</Typography>
				<Typography variant="body2" color="textSecondary">
					•
				</Typography>
				<Icon name="schedule" size={16} className="text-muted-foreground" />
				<Typography variant="body2" color="textSecondary">
					{meeting.respondedCount}/{meeting.totalMembers} responded
				</Typography>
			</View>

			{status === "availability-needed" ? (
				<View className="flex-row items-center gap-2 rounded-md bg-error-tint px-3 py-1.5">
					<Icon name="error" size={20} className="text-error-main" />
					<Typography variant="body2" className="text-error-main">
						Availability Needed
					</Typography>
				</View>
			) : status === "responded" ? (
				<View className="flex-row items-center gap-2 rounded-md bg-success-tint px-3 py-1.5">
					<Icon name="check-circle" size={20} className="text-success-main" />
					<Typography variant="body2" className="text-success-main">
						Responded!
					</Typography>
				</View>
			) : null}
		</Pressable>
	);
}
