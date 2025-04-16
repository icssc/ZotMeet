'use client'

import React from 'react'
import { MeetingCard } from './MeetingCard'
import { SelectMeeting } from '@/db/schema'
import Link from 'next/link'

interface UnscheduledMeetingsDisplayProps {
  meetings: SelectMeeting[];
}

export const UnscheduledMeetingsDisplay = ({ meetings }: UnscheduledMeetingsDisplayProps) => {
  if (meetings.length === 0) {
    return <div className="p-4">No unscheduled meetings found.</div>
  }

  return (
    <div className='flex flex-col gap-2'>
      {meetings.map(meeting => (
        <Link href={`/availability/${meeting.id}`} key={meeting.id}>
          <MeetingCard 
            title={meeting.title}
            time={`${meeting.fromTime} - ${meeting.toTime}`}
            location={meeting.location || "Not specified"} 
            type="users" 
            status="NOT INDICATED"
          />
        </Link>
      ))}
    </div>
  ) 
}
