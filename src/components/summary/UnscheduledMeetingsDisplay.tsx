'use client'

import React from 'react'
import MeetingCard from './MeetingCard'

type Meeting = {
  id: string;
  title: string;
  location: string | null;
  scheduled: boolean | null;
  fromTime: string;
  toTime: string;
  timezone: string;
  dates: string[];
};

interface UnscheduledMeetingsDisplayProps {
  meetings: Meeting[];
}

const UnscheduledMeetingsDisplay = ({ meetings }: UnscheduledMeetingsDisplayProps) => {
  if (meetings.length === 0) {
    return <div className="p-4">No unscheduled meetings found.</div>
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

export default UnscheduledMeetingsDisplay