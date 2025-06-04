import { notFound } from "next/navigation";
import { AvailabilityBody } from "@/components/availability/availability-body";
import { getCurrentSession } from "@/lib/auth";
import {
    getAllMemberAvailability,
    getExistingMeeting,
    getExistingMeetingDates,
} from "@/server/data/meeting/queries";

interface PageProps {
    params: {
        slug: string;
    };
}

export async function generateMetadata({ params }: PageProps) {
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

export default async function Page({ params }: PageProps) {
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

    const meetingDates = await getExistingMeetingDates(meetingData.id);
    const allAvailabilties = await getAllMemberAvailability({
        meetingId: meetingData.id,
    });

    const session = await getCurrentSession();
    let userAvailability = null;

    if (session.user !== null) {
        const userId = session.user.memberId;
        for (const availability of allAvailabilties) {
            if (availability.memberId === userId) {
                userAvailability = availability;
                break;
            }
        }
    }

    return (
        <div className="space-y-2 px-4">
            <AvailabilityBody
                meetingData={meetingData}
                meetingDates={meetingDates}
                userAvailability={userAvailability}
                allAvailabilties={allAvailabilties}
                user={session.user}
            />
        </div>
    );
}
