'use client'

import React, { useState } from 'react'

type StatusType = 'ACCEPT' | 'MAYBE' | 'DECLINE' | 'NOT INDICATED'

interface MeetingCardDropdownProps {
  status: StatusType;
  onStatusChange?: (newStatus: StatusType) => void;
}

const MeetingCardDropdown = ({ status, onStatusChange }: MeetingCardDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const statusOptions: StatusType[] = ['ACCEPT', 'MAYBE', 'DECLINE'];
  
  const statusColors = {
    'ACCEPT': 'bg-green-500',
    'MAYBE': 'bg-yellow-500',
    'DECLINE': 'bg-red-500',
    'NOT INDICATED': 'bg-gray-400',
  }

  const statusDisplay = {
    'ACCEPT': 'ACCEPTED',
    'MAYBE': 'MAYBE',
    'DECLINE': 'DECLINED',
    'NOT INDICATED': 'NOT INDICATED',
  }

  const handleSelect = (option: StatusType) => {
    onStatusChange?.(option);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button 
        type="button"
        className={`flex items-center gap-2 border-2 border-gray-200 rounded-lg px-4 py-1 ${status === 'NOT INDICATED' ? 'w-full' : 'w-28'} justify-center`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className={`w-2 h-2 rounded-full ${statusColors[status as keyof typeof statusColors]}`}></div>
        <p className="text-xs text-gray-500 font-dm-sans font-semibold">{statusDisplay[status as keyof typeof statusDisplay]}</p>
      </button>

      {isOpen && (
        <div className="absolute z-10 w-28 mt-1 bg-gray-200 border border-gray-200 rounded-lg shadow-lg">
          {statusOptions.map((option) => (
            <div 
              key={option}
              className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 hover:rounded-lg m-1 cursor-pointer"
              onClick={() => handleSelect(option)}
            >
              <div className={`w-2 h-2 rounded-full ${statusColors[option as keyof typeof statusColors]}`}></div>
              <p className='text-xs font-semibold text-gray-500 font-dm-sans'>
                {option}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default MeetingCardDropdown