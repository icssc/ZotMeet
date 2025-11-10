import { notFound } from "next/navigation";
import { AvailabilityBody } from "@/components/availability/availability-body";
import { getCurrentSession } from "@/lib/auth";
import {
    getAllMemberAvailability,
    getExistingMeeting,
} from "@/server/data/meeting/queries";

interface PageProps {
    params: {
        slug: string;
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

    const allAvailabilities = await getAllMemberAvailability({
        meetingId: meetingData.id,
    });

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
        <div className="space-y-2 px-4">
            <AvailabilityBody
                meetingData={meetingData}
                userAvailability={userAvailability}
                allAvailabilities={allAvailabilities}
                user={session.user}
            />
        </div>
    );
}
