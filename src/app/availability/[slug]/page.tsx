import { notFound, redirect } from "next/navigation";
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
    getAllMemberAvailability
} from "@/server/data/meeting/queries";
import { HourMinuteString } from "@/lib/types/chrono";
import { cn } from "@/lib/utils";
import { getCurrentSession } from "@/lib/auth";

interface PageProps {
    params: {
        slug: string;
    };
}

export async function generateMetadata({ params }: PageProps) {
    const { slug } = params;

    const meetingData = await getExistingMeeting(slug).catch((e) => { // get all meeting information from ID
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
            default: 'View Meeting Availibility',
            absolute: `Availability for ${meetingData.title}`, // add meeting title
        },
        description: `Specify Meeting Availibility for ${meetingData.title}`,
        icon: '../../favicon.ico'
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
    // const availability = user ? await getAvailability(user, slug) : [];
    const availability = await getAvailability({
        userId: (await getCurrentSession()).user?.memberId, 
        meetingId: meetingData.id,
        
    });
    console.log(`Current user Availability/${slug}:`, availability);

    const allAvailabilties = await getAllMemberAvailability({
        meetingId: meetingData.id,
    });
    console.log(`All member Availability/${slug}:`, allAvailabilties);

    const availabilityTimeBlocks = generateTimeBlocks(
        getTimeFromHourMinuteString(meetingData.fromTime as HourMinuteString),
        getTimeFromHourMinuteString(meetingData.toTime as HourMinuteString)
    );

    return (
        <div className="space-y-2 px-4">
            <AvailabilityHeader meetingData={meetingData} />

            <Tabs
                defaultValue="group"
                className={"space-y-6 px-6"}
            >
                <TabsList className="mx-6 space-x-0">
                    <TabsTrigger
                        value="group"
                        className={cn(
                            "border-0 border-b-2 border-neutral-500 p-4 pb-0 text-lg duration-0",
                            "data-[state=active]:border-orange-500"
                        )}
                    >
                        Group
                    </TabsTrigger>
                    <TabsTrigger
                        value="personal"
                        className={cn(
                            "border-0 border-b-2 border-neutral-500 p-4 pb-0 text-lg duration-0",
                            "data-[state=active]:border-orange-500"
                        )}
                    >
                        Personal
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="group">
                    <GroupAvailability
                        columns={5}
                        availabilityDates={[]}
                        availabilityTimeBlocks={availabilityTimeBlocks}
                        groupAvailabilities={SAMPLE_MEMBERS}
                    />
                </TabsContent>
                <TabsContent value="personal">
                    <PersonalAvailability
                        columns={5}
                        meetingData={meetingData}
                        meetingDates={meetingDates}
                        availability={availability}
                        availabilityTimeBlocks={availabilityTimeBlocks}
                    />
                </TabsContent>
            </Tabs>
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
