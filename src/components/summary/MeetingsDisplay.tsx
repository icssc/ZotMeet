'use client'

import React, { useState } from 'react'
import { ScheduledMeetingsDisplay } from './ScheduledMeetingsDisplay'
import { UnscheduledMeetingsDisplay } from './UnscheduledMeetingsDisplay'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/custom/tabs'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { SelectMeeting } from '@/db/schema'

interface MeetingsDisplayProps {
  meetings: SelectMeeting[];
  userId: string;
}

export const MeetingsDisplay = ({ meetings, userId }: MeetingsDisplayProps) => {
  const [showHostedOnly, setShowHostedOnly] = useState(false);

  const scheduledMeetings = meetings?.filter(meeting => meeting.scheduled) || [];
  const unscheduledMeetings = meetings?.filter(meeting => !meeting.scheduled) || [];

  return (
    <div className="w-full rounded-xl bg-gradient-to-r from-[#EAEFF2] to-[#EEEEEE] p-6 border-2 border-gray-300">
      <div className="flex justify-between items-center">
        <h1 className='text-3xl font-montserrat font-medium ml-4'>Meetings</h1>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center rounded-lg bg-[#EAEFF2] text-gray-700 bg-[#F9FAFB] bg-opacity-50 border-2 border-gray-200 font-dm-sans text-xs" 
          onClick={() => setShowHostedOnly(!showHostedOnly)}
        >
          {showHostedOnly ? 'Show All' : 'Show Hosted Only'}
        </Button>
      </div>
      
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

