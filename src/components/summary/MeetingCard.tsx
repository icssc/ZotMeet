import React from 'react'
import { Clock, MapPin, Users, Monitor } from 'lucide-react'
import MeetingCardDropdown from './MeetingCardDropdown'

type MeetingCardProps = {
  title: string
  time: string
  location: string
  status?: 'ACCEPTED' | 'MAYBE' | 'DECLINED' | 'NOT INDICATED'
  type?: 'users' | 'presentation'
}

const MeetingCard = ({ title, time, location, status, type }: MeetingCardProps) => {

  return (
    <div className="bg-[#F9FAFB] bg-opacity-50 rounded-xl border border-gray-200 p-5 flex items-center gap-4 mb-4">
      <div className="h-12 w-12 rounded-full border border-gray-200 flex items-center justify-center text-gray-500">
        {type === 'users' ? <Users size={20} /> : <Monitor size={20} />}
      </div>

      <div className="flex-grow">
        <h3 className="font-medium font-dm-sans text-xl text-gray-800">{title}</h3>
        <div className="flex items-center font-dm-sans font-semibold text-xs text-gray-500 text-sm mt-1">
          <Clock size={16} className="mr-1" />
          <span className="mr-4">{time}</span>
          <MapPin size={16} className="mr-1" />
          <span>{location}</span>
        </div>
      </div>

      <MeetingCardDropdown />
    </div>
  )
}

export default MeetingCard