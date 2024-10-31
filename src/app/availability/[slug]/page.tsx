import { redirect } from "next/navigation";
import { AvailabilityHeader } from "@/app/components/availability/availability-header";
import { PersonalAvailability } from "@/app/components/availability/personal-availability";
import { getExistingMeeting } from "@/lib/db/databaseUtils";
import { getAvailability, getMeetingDates } from "@/lib/db/utils";

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
    // if (!meetingData) {
    //     redirect("/error");
    // }

    const meetingDates = await getMeetingDates(slug);
    const availability = user ? await getAvailability(user, slug) : null;

    return (
        <div>
            <AvailabilityHeader meetingData={meetingData} />

            <PersonalAvailability
                columns={5}
                meetingData={meetingData}
                meetingDates={meetingDates}
                availability={availability}
            />
        </div>
    );
}
