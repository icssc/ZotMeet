import { notFound } from "next/navigation";
import { Availability } from "@/components/availability/availability";
import { getCurrentSession } from "@/lib/auth";
import {
	OPEN_INVITE_AFTER_CREATE_PARAM,
	OPEN_INVITE_AFTER_CREATE_VALUE,
} from "@/lib/meeting-open-invite";
import { loadMergedScheduledInterval } from "@/server/actions/availability/google/calendar/action";
import {
	getAllMemberAvailability,
	getExistingMeeting,
	getMeetingGoogleCalendarSnapshot,
	getScheduledTimeBlocks,
} from "@/server/data/meeting/queries";

interface PageProps {
	params: Promise<{
		slug: string;
	}>;
	searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export async function generateMetadata(props: PageProps) {
	const params = await props.params;
	const { slug } = params;

	const meetingData = await getExistingMeeting(slug).catch((e) => {
		if (e instanceof Error) {
			console.error(e);
		}

		notFound();
	});

	if (!meetingData) {
		notFound();
	}

	return {
		title: {
			default: "View Meeting Availability",
			absolute: `Availability for ${meetingData.title}`,
		},
		description: `Specify Meeting Availability for ${meetingData.title}`,
	};
}

export default async function Page(props: PageProps) {
	const params = await props.params;
	const { slug } = params;

	if (!slug) {
		notFound();
	}

	const meetingData = await getExistingMeeting(slug).catch((e) => {
		if (e instanceof Error) {
			console.error(e);
		}
		notFound();
	});

	if (!meetingData) {
		notFound();
	}

	const session = await getCurrentSession();

	const [
		allAvailabilities,
		scheduledBlocks,
		mergedScheduledInterval,
		googleCalendarLinkSnapshot,
		rawSearch,
	] = await Promise.all([
		getAllMemberAvailability({ meetingId: meetingData.id }),
		getScheduledTimeBlocks(meetingData.id),
		loadMergedScheduledInterval(meetingData.id),
		session.user
			? getMeetingGoogleCalendarSnapshot(meetingData.id, session.user.memberId)
			: Promise.resolve(null),
		props.searchParams,
	]);

	const openInviteRaw = rawSearch[OPEN_INVITE_AFTER_CREATE_PARAM];
	const openInviteFlag = Array.isArray(openInviteRaw)
		? openInviteRaw[0]
		: openInviteRaw;
	const inviteQueryInUrl = openInviteFlag === OPEN_INVITE_AFTER_CREATE_VALUE;
	const autoOpenInviteDialog =
		inviteQueryInUrl &&
		!!session.user &&
		session.user.memberId === meetingData.hostId;

	return (
		<div className="space-y-2 px-4 pb-20">
			<Availability
				meetingData={meetingData}
				allAvailabilities={allAvailabilities}
				user={session.user}
				scheduledBlocks={scheduledBlocks}
				mergedScheduledInterval={mergedScheduledInterval}
				googleCalendarLinkSnapshot={googleCalendarLinkSnapshot}
				autoOpenInviteDialog={autoOpenInviteDialog}
				inviteQueryInUrl={inviteQueryInUrl}
			/>
		</div>
	);
}
