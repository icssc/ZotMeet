import { redirect } from "next/navigation";
import { AvailabilityHeader } from "@/components/availability/availability-header";
import { PersonalAvailability } from "@/components/availability/personal-availability";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/custom/tabs";
import { getExistingMeeting } from "@/lib/db/databaseUtils";
import { getAvailability, getMeetingDates } from "@/lib/db/utils";
import { cn } from "@/lib/utils";

interface PageProps {
    params: {
        slug: string;
    };
}

export default async function Page({ params }: PageProps) {
    const { slug } = params;
    const user = { id: "123" }; // TODO (#auth): replace with actual user from session

    if (!slug) {
        redirect("/error");
    }

    const meetingData = await getExistingMeeting(slug);
    if (!meetingData) {
        redirect("/error");
    }

    const meetingDates = await getMeetingDates(slug);
    const availability = user ? await getAvailability(user, slug) : null;

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
                    />
                </TabsContent>
                <TabsContent value="group">Group Availability</TabsContent>
            </Tabs>
        </div>
    );
}
