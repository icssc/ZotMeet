"use client";

import AddIcon from "@mui/icons-material/Add";
import { Box, Button, Typography } from "@mui/material";
import { useQueryStates } from "nuqs";
import { useMemo, useSyncExternalStore } from "react";
import { CreateMeetingDialog } from "@/components/creation/create-meeting-dialog";
import { creationSearchParams } from "@/components/creation/creation";
import { ActionItems } from "@/components/dashboard/action-items";
import {
	type CalendarMeeting,
	DashboardCalendar,
} from "@/components/dashboard/dashboard-calendar";
import { DashboardLayout } from "@/components/dashboard/dashboard-parts";
import {
	ActionItemsSkeleton,
	CalendarSkeleton,
	UpcomingSkeleton,
} from "@/components/dashboard/dashboard-skeletons";
import { LibraryTraffic } from "@/components/dashboard/library-traffic";
import { QuickBook } from "@/components/dashboard/quick-book";
import { RecentRooms } from "@/components/dashboard/recent-rooms";
import { UpcomingMeetings } from "@/components/dashboard/upcoming-meetings";
import type { UserProfile } from "@/lib/auth/user";
import {
	buildDashboardModel,
	formatScheduledTime,
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

/**
 * Fires at each local top of the hour, when the greeting and "today" can
 * change, and when the tab is shown again, since timers in background tabs
 * and on a sleeping laptop fire late.
 */
function subscribeHourly(onChange: () => void) {
	let timer: ReturnType<typeof setTimeout>;
	const schedule = () => {
		const nextHour = new Date();
		nextHour.setHours(nextHour.getHours() + 1, 0, 0, 0);
		timer = setTimeout(() => {
			onChange();
			schedule();
		}, nextHour.getTime() - Date.now());
	};
	schedule();
	document.addEventListener("visibilitychange", onChange);
	return () => {
		clearTimeout(timer);
		document.removeEventListener("visibilitychange", onChange);
	};
}

/** `null` on the server, which doesn't know the viewer's timezone. */
function useLocalHour() {
	return useSyncExternalStore(
		subscribeHourly,
		() => new Date().getHours(),
		() => null,
	);
}

/**
 * Local midnight in ms; `null` on the server, whose "today" can already be
 * tomorrow (a UTC server during a Pacific evening).
 */
function useStartOfToday() {
	return useSyncExternalStore(subscribeHourly, getStartOfTodayMs, () => null);
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
	const meetingDays = useMemo(() => {
		const days = new Map<string, CalendarMeeting[]>();
		const scheduled = meetings
			.flatMap((meeting) => {
				const block = scheduledMeetingMap[meeting.id];
				return block ? [{ meeting, block }] : [];
			})
			.sort((a, b) =>
				a.block.scheduledFromTime.localeCompare(b.block.scheduledFromTime),
			);
		for (const { meeting, block } of scheduled) {
			const key = block.scheduledDate.toISOString().slice(0, 10);
			const time = `${formatScheduledTime(block.scheduledFromTime)} - ${formatScheduledTime(block.scheduledToTime)}`;
			const entry = { id: meeting.id, title: meeting.title, time };
			days.set(key, [...(days.get(key) ?? []), entry]);
		}
		return days;
	}, [meetings, scheduledMeetingMap]);

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
					<LibraryTraffic />
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
