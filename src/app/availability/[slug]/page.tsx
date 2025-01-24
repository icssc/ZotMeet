import { notFound } from "next/navigation";
import { AvailabilityHeader } from "@/components/availability/availability-header";
import { GroupAvailability } from "@/components/availability/group-availability";
import { PersonalAvailability } from "@/components/availability/personal-availability";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/custom/tabs";
import {
    getTimeFromHourMinuteString,
    SAMPLE_MEMBERS,
} from "@/lib/availability/utils";
import {
    getAvailability,
    getExistingMeeting,
    getExistingMeetingDates,
} from "@/lib/db/databaseUtils";
import { HourMinuteString } from "@/lib/types/chrono";
import { cn } from "@/lib/utils";

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

    const meetingDates = await getExistingMeetingDates(slug);
    // const availability = user ? await getAvailability(user, slug) : [];
    const availability = await getAvailability({
        userId: "123", // TODO (#auth): replace with actual user from session
        meetingId: meetingData.id,
    });

    const availabilityTimeBlocks = generateTimeBlocks(
        getTimeFromHourMinuteString(meetingData.from_time as HourMinuteString),
        getTimeFromHourMinuteString(meetingData.to_time as HourMinuteString)
    );

    return (
        <div className="space-y-2 px-4">
            <AvailabilityHeader meetingData={meetingData} />

            <div className={"space-y-6 px-6"}>
                <GroupAvailability
                    columns={5}
                    availabilityDates={[]}
                    availabilityTimeBlocks={availabilityTimeBlocks}
                    groupAvailabilities={SAMPLE_MEMBERS}
                />
                <PersonalAvailability
                    columns={5}
                    meetingData={meetingData}
                    meetingDates={meetingDates}
                    availability={availability}
                    availabilityTimeBlocks={availabilityTimeBlocks}
                />
            </div>
        </div>
    );
}

const BLOCK_LENGTH: number = 15;

const generateTimeBlocks = (startTime: number, endTime: number): number[] => {
    const timeBlocks: number[] = [];
    const minuteRange = Math.abs(endTime - startTime);
    const totalBlocks = Math.floor(minuteRange / BLOCK_LENGTH);

    for (let blockIndex = 0; blockIndex < totalBlocks; blockIndex++) {
        timeBlocks.push(startTime + blockIndex * BLOCK_LENGTH);
    }
    return timeBlocks;
};
