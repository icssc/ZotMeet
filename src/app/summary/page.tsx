import { notFound, redirect } from "next/navigation";
import { Meetings } from "@/components/summary/meetings";
import { getCurrentSession } from "@/lib/auth";
import {
	getMeetings,
	getResponderCountsByMeetingIds,
} from "@/server/data/meeting/queries";

export default async function Page() {
	const session = await getCurrentSession();
	if (!session?.user) {
		redirect("/auth/login/google");
	}

	const memberId = session.user.memberId;
	if (!memberId) {
		notFound();
	}

	const meetings = await getMeetings(memberId);
	const meetingIds = meetings.map((m) => m.id);
	const meetingCounts = await getResponderCountsByMeetingIds(meetingIds);

	return (
		<div className="px-4 py-8 sm:px-8">
			<Meetings
				meetings={meetings}
				userId={memberId}
				meetingCounts={meetingCounts}
			/>
		</div>
	);
}
