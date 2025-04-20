import { notFound } from "next/navigation";
import { AvailabilityBody } from "@/components/availability/availability-body";
import { AvailabilityHeader } from "@/components/availability/availability-header";
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
            absolute: `Availability for ${meetingData.title}`, // add meeting title
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
        console.log(`Current user Availability/${slug}:`, userAvailability);
    } else {
        console.log("No user logged in");
    }

    console.log(`All member Availability/${slug}:`, allAvailabilties);

    return (
        <div className="space-y-2 px-4">
            <AvailabilityHeader
                meetingData={meetingData}
                user={session.user}
            />

            <AvailabilityBody
                meetingData={meetingData}
                meetingDates={meetingDates}
                userAvailability={userAvailability}
                allAvailabilties={allAvailabilties}
            />
        </div>
    );
}
