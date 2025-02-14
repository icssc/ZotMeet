"use client";

import { useAvailabilityContext } from "@/components/availability/context/availability-context";
import { Button } from "@/components/ui/button";
import { MeetingSelectSchema } from "@/db/schema";
import { cn } from "@/lib/utils";
import { saveAvailability } from "@/server/actions/availability/save/action";
import { CircleCheckIcon, CircleXIcon } from "lucide-react";

interface AvailabilityHeaderProps {
    meetingData: MeetingSelectSchema;
}

export function AvailabilityHeader({ meetingData }: AvailabilityHeaderProps) {
    const {
        isEditingAvailability,
        setIsEditingAvailability,
        setIsStateUnsaved,
        availabilityDates,
    } = useAvailabilityContext();

    const handleCancel = async () => {
        // $availabilityDates =
        //     (await getGeneralAvailability(data, $guestSession)) ??
        //     generateSampleDates();

        setIsEditingAvailability((prev) => !prev);
        setIsStateUnsaved(false);
    };

    const handleSave = async () => {
        const availability = {
            meetingId: meetingData.id,
            availabilityDates: availabilityDates.map((date) => ({
                day: date.day,
                availability: date.availability,
            })),
        };

        await saveAvailability(availability);
    };

    return (
        <div className="flex-between px-2 pt-8 md:px-4 md:pt-10 lg:px-[60px]">
            <h1 className="line-clamp-1 h-8 pr-2 font-montserrat text-xl font-medium md:h-fit md:text-3xl">
                {meetingData.title}
            </h1>

            {isEditingAvailability && (
                <div className="flex space-x-2 md:space-x-4">
                    <Button
                        className={cn(
                            "flex-center h-8 min-h-fit border-yellow-500 bg-white px-2 uppercase text-yellow-500 outline md:w-28 md:p-0",
                            "hover:border-yellow-500 hover:bg-yellow-500 hover:text-white"
                        )}
                        onClick={handleCancel}
                    >
                        <span className="hidden md:flex">Cancel</span>
                        <CircleXIcon />
                    </Button>

                    {/* <form
                    // bind:this={form}
                    // use:enhance={({ cancel }) => {
                    //   handleSave(cancel);

                    //   console.log("Saving Availability");

                    //   return async ({ update }) => {
                    //     update();

                    //     $isEditingAvailability = false;
                    //     $isStateUnsaved = false;
                    //   };
                    // }}
                    // action={`/availability/${data.meetingId}?/save`}
                    // method="POST"
                    // id="availability-save-form"
                    // on:submit|preventDefault
                    >
                        <input
                            type="hidden"
                            name="availabilityDates"
                            value={JSON.stringify(availabilityDates)}
                        />
                        <input
                            type="hidden"
                            name="username"
                            value={$guestSession.guestName}
                        />
                        <input
                            type="hidden"
                            name="meetingId"
                            value={meetingData.id ?? ""}
                        /> */}

                    <Button
                        className={cn(
                            "flex-center h-8 min-h-fit border border-green-500 bg-white px-2 uppercase text-secondary md:w-24 md:p-0",
                            "group hover:border-green-500 hover:bg-green-500"
                        )}
                        type="submit"
                        onClick={handleSave}
                    >
                        <span className="hidden text-green-500 group-hover:text-white md:flex">
                            Save
                        </span>
                        <CircleCheckIcon className="text-green-500 group-hover:text-white" />
                    </Button>
                    {/* </form> */}
                </div>
            )}
        </div>
    );
}
