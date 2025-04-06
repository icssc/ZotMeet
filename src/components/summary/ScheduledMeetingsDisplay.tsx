import React from 'react'
import MeetingCard from './MeetingCard'

const ScheduledMeetingsDisplay = () => {
  return (
    <div className='flex flex-col gap-2'>
        <MeetingCard title="Meeting Two" time="8:00 AM - 9:30 PM" location="CSL 8" type="users" status="NOT INDICATED" />
        <MeetingCard title="Antalmanac" time="4:00 PM - 5:15 PM" location="CSL 8" type="users" status="NOT INDICATED"/>
        <MeetingCard title="Interview Prep" time="8:00 AM - 9:30 PM" location="ZOOM LINK" type="users" status="NOT INDICATED" />
    </div>
  )
}

export default ScheduledMeetingsDisplay