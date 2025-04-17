import { GroupsDisplay } from '@/components/summary/GroupsDisplay';
import { MeetingsDisplay } from '@/components/summary/MeetingsDisplay';
import { getCurrentSession } from "@/lib/auth";
import { getMeetingsByUserId } from "@/server/data/meeting/queries";
import { SelectMeeting } from '@/db/schema';

const Summary = async () => {
  let meetings: SelectMeeting[] = [];
  let error: string | null = null;
  let userId: string | null = null;

  try {
    const session = await getCurrentSession();
    if (!session?.user) {
      error = "You must be logged in to view your meetings.";
    } else {
      userId = session.user.memberId;
      meetings = await getMeetingsByUserId(userId);
    }
  } catch (err) {
    error = "Failed to fetch meetings on the server.";
    console.error("Error fetching meetings:", err);
  }

  if (error) {
    return (
      <div className='px-8 py-8 text-center text-red-500'>
        <h1 className='text-2xl font-montserrat font-medium'>Error</h1>
        <p>{error}</p>
        <p>Could not load meeting data. Please try again later.</p>
      </div>
    );
  }

  if (!userId) {
    return <p>User ID not found.</p>;
  }

  return (
    <div className='px-8 py-8'>
      <div className='flex flex-col gap-4 px-8 mb-4'>
        <h1 className='text-3xl font-montserrat font-medium'>Groups</h1>
        <GroupsDisplay />
      </div>
      <MeetingsDisplay
        meetings={meetings}
        userId={userId}
      />
    </div>
  );
};

export default Summary;