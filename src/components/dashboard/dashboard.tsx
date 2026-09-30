"use client";

import AddIcon from "@mui/icons-material/Add";
import { Box, Button, Typography } from "@mui/material";
import { useQueryStates } from "nuqs";
import { useMemo, useSyncExternalStore } from "react";
import { CreateMeetingDialog } from "@/components/creation/create-meeting-dialog";
import { creationSearchParams } from "@/components/creation/creation";
import { ActionItems } from "@/components/dashboard/action-items";
import { DashboardCalendar } from "@/components/dashboard/dashboard-calendar";
import { QuickBook } from "@/components/dashboard/quick-book";
import { RecentRooms } from "@/components/dashboard/recent-rooms";
import { UpcomingMeetings } from "@/components/dashboard/upcoming-meetings";
import type { SelectMeeting } from "@/db/schema";
import type { UserProfile } from "@/lib/auth/user";
import {
	buildDashboardModel,
	getStartOfTodayMs,
	type ScheduledMeetingBlock,
} from "@/lib/meetings/utils";

/** A row of `getMeetings` — what the summary page's list receives too. */
export type DashboardMeeting = SelectMeeting & {
	hostDisplayName: string | null;
	needsAvailability: boolean;
	allAvailabilityFilled: boolean;
};

type DashboardProps = {
	user: UserProfile;
	meetings: DashboardMeeting[];
	meetingCounts: Record<string, number>;
	scheduledMeetingMap: Record<string, ScheduledMeetingBlock>;
	groupNames: Record<string, string>;
};

const noopSubscribe = () => () => {};

function useLocalHour() {
	return useSyncExternalStore(
		noopSubscribe,
		() => new Date().getHours(),
		() => null,
	);
}

function greetingFor(hour: number | null) {
	if (hour === null) return "Welcome";
	if (hour < 12) return "Good Morning";
	if (hour < 18) return "Good Afternoon";
	return "Good Evening";
}

export function Dashboard({
	user,
	meetings,
	meetingCounts,
	scheduledMeetingMap,
	groupNames,
}: DashboardProps) {
	const [, setCreationParams] = useQueryStates(creationSearchParams);
	const hour = useLocalHour();

	// Read on every render so a tab left open across midnight re-buckets.
	const todayMs = getStartOfTodayMs();
	const { actionItems, upcoming } = useMemo(
		() =>
			buildDashboardModel({
				meetings,
				memberId: user.memberId,
				scheduledMeetingMap,
				todayMs,
			}),
		[meetings, user.memberId, scheduledMeetingMap, todayMs],
	);

	// Scheduled dates are UTC calendar days (see `formatUpcomingDate`).
	const meetingDays = useMemo(
		() =>
			new Set(
				Object.values(scheduledMeetingMap).map((block) =>
					block.scheduledDate.toISOString().slice(0, 10),
				),
			),
		[scheduledMeetingMap],
	);

	const firstName = user.displayName.split(" ")[0];

	return (
		<Box
			sx={{
				// 1436px of content inside the design's 38px gutters.
				maxWidth: 1512,
				mx: "auto",
				px: { xs: 2, md: 4.75 },
				pt: { xs: 3, md: 7 },
				pb: { xs: 4, md: 8 },
				display: "grid",
				gridTemplateColumns: { xs: "1fr", lg: "minmax(0, 1fr) 430px" },
				columnGap: 5.75,
				rowGap: 4,
				alignItems: "start",
			}}
		>
			<Box
				sx={{ display: "flex", flexDirection: "column", gap: 4, minWidth: 0 }}
			>
				<Box
					sx={{
						display: "flex",
						alignItems: { xs: "stretch", sm: "center" },
						flexDirection: { xs: "column", sm: "row" },
						justifyContent: "space-between",
						gap: 2,
					}}
				>
					<Typography variant="h3" component="h1" sx={{ fontWeight: 700 }}>
						{greetingFor(hour)}, {firstName}!
					</Typography>
					<Button
						variant="contained"
						size="large"
						startIcon={<AddIcon />}
						onClick={() => void setCreationParams({ create: true })}
						sx={{
							flexShrink: 0,
							fontSize: (theme) => theme.typography.body1.fontSize,
						}}
					>
						Create A Meeting
					</Button>
				</Box>

				<ActionItems
					items={actionItems}
					memberId={user.memberId}
					meetingCounts={meetingCounts}
					groupNames={groupNames}
				/>
				<QuickBook />
			</Box>

			<Box
				sx={{ display: "flex", flexDirection: "column", gap: 2, minWidth: 0 }}
			>
				<DashboardCalendar meetingDays={meetingDays} />
				<UpcomingMeetings items={upcoming} />
				<Box sx={{ mt: 2 }}>
					<RecentRooms />
				</Box>
			</Box>

			<CreateMeetingDialog user={user} />
		</Box>
	);
}
