import { notFound } from "next/navigation";
import { Availability } from "@/components/availability/availability";
import { getCurrentSession } from "@/lib/auth";
import {
	getAllMemberAvailability,
	getExistingMeeting,
	getScheduledTimeBlocks,
} from "@/server/data/meeting/queries";

interface PageProps {
	params: Promise<{
		slug: string;
	}>;
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
	let userAvailability = null;

	if (session.user !== null) {
		const userId = session.user.memberId;
		for (const availability of allAvailabilities) {
			if (availability.memberId === userId) {
				userAvailability = availability;
				break;
			}
		}
	}
	return (
		<div className="space-y-2 px-4 pb-20">
			<Availability
				meetingData={meetingData}
				allAvailabilities={allAvailabilities}
				user={session.user}
				scheduledBlocks={scheduledBlocks}
			/>
		</div>
	);
}
