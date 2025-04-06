import React from 'react'
import GroupCard from './GroupCard'

const GroupsDisplay = () => {
  return (
    <div className='flex flex-nowrap gap-4 overflow-x-auto pb-4 w-full'>
      <GroupCard name="AntAlmanac" />
      <GroupCard name="ZotMeet" />
      <GroupCard name="Some group" />
      <GroupCard name="Some group" />
      <GroupCard name="Some group" />
      <GroupCard name="Some group" />
    </div>
  )
}

export default GroupsDisplay