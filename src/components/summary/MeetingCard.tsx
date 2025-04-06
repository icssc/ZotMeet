'use client'

import React, { useState } from 'react'
import { Clock, MapPin, Users, Monitor } from 'lucide-react'
import MeetingCardDropdown from './MeetingCardDropdown'

type StatusType = 'ACCEPT' | 'MAYBE' | 'DECLINE' | 'NOT INDICATED'

type MeetingCardProps = {
  title: string
  time: string
  location: string
  status?: StatusType
  type?: 'users' | 'presentation'

}

const MeetingCard = ({ title, time, location, status: initialStatus, type}: MeetingCardProps) => {
  const [status, setStatus] = useState<StatusType>(initialStatus ?? 'NOT INDICATED')
  
  const handleStatusChange = (newStatus: StatusType) => {
    setStatus(newStatus)
  }

  return (
    <div className="bg-[#F9FAFB] bg-opacity-50 rounded-xl border-2 border-gray-200 p-5 flex items-center gap-4 mb-4">
      <div className="h-12 w-12 rounded-full border border-gray-200 flex items-center justify-center text-gray-500">
        {type === 'users' ? <Users size={20} /> : <Monitor size={20} />}
      </div>

      <div className="flex-grow">
        <h3 className="font-medium font-dm-sans text-xl text-gray-800">{title}</h3>
        <div className="flex items-center font-dm-sans font-semibold text-xs text-gray-500 text-sm mt-1">
          <Clock size={14} className="mr-1" />
          <span className="mr-4">{time}</span>
          <MapPin size={14} className="mr-1" />
          <span>{location}</span>
        </div>
      </div>

      <MeetingCardDropdown status={status} onStatusChange={handleStatusChange} />
    </div>
  )
}

export default MeetingCard