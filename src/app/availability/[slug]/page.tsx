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
import { getCurrentSession } from "@/lib/auth";
import {
    getTimeFromHourMinuteString,
    SAMPLE_MEMBERS,
} from "@/lib/availability/utils";
import { HourMinuteString } from "@/lib/types/chrono";
import { cn } from "@/lib/utils";
import { ZotDate } from "@/lib/zotdate";
import {
    getAllMemberAvailability,
    getAvailability,
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
        // get all meeting information from ID
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
            default: "View Meeting Availibility",
            absolute: `Availability for ${meetingData.title}`, // add meeting title
        },
        description: `Specify Meeting Availibility for ${meetingData.title}`,
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

    console.log("meetng data", meetingData);

    if (!meetingData) {
        notFound();
    }

    const meetingDates = await getExistingMeetingDates(meetingData.id);
    console.log(`Meeting dates ${meetingDates[0]}`);
    const allAvailabilties = await getAllMemberAvailability({
        meetingId: meetingData.id,
    });

    //const availabilityPerDay = allAvailabilties.meetingAvailabilities;

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
        //console.log(`Current user Availability/${slug}:`, userAvailability);
    } else {
        console.log("No user logged in");
    }

    console.log(`All member Availability/${slug}:`, allAvailabilties);
    const availabilityTimeBlocks = generateTimeBlocks(
        getTimeFromHourMinuteString(meetingData.fromTime as HourMinuteString),
        getTimeFromHourMinuteString(meetingData.toTime as HourMinuteString)
    );

    console.log("Availability time blocks:", availabilityTimeBlocks);
    console.log("fromtime", meetingData.fromTime);
    //fromTimeDate={new Date(meetingData.fromTime).toISOString()}

    //const fromTimeDate = new Date(`1970-01-01T${meetingData.fromTime as HourMinuteString}:00Z`).toISOString();

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
                        //groupAvailabilities={SAMPLE_MEMBERS}
                        groupAvailabilities={allAvailabilties}
                        // fromTimeDate={new Date(meetingData.fromTime as HourMinuteString).toISOString()}
                        //fromTimeDate={meetingData.fromTime}
                    />
                </TabsContent>
                <TabsContent value="personal">
                    <PersonalAvailability
                        columns={5}
                        meetingData={meetingData}
                        meetingDates={meetingDates}
                        availability={userAvailability}
                        availabilityTimeBlocks={availabilityTimeBlocks}
                    />
                </TabsContent>
            </Tabs>
        </div>
    );
}

const BLOCK_LENGTH: number = 15;

const generateTimeBlocks = (startTime: number, endTime: number): number[] => {
    console.log("hit", startTime, endTime);
    const timeBlocks: number[] = [];
    const minuteRange = Math.abs(endTime - startTime);
    const totalBlocks = Math.floor(minuteRange / BLOCK_LENGTH);

    for (let blockIndex = 0; blockIndex < totalBlocks; blockIndex++) {
        timeBlocks.push(startTime + blockIndex * BLOCK_LENGTH);
    }
    return timeBlocks;
};
