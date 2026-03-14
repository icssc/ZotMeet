"use client";

import { Add } from "@mui/icons-material";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import SearchIcon from "@mui/icons-material/Search";
import { IconButton, Input } from "@mui/material";
import Link from "next/link";
import { useState } from "react";
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "@/components/custom/tabs";
import MeetingCard from "@/components/ui/meeting-card";
import type { SelectMeeting } from "@/db/schema";
import {
	filterMeetingsByQuery,
	toMeetingCardProps,
} from "@/lib/meeting-card/mapper";
import { cn } from "@/lib/utils";

interface MeetingsDisplayProps {
	meetings: (SelectMeeting & { hostDisplayName: string | null })[];
	userId: string;
	meetingCounts: Record<string, number>;
}

export const Meetings = ({
	meetings,
	userId,
	meetingCounts,
}: MeetingsDisplayProps) => {
	const [hostFilter, setHostFilter] = useState<"all" | "hosted">("all");
	const [searchQuery, setSearchQuery] = useState("");
	const hostedOnly = hostFilter === "hosted";

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

	const hasActiveQuery = !!searchQuery.trim();
	const searchedScheduledMeetings = filterMeetingsByQuery(
		filteredScheduledMeetings,
		searchQuery,
	);
	const searchedUnscheduledMeetings = filterMeetingsByQuery(
		filteredUnscheduledMeetings,
		searchQuery,
	);

	const allCount = meetings.length;
	const hostedCount = meetings.filter((m) => m.hostId === userId).length;

	const renderMeetingCards = (
		displayMeetings: SelectMeeting[],
		isFiltered: boolean,
	) => {
		if (displayMeetings.length === 0) {
			return (
				<div className="flex items-center gap-4 rounded-xl border-2 border-gray-200 bg-[#F9FAFB] bg-opacity-50 p-6 pr-8">
					<h3 className="truncate font-dm-sans font-medium text-gray-800 text-xl">
						{isFiltered
							? "No meetings match your search."
							: "You have no meetings yet."}
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
			<div className="flex flex-col justify-between">
				<div className="mb-5 flex items-center lg:hidden">
					<h1 className="block w-full font-montserrat font-semibold text-4xl lg:hidden">
						Meetings
					</h1>

					<IconButton
						component={Link}
						href="/"
						sx={{ color: "white" }}
						className="!bg-[#F26489] ml-auto h-14 w-14 rounded-full"
					>
						<Add fontSize="large" />
					</IconButton>
				</div>

				<div className="flex w-full items-center gap-3">
					<div className="group relative w-full max-w-2xl">
						<SearchIcon className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-gray-400 transition-opacity group-focus-within:opacity-0" />

						<Input
							disableUnderline
							placeholder="Search Meetings"
							className="w-full rounded-3xl border-2 border-gray-300 p-3 pl-11 transition-all group-focus-within:pl-3"
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
						/>
					</div>

					<FilterAltIcon
						className="rounded-2xl border-2 border-gray-300 p-2"
						sx={{ fontSize: 38 }}
					/>
				</div>
			</div>

			<Tabs defaultValue="unscheduled">
				<div className="flex">
					<div className="mt-4 flex items-center gap-3">
						{(["all", "hosted"] as const).map((filter) => {
							const count = filter === "all" ? allCount : hostedCount;
							const label = filter === "all" ? "All" : "By You";
							return (
								<button
									key={filter}
									type="button"
									onClick={() => setHostFilter(filter)}
									className={cn(
										"rounded-xl p-2 px-4 text-blue-950 transition-colors",
										hostFilter === filter
											? "bg-blue-950 text-white"
											: "hover:bg-blue-50",
									)}
								>
									{label} ({count})
								</button>
							);
						})}
					</div>

					<TabsList className="mb-8 ml-auto space-x-0">
						<TabsTrigger
							value="unscheduled"
							className={cn(
								"border-0 border-neutral-300 border-b-2 p-4 pb-0 font-montserrat text-lg duration-0",
								"data-[state=active]:border-blue-950",
							)}
						>
							Unscheduled
						</TabsTrigger>
						<TabsTrigger
							value="scheduled"
							className={cn(
								"border-0 border-neutral-300 border-b-2 p-4 pb-0 font-montserrat text-lg duration-0",
								"data-[state=active]:border-blue-950",
							)}
						>
							Scheduled
						</TabsTrigger>
					</TabsList>
				</div>

				<TabsContent value="scheduled">
					{renderMeetingCards(searchedScheduledMeetings, hasActiveQuery)}
				</TabsContent>

				<TabsContent value="unscheduled">
					{renderMeetingCards(searchedUnscheduledMeetings, hasActiveQuery)}
				</TabsContent>
			</Tabs>
		</div>
	);
};
