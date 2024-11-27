import { redirect } from "next/navigation";
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
import { getExistingMeeting } from "@/lib/db/databaseUtils";
import { getAvailability, getMeetingDates } from "@/lib/db/utils";
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
        redirect("/error");
    }

    const meetingData = await getExistingMeeting(slug);

    if (!meetingData) {
        redirect("/error");
    }

    const meetingDates = await getMeetingDates(slug);
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

            <Tabs
                defaultValue="personal"
                className={"space-y-6 px-6"}
            >
                <TabsList className="mx-6 space-x-0">
                    <TabsTrigger
                        value="personal"
                        className={cn(
                            "border-0 border-b-2 border-neutral-500 p-4 pb-0 text-lg duration-0",
                            "data-[state=active]:border-orange-500"
                        )}
                    >
                        Personal
                    </TabsTrigger>
                    <TabsTrigger
                        value="group"
                        className={cn(
                            "border-0 border-b-2 border-neutral-500 p-4 pb-0 text-lg duration-0",
                            "data-[state=active]:border-orange-500"
                        )}
                    >
                        Group
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="personal">
                    <PersonalAvailability
                        columns={5}
                        meetingData={meetingData}
                        meetingDates={meetingDates}
                        availability={availability}
                        availabilityTimeBlocks={availabilityTimeBlocks}
                    />
                </TabsContent>
                <TabsContent value="group">
                    <GroupAvailability
                        columns={5}
                        availabilityDates={[]}
                        availabilityTimeBlocks={availabilityTimeBlocks}
                        groupAvailabilities={SAMPLE_MEMBERS}
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
