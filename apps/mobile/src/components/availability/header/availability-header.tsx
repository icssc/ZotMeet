import {
	convertTimeFromUTC,
	formatDateToUSNumeric,
	formatTimeWithHoursAndMins,
	type MeetingResponse,
	sortMeetingIsoDatesAsc,
} from "@zotmeet/shared";
import { useRouter } from "expo-router";
import { useMemo } from "react";
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
	meetingData: MeetingResponse;
}

/**
 * Native counterpart to the web app's
 * `components/availability/header/availability-header.tsx`, in its mobile
 * (`sm:hidden`) form: the "Meetings" back button with the copy and overflow
 * buttons opposite, then the meeting's title and its date, time and location.
 *
 * The date and time strings are derived exactly as the web header derives
 * them: first and last of the sorted dates, and the stored UTC times brought
 * back into the meeting's own timezone. A "days of the week" meeting stores
 * anchor dates, so its date range is not meaningful and is left out, as on
 * the web table header.
 */
export function AvailabilityHeader({ meetingData }: AvailabilityHeaderProps) {
	const { dateRange, timeRange } = useMemo(() => {
		const sortedDates = sortMeetingIsoDatesAsc(meetingData.dates);
		const first = sortedDates.at(0) ?? meetingData.dates.at(0) ?? "";
		const last = sortedDates.at(-1) ?? first;

		const start = formatDateToUSNumeric(new Date(first));
		const end = formatDateToUSNumeric(new Date(last));

		const displayTimezone =
			meetingData.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone;
		const startTime = formatTimeWithHoursAndMins(
			convertTimeFromUTC(meetingData.fromTime, displayTimezone, first),
		);
		const endTime = formatTimeWithHoursAndMins(
			convertTimeFromUTC(meetingData.toTime, displayTimezone, first),
		);

		return {
			dateRange:
				meetingData.meetingType === "dates"
					? start === end
						? start
						: `${start}-${end}`
					: null,
			timeRange: `${startTime} - ${endTime}`,
		};
	}, [meetingData]);

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
					<Icon name="chevron-left" size={20} />
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
						<Icon name="content-copy" />
					</IconButton>
					<IconButton accessibilityLabel="More options" color="inherit">
						<Icon name="more-vert" />
					</IconButton>
				</View>
			</View>

			<View className="w-full gap-2 px-3 pb-3">
				<Typography variant="h6">{meetingData.title}</Typography>
				<View className="w-full flex-row items-center justify-between">
					{dateRange ? (
						<MeetingDetail
							icon={
								<Icon
									name="date-range"
									className="text-muted-foreground"
									size={14}
								/>
							}
						>
							{dateRange}
						</MeetingDetail>
					) : null}
					<MeetingDetail
						icon={
							<Icon
								name="access-time"
								className="text-muted-foreground"
								size={14}
							/>
						}
					>
						{timeRange}
					</MeetingDetail>
					{meetingData.location ? (
						<MeetingDetail
							icon={
								<Icon
									name="fmd-good"
									className="text-muted-foreground"
									size={14}
								/>
							}
						>
							{meetingData.location}
						</MeetingDetail>
					) : null}
				</View>
			</View>
		</View>
	);
}
