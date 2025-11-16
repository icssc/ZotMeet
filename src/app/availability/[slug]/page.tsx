import { notFound } from "next/navigation";
import { Availability } from "@/components/availability/availability";
import { getCurrentSession } from "@/lib/auth";
import { getStudyRooms } from "@/lib/studyrooms/getrooms";
import {
    getAllMemberAvailability,
    getExistingMeeting,
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

    const queryDates = meetingData.dates
        .map((date) => date.toString())
        .join(",");
    const queryTimes =
        meetingData.fromTime.slice(0, -3) +
        "-" +
        meetingData.toTime.slice(0, -3);
    // Fetches study room data based on the current meeting's dates and times
    const studyRooms = await getStudyRooms(queryDates, queryTimes);

    // if (studyRooms.data.length === 0) {
    //     console.log("No study rooms found in range");
    // }
    // else {
    //     //prints all time slots of the first study room result, for reference that the query is correct
    //     console.log("Study Rooms Placeholder: ", studyRooms.data); // commented out for now
    // }
    return (
        <div className="space-y-2 px-4">
            <Availability
                meetingData={meetingData}
                userAvailability={userAvailability}
                allAvailabilities={allAvailabilities}
                user={session.user}
            />
        </div>
    );
}
