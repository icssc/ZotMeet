"use client";

import { Button, Tab, Tabs } from "@mui/material";
import { useCallback, useState } from "react";
import { MeetingsDisplay } from "@/components/summary/meetings-display";
import type { SelectMeeting, SelectScheduledMeeting } from "@/db/schema";

interface MeetingsDisplayProps {
	meetings: SelectMeeting[];
	userId: string;
	scheduledTimeBlocksByMeetingId?: Record<string, SelectScheduledMeeting[]>;
}

export const Meetings = ({
	meetings,
	userId,
	scheduledTimeBlocksByMeetingId,
}: MeetingsDisplayProps) => {
	const [hostedOnly, setHostedOnly] = useState(false);
	const [tab, setTab] = useState(0);

	const scheduledMeetings =
		meetings?.filter((meeting) => meeting.scheduled) || [];
	const unscheduledMeetings =
		meetings?.filter((meeting) => !meeting.scheduled) || [];

	const filteredScheduledMeetings = (
		hostedOnly
			? scheduledMeetings.filter((meeting) => meeting.hostId === userId)
			: scheduledMeetings
	).sort(
		(a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
	);

	const filteredUnscheduledMeetings = (
		hostedOnly
			? unscheduledMeetings.filter((meeting) => meeting.hostId === userId)
			: unscheduledMeetings
	).sort(
		(a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
	);

	const handleClick = useCallback(() => {
		setHostedOnly((prev) => !prev);
	}, []);

	return (
		<div className="w-full rounded-xl">
			<div className="flex items-center justify-between">
				<h1 className="font-figtree font-medium text-3xl">Meetings</h1>

				<Button variant="outlined" size="small" onClick={handleClick}>
					{hostedOnly ? "Show All" : "Show Hosted Only"}
				</Button>
			</div>

			<Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 4 }}>
				<Tab label="Unscheduled" />
				<Tab label="Scheduled" />
			</Tabs>

			{tab === 0 && <MeetingsDisplay meetings={filteredUnscheduledMeetings} />}
			{tab === 1 && (
				<MeetingsDisplay
					meetings={filteredScheduledMeetings}
					scheduledTimeBlocks={scheduledTimeBlocksByMeetingId}
				/>
			)}
		</div>
	);
};
