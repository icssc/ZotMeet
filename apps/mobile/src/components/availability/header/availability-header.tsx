import { useRouter } from "expo-router";
import { View } from "react-native";
import { Button, buttonTextVariants } from "@/components/ui/button";
import { IconButton } from "@/components/ui/icon-button";
import { Text } from "@/components/ui/text";
import { Typography } from "@/components/ui/typography";
import { Icon } from "@/lib/icons";

/** One icon-and-text pair in the "meeting details" row under the title. */
function MeetingDetail({
	icon,
	children,
}: {
	icon: React.ReactNode;
	children: string;
}) {
	return (
		<View className="flex-row items-center gap-0.5">
			{icon}
			<Text className="text-[13px] text-muted-foreground leading-[13px] tracking-[0.12px]">
				{children}
			</Text>
		</View>
	);
}

export interface AvailabilityHeaderProps {
	title: string;
	/** Already formatted, e.g. "2/16-2/20". */
	dateRange: string;
	/** Already formatted, e.g. "9 AM - 5 PM". */
	timeRange: string;
	location: string;
}

/**
 * Native counterpart to the web app's
 * `components/availability/header/availability-header.tsx`, in its mobile
 * (`sm:hidden`) form: the "Meetings" back button with the copy and overflow
 * buttons opposite, then the meeting's title and its date, time and location.
 *
 * The web header formats its own dates from `meetingData`; that moves here
 * once there is a backend to format from, so for now it takes strings.
 */
export function AvailabilityHeader({
	title,
	dateRange,
	timeRange,
	location,
}: AvailabilityHeaderProps) {
	const router = useRouter();

	return (
		<View className="w-full">
			<View className="w-full flex-row items-start justify-between">
				<Button
					accessibilityLabel="Back to meetings"
					className="px-2 py-1.5"
					color="inherit"
					onPress={() => router.back()}
					size="medium"
				>
					<Icon.ChevronLeft size={20} />
					<Text
						className={buttonTextVariants({
							variant: "text",
							color: "inherit",
							size: "medium",
						})}
					>
						Meetings
					</Text>
				</Button>
				<View className="flex-row items-center gap-1">
					<IconButton accessibilityLabel="Copy meeting name" color="inherit">
						<Icon.Copy />
					</IconButton>
					<IconButton accessibilityLabel="More options" color="inherit">
						<Icon.EllipsisVertical />
					</IconButton>
				</View>
			</View>

			<View className="w-full gap-2 px-3 pb-3">
				<Typography variant="h6">{title}</Typography>
				<View className="w-full flex-row items-center justify-between">
					<MeetingDetail
						icon={
							<Icon.CalendarRange className="text-muted-foreground" size={14} />
						}
					>
						{dateRange}
					</MeetingDetail>
					<MeetingDetail
						icon={<Icon.Clock className="text-muted-foreground" size={14} />}
					>
						{timeRange}
					</MeetingDetail>
					<MeetingDetail
						icon={<Icon.MapPin className="text-muted-foreground" size={14} />}
					>
						{location}
					</MeetingDetail>
				</View>
			</View>
		</View>
	);
}
