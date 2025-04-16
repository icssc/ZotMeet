'use client'

import React, { useState } from 'react'
import { Clock, MapPin, Users, Monitor } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type StatusType = 'ACCEPT' | 'MAYBE' | 'DECLINE' | 'NOT INDICATED'

type MeetingCardProps = {
  title: string
  time: string
  location: string
  status?: StatusType
  type?: 'users' | 'presentation'

}

export const MeetingCard = ({ title, time, location, status: initialStatus, type}: MeetingCardProps) => {
  const [status, setStatus] = useState<StatusType>(initialStatus ?? 'NOT INDICATED')
  
  const handleStatusChange = (newStatus: StatusType) => {
    setStatus(newStatus)
  }

  const statusColors = {
    ACCEPT: 'bg-green-500',
    MAYBE: 'bg-yellow-500',
    DECLINE: 'bg-red-500',
    'NOT INDICATED': 'bg-gray-400',
  }

  const statusDisplay = {
    ACCEPT: 'ACCEPTED',
    MAYBE: 'MAYBE',
    DECLINE: 'DECLINED',
    'NOT INDICATED': 'NOT INDICATED',
  }

  const statusOptions: StatusType[] = ['ACCEPT', 'MAYBE', 'DECLINE'];

  return (
    <div className="bg-[#F9FAFB] bg-opacity-50 rounded-xl border-2 border-gray-200 p-6 flex items-center gap-4 pr-8">
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

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className={`flex items-center gap-2 border-2 border-gray-200 rounded-lg px-4 py-1 ${status === 'NOT INDICATED' ? 'w-auto' : 'w-28'} justify-center`}
          >
            <div className={`w-2 h-2 rounded-full ${statusColors[status as keyof typeof statusColors]}`}></div>
            <p className="text-xs text-gray-500 font-dm-sans font-semibold">{statusDisplay[status as keyof typeof statusDisplay]}</p>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className={`${status === 'NOT INDICATED' ? 'w-36' : 'w-28' } bg-gray-200 rounded-lg`}>
          {statusOptions.map((option) => (
            <DropdownMenuItem
              key={option}
              className={`pl-2 pr-2 ${status === option ? 'bg-accent' : ''}`}
              onClick={() => handleStatusChange(option)}
            >
              <div className="flex items-center gap-2">
                <div className={`h-2 w-2 rounded-full ${statusColors[option as Exclude<StatusType, 'NOT INDICATED'>]}`}></div>
                <span className="text-xs text-gray-500 font-dm-sans font-semibold">{option}</span>
              </div>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
