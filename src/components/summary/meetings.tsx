"use client";

import { useCallback, useState } from "react";
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "@/components/custom/tabs";
import { Button } from "@/components/ui/button";
import MeetingCard from "@/components/ui/meeting-card";
import type { SelectMeeting } from "@/db/schema";
import { toMeetingCardProps } from "@/lib/meeting-card/mapper";

import { cn } from "@/lib/utils";

interface MeetingsDisplayProps {
	meetings: SelectMeeting[];
	userId: string;
	meetingCounts: Record<string, number>;
}

export const Meetings = ({
	meetings,
	userId,
	meetingCounts,
}: MeetingsDisplayProps) => {
	const [hostedOnly, setHostedOnly] = useState(false);

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

	const renderMeetingCards = (displayMeetings: SelectMeeting[]) => {
		if (displayMeetings.length === 0) {
			return (
				<div className="flex items-center gap-4 rounded-xl border-2 border-gray-200 bg-[#F9FAFB] bg-opacity-50 p-6 pr-8">
					<h3 className="truncate font-dm-sans font-medium text-gray-800 text-xl">
						No meetings found.
					</h3>
				</div>
			);
		}

		return (
			<div className="grid gap-3 sm:grid-cols-1 lg:grid-cols-3">
				{displayMeetings.map((meeting) => {
					const cardProps = toMeetingCardProps(meeting, {
						responderCount: meetingCounts[meeting.id] ?? 0,
					});

					return <MeetingCard key={meeting.id} {...cardProps} />;
				})}
			</div>
		);
	};

	return (
		<div className="w-full rounded-xl">
			<div className="flex items-center justify-between">
				<h1 className="font-medium font-montserrat text-3xl">Meetings</h1>

				<Button
					variant="outline"
					size="sm"
					className="flex w-32 items-center justify-center font-dm-sans text-xs"
					onClick={handleClick}
				>
					{hostedOnly ? "Show All" : "Show Hosted Only"}
				</Button>
			</div>

			<Tabs defaultValue="unscheduled">
				<TabsList className="mb-8 space-x-0">
					<TabsTrigger
						value="unscheduled"
						className={cn(
							"border-0 border-neutral-300 border-b-2 p-4 pb-0 font-montserrat text-lg duration-0",
							"data-[state=active]:border-orange-500",
						)}
					>
						Unscheduled
					</TabsTrigger>
					<TabsTrigger
						value="scheduled"
						className={cn(
							"border-0 border-neutral-300 border-b-2 p-4 pb-0 font-montserrat text-lg duration-0",
							"data-[state=active]:border-orange-500",
						)}
					>
						Scheduled
					</TabsTrigger>
				</TabsList>

				<TabsContent value="scheduled">
					{renderMeetingCards(filteredScheduledMeetings)}
				</TabsContent>

				<TabsContent value="unscheduled">
					{renderMeetingCards(filteredUnscheduledMeetings)}
				</TabsContent>
			</Tabs>
		</div>
	);
};
