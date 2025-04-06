'use client'

import React from 'react'
import ScheduledMeetingsDisplay from './ScheduledMeetingsDisplay'
import UnscheduledMeetingsDisplay from './UnscheduledMeetingsDisplay'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/custom/tabs'
import { cn } from '@/lib/utils'

const MeetingsDisplay = () => {
  return (
    <div className="w-full rounded-xl bg-gradient-to-r from-[#EAEFF2] to-[#EEEEEE] p-6 border-2 border-gray-300">
      <h1 className='text-3xl font-montserrat font-medium ml-4'>Meetings</h1>
      
      <Tabs defaultValue="scheduled" className="mt-2">
        <TabsList className="mx-4 space-x-0 mb-8">
          <TabsTrigger 
            value="scheduled"
            className={cn(
              "border-0 border-b-2 border-neutral-300 p-4 pb-0 text-lg font-montserrat duration-0",
              "data-[state=active]:border-orange-500"
            )}
          >
            Scheduled
          </TabsTrigger>
          <TabsTrigger 
            value="unscheduled"
            className={cn(
              "border-0 border-b-2 border-neutral-300 p-4 pb-0 text-lg font-montserrat duration-0",
              "data-[state=active]:border-orange-500"
            )}
          >
            Unscheduled
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="scheduled">
          <ScheduledMeetingsDisplay />
        </TabsContent>
        
        <TabsContent value="unscheduled">
          <UnscheduledMeetingsDisplay />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default MeetingsDisplay