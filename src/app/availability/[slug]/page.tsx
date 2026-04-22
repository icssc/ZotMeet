import { notFound } from "next/navigation";
import { Availability } from "@/components/availability/availability";
import { getCurrentSession } from "@/lib/auth";
import {
	OPEN_INVITE_AFTER_CREATE_PARAM,
	OPEN_INVITE_AFTER_CREATE_VALUE,
} from "@/lib/meeting-open-invite";
import {
	getAllMemberAvailability,
	getExistingMeeting,
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

	const allAvailabilities = await getAllMemberAvailability({
		meetingId: meetingData.id,
	});

	const scheduledBlocks = await getScheduledTimeBlocks(meetingData.id);
	const session = await getCurrentSession();
	const rawSearch = await props.searchParams;
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
				autoOpenInviteDialog={autoOpenInviteDialog}
				inviteQueryInUrl={inviteQueryInUrl}
			/>
		</div>
	);
}
