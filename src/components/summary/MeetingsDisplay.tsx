import React from 'react'
import MeetingCard from './MeetingCard'

const MeetingsDisplay = () => {
  return (
    <div className="w-full rounded-xl bg-gradient-to-r from-[#EAEFF2] to-[#EEEEEE] p-6 border border-gray-200">
        <h1 className='text-3xl font-montserrat font-medium'>Meetings</h1>
        <MeetingCard title="Meeting Two" time="8:00 AM - 9:30 PM" location="CSL 8" type="users" status="ACCEPTED" />
        <MeetingCard title="Antalmanac" time="4:00 PM - 5:15 PM" location="CSL 8" type="users" status="MAYBE" />
        <MeetingCard title="Interview Prep" time="8:00 AM - 9:30 PM" location="ZOOM LINK" type="users" status="DECLINED" />
    </div>
  )
}

export default MeetingsDisplay