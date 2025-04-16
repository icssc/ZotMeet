import { MeetingCard } from '@/components/summary/MeetingCard'
import { SelectMeeting } from '@/db/schema'

interface ScheduledMeetingsDisplayProps {
  meetings: SelectMeeting[];
}

export const ScheduledMeetingsDisplay = ({ meetings }: ScheduledMeetingsDisplayProps) => {
  if (meetings.length === 0) {
    return <div className="p-4">No scheduled meetings found.</div>
  }

  return (
    <div className='flex flex-col gap-2'>
      {meetings.map(meeting => (
        <MeetingCard 
          key={meeting.id}
          title={meeting.title}
          time={`${meeting.fromTime} - ${meeting.toTime}`}
          location={meeting.location || "Not specified"} 
          type="users" 
          status="NOT INDICATED"
        />
      ))}
    </div>
  )
}
