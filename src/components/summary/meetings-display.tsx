import Link from "next/link";
import { MeetingCard } from "@/components/summary/meeting-card";
import { ScheduledMeetingCard } from "@/components/summary/scheduled-meeting-card";
import type { SelectMeeting, SelectScheduledMeeting } from "@/db/schema";

interface MeetingsDisplayProps {
	meetings: SelectMeeting[];
	scheduledTimeBlocks?: Record<string, SelectScheduledMeeting[]>;
}

export const MeetingsDisplay = ({
	meetings,
	scheduledTimeBlocks,
}: MeetingsDisplayProps) => {
	if (meetings.length === 0) {
		return (
			<div className="flex items-center gap-4 rounded-xl border-2 border-gray-200 bg-[#F9FAFB] bg-opacity-50 p-6 pr-8">
				<h3 className="truncate font-dm-sans font-medium text-gray-800 text-xl">
					No meetings found.
				</h3>
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-2">
			{meetings.map((meeting) => {
				// use ScheduledMeetingCard for scheduled meetings
				if (meeting.scheduled) {
					return (
						<ScheduledMeetingCard
							key={meeting.id}
							meeting={meeting}
							scheduledTimeBlocks={scheduledTimeBlocks?.[meeting.id] || []}
						/>
					);
				}

				return (
					<Link href={`/availability/${meeting.id}`} key={meeting.id}>
						<MeetingCard meeting={meeting} />
					</Link>
				);
			})}
		</div>
	);
};
