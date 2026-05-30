import { notFound } from "next/navigation";
import { Availability } from "@/components/availability/availability";
import { getCurrentSession } from "@/lib/auth";
import {
	formatDateToUSNumeric,
	sortMeetingIsoDatesAsc,
} from "@/lib/availability/utils";
import {
	OPEN_INVITE_AFTER_CREATE_PARAM,
	OPEN_INVITE_AFTER_CREATE_VALUE,
} from "@/lib/meeting-open-invite";
import { getMeetingHostDisplayName } from "@/lib/meetings/utils";
import { APP_DESCRIPTION } from "@/lib/pwa-config.mjs";
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

	const hostName = getMeetingHostDisplayName(meetingData.hostId);

	return {
		title: {
			default: "View Meeting Availability",
			absolute: `Availability for ${meetingData.title}`,
		},
		openGraph: {
			title: `${hostName} is requesting your availability for ${meetingData.title}`,
			description: APP_DESCRIPTION,
			url: `/availability/${slug}`,
			type: "website",
			siteName: "ZotMeet",
			images: [
				{ url: "/icons/icon-512.png", width: 512, height: 512, alt: "ZotMeet" },
			],
		},
		twitter: {
			card: "summary",
			title: `${hostName} is requesting your availability for ${meetingData.title}`,
			description: APP_DESCRIPTION,
			images: ["/icons/icon-512.png"],
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
