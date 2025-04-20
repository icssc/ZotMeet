import { notFound, redirect } from "next/navigation";
// import { GroupsDisplay } from "@/components/summary/GroupsDisplay";
import { Meetings } from "@/components/summary/meetings";
import { getCurrentSession } from "@/lib/auth";
import { getMeetings } from "@/server/data/meeting/queries";

export default async function Page() {
    const session = await getCurrentSession();
    if (!session?.user) {
        redirect("/");
    }

    const memberId = session.user.memberId;
    if (!memberId) {
        notFound();
    }

    const meetings = await getMeetings(memberId);

    return (
        <div className="px-8 py-8">
            {/* <div className="mb-4 flex flex-col gap-4 px-8">
                <h1 className="font-montserrat text-3xl font-medium">Groups</h1>
                <GroupsDisplay />
            </div> */}

            <Meetings
                meetings={meetings}
                userId={memberId}
            />
        </div>
    );
}
