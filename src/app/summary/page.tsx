import React from 'react'
import GroupsDisplay from '@/components/summary/GroupsDisplay'
import MeetingsDisplay from '@/components/summary/MeetingsDisplay'

const Summary = () => {
  return (
    <div className='px-12 py-8'>
      <div className='flex flex-col gap-4 px-4 mb-4'>
        <h1 className='text-3xl font-montserrat font-medium'>Groups</h1>
      <GroupsDisplay />
      </div>
      <MeetingsDisplay />
    </div>
  )
}

export default Summary;