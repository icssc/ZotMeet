import React from 'react'
import GroupsDisplay from '@/components/summary/GroupsDisplay'

const Summary = () => {
  return (
    <div className='px-12 py-8'>
      <div className='flex flex-col gap-4 px-4'>
        <h1 className='text-3xl'>Groups</h1>
      <GroupsDisplay />
      </div>
    </div>
  )
}

export default Summary;