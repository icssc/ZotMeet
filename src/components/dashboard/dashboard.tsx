"use client";

import AddIcon from "@mui/icons-material/Add";
import { Box, Button, Typography } from "@mui/material";
import { useQueryStates } from "nuqs";
import { useMemo, useSyncExternalStore } from "react";
import { CreateMeetingDialog } from "@/components/creation/create-meeting-dialog";
import { creationSearchParams } from "@/components/creation/creation";
import { ActionItems } from "@/components/dashboard/action-items";
import { DashboardCalendar } from "@/components/dashboard/dashboard-calendar";
import { DashboardLayout } from "@/components/dashboard/dashboard-parts";
import {
	ActionItemsSkeleton,
	CalendarSkeleton,
	UpcomingSkeleton,
} from "@/components/dashboard/dashboard-skeletons";
import { QuickBook } from "@/components/dashboard/quick-book";
import { RecentRooms } from "@/components/dashboard/recent-rooms";
import { UpcomingMeetings } from "@/components/dashboard/upcoming-meetings";
import type { UserProfile } from "@/lib/auth/user";
import {
	buildDashboardModel,
	getStartOfTodayMs,
	type ScheduledMeetingBlock,
} from "@/lib/meetings/utils";
import type { MeetingListRow } from "@/server/data/meeting/queries";

type DashboardProps = {
	user: UserProfile;
	meetings: MeetingListRow[];
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

/**
 * Local midnight in ms; `null` on the server, whose "today" can already be
 * tomorrow (a UTC server during a Pacific evening). Re-read on every render.
 */
function useStartOfToday() {
	return useSyncExternalStore(noopSubscribe, getStartOfTodayMs, () => null);
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

	// What counts as past depends on the viewer's date, so the sections that
	// filter on it render as skeletons until the browser takes over.
	const todayMs = useStartOfToday();
	const model = useMemo(
		() =>
			todayMs === null
				? null
				: buildDashboardModel({
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
		<DashboardLayout
			main={
				<>
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

					{model ? (
						<ActionItems
							items={model.actionItems}
							memberId={user.memberId}
							meetingCounts={meetingCounts}
							groupNames={groupNames}
						/>
					) : (
						<ActionItemsSkeleton />
					)}
					<QuickBook />
				</>
			}
			rail={
				<>
					{model ? (
						<>
							<DashboardCalendar meetingDays={meetingDays} />
							<UpcomingMeetings items={model.upcoming} />
						</>
					) : (
						<>
							<CalendarSkeleton />
							<UpcomingSkeleton />
						</>
					)}
					<Box sx={{ mt: 2 }}>
						<RecentRooms />
					</Box>
				</>
			}
		>
			<CreateMeetingDialog user={user} />
		</DashboardLayout>
	);
}
