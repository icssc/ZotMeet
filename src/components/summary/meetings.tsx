"use client";

import React, { useCallback, useState } from "react";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/custom/tabs";
import { MeetingsDisplay } from "@/components/summary/meetings-display";
import { Button } from "@/components/ui/button";
import { SelectMeeting } from "@/db/schema";
import { cn } from "@/lib/utils";

interface MeetingsDisplayProps {
    meetings: SelectMeeting[];
    userId: string;
}

export const Meetings = ({ meetings, userId }: MeetingsDisplayProps) => {
    const [hostedOnly, setHostedOnly] = useState(false);

    const scheduledMeetings =
        meetings?.filter((meeting) => meeting.scheduled) || [];
    const unscheduledMeetings =
        meetings?.filter((meeting) => !meeting.scheduled) || [];

    const filteredScheduledMeetings = (
        hostedOnly
            ? scheduledMeetings.filter((meeting) => meeting.hostId === userId)
            : scheduledMeetings
    ).sort(
        (a, b) =>
            new Date(b.scheduledDate ?? 0).getTime() -
                new Date(a.scheduledDate ?? 0).getTime() ||
            new Date(b.scheduledFromTime ?? 0).getTime() -
                new Date(a.scheduledFromTime ?? 0).getTime()
    );

    const filteredUnscheduledMeetings = (
        hostedOnly
            ? unscheduledMeetings.filter((meeting) => meeting.hostId === userId)
            : unscheduledMeetings
    ).sort(
        (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    const handleClick = useCallback(() => {
        setHostedOnly((prev) => !prev);
    }, []);

    return (
        <div className="w-full rounded-xl">
            <div className="flex items-center justify-between">
                <h1 className="font-montserrat text-3xl font-medium">
                    Meetings
                </h1>

                <Button
                    variant="outline"
                    size="sm"
                    className="flex w-32 items-center justify-center font-dm-sans text-xs"
                    onClick={handleClick}
                >
                    {hostedOnly ? "Show All" : "Show Hosted Only"}
                </Button>
            </div>

            <Tabs
                defaultValue="scheduled"
                className="pt-4"
            >
                <TabsList className="mb-8 space-x-0">
                    <TabsTrigger
                        value="scheduled"
                        className={cn(
                            "border-0 border-b-2 border-neutral-300 p-4 pb-0 font-montserrat text-lg duration-0",
                            "data-[state=active]:border-orange-500"
                        )}
                    >
                        Scheduled
                    </TabsTrigger>
                    <TabsTrigger
                        value="unscheduled"
                        className={cn(
                            "border-0 border-b-2 border-neutral-300 p-4 pb-0 font-montserrat text-lg duration-0",
                            "data-[state=active]:border-orange-500"
                        )}
                    >
                        Unscheduled
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="scheduled">
                    <MeetingsDisplay meetings={filteredScheduledMeetings} />
                </TabsContent>

                <TabsContent value="unscheduled">
                    <MeetingsDisplay meetings={filteredUnscheduledMeetings} />
                </TabsContent>
            </Tabs>
        </div>
    );
};
