'use client'

import React from 'react'
import ScheduledMeetingsDisplay from './ScheduledMeetingsDisplay'
import UnscheduledMeetingsDisplay from './UnscheduledMeetingsDisplay'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/custom/tabs'
import { cn } from '@/lib/utils'

type Meeting = {
  id: string;
  title: string;
  location: string | null;
  scheduled: boolean | null;
  fromTime: string;
  toTime: string;
  timezone: string;
  dates: string[];
};

interface MeetingsDisplayProps {
  meetings: Meeting[] | null;
  error: string | null;
}

const MeetingsDisplay = ({ meetings, error }: MeetingsDisplayProps) => {
  
  const scheduledMeetings = meetings?.filter(meeting => meeting.scheduled) || [];
  const unscheduledMeetings = meetings?.filter(meeting => !meeting.scheduled) || [];

  return (
    <div className="w-full rounded-xl bg-gradient-to-r from-[#EAEFF2] to-[#EEEEEE] p-6 border-2 border-gray-300">
      <div className="flex justify-between items-center">
        <h1 className='text-3xl font-montserrat font-medium ml-4'>Meetings</h1>
      </div>
      
      {error && (
        <div className="mt-4 p-4 bg-red-100 text-red-800 rounded mx-4">
          {error}
        </div>
      )}
      
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
          <ScheduledMeetingsDisplay meetings={scheduledMeetings} />
        </TabsContent>
        
        <TabsContent value="unscheduled">
          <UnscheduledMeetingsDisplay meetings={unscheduledMeetings} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default MeetingsDisplay