import { Add } from "@mui/icons-material";
import { Button } from "@mui/material";
import { notFound, redirect } from "next/navigation";
// import { GroupsDisplay } from "@/components/summary/GroupsDisplay";
import { Meetings } from "@/components/summary/meetings";
import { getCurrentSession } from "@/lib/auth";
import {
	getMeetings,
	getScheduledTimeBlocks,
} from "@/server/data/meeting/queries";

export default async function Page() {
	const session = await getCurrentSession();
	if (!session?.user) {
		redirect("/");
	}

	const memberId = session.user.memberId;
	if (!memberId) {
		notFound();
	}

	const meetings = await getMeetings(memberId);
	// Fetch scheduled time blocks for each meeting
	const scheduledTimeBlocksByMeetingId = Object.fromEntries(
		await Promise.all(
			meetings.map(async (meeting) => {
				const blocks = meeting.scheduled
					? await getScheduledTimeBlocks(meeting.id)
					: [];
				return [meeting.id, blocks] as const;
			}),
		),
	);

	return (
		<div className="px-8 py-8">
			<div className="mb-4 flex justify-end">
				<Button href="/">
					<div className="flex justify-center text-black">
						<Add fontSize="small" />
						Create Meeting
					</div>
				</Button>
			</div>

			<Meetings
				meetings={meetings}
				userId={memberId}
				scheduledTimeBlocksByMeetingId={scheduledTimeBlocksByMeetingId}
			/>
		</div>
	);
}
