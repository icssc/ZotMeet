"use client";

import React, { useState, useEffect } from 'react';
import GroupsDisplay from '@/components/summary/GroupsDisplay';
import MeetingsDisplay from '@/components/summary/MeetingsDisplay';
import { getUserMeetings } from "@/server/actions/meeting/fetch/action";

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

const Summary = () => {
  const [meetings, setMeetings] = useState<Meeting[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchMeetings = async () => {
    setError(null);
    
    try {
      const result = await getUserMeetings();
      if (result.error) {
        setError(result.error);
      } else {
        setMeetings(result.meetings || []);
      }
    } catch (err) {
      setError("Failed to fetch meetings");
    }
  };

  useEffect(() => {
    fetchMeetings();
  }, []);

  return (
    <div className='px-8 py-8'>
      <div className='flex flex-col gap-4 px-8 mb-4'>
        <h1 className='text-3xl font-montserrat font-medium'>Groups</h1>
        <GroupsDisplay />
      </div>
      <MeetingsDisplay 
        meetings={meetings} 
        error={error} 
      />
    </div>
  );
};

export default Summary;