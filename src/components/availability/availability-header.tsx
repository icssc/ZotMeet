"use client";

import { useState } from "react";
import { useAvailabilityContext } from "@/components/availability/context/availability-context";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { SelectMeeting } from "@/db/schema";
import { UserProfile } from "@/lib/auth/user";
import { cn } from "@/lib/utils";
import { useAvailabilityViewStore } from "@/store/useAvailabilityViewStore";
import { saveAvailability } from "@actions/availability/save/action";
import { CircleCheckIcon, CircleXIcon } from "lucide-react";

interface AvailabilityHeaderProps {
    meetingData: SelectMeeting;
    user: UserProfile | null;
}

export function AvailabilityHeader({
    meetingData,
    user,
}: AvailabilityHeaderProps) {
    const { availabilityDates } = useAvailabilityContext();
    const {
        hasAvailability,
        setHasAvailability,
        availabilityView,
        setAvailabilityView,
    } = useAvailabilityViewStore();

    const [isGuestDialogOpen, setIsGuestDialogOpen] = useState(false);
    const [guestName, setGuestName] = useState("");

    const handleCancel = async () => {
        setAvailabilityView("group");
    };

    const handleSave = async () => {
        if (!user) {
            setIsGuestDialogOpen(true);
            return;
        }

        await saveAvailabilityData();
    };

    const saveAvailabilityData = async (displayName?: string) => {
        const availability = {
            meetingId: meetingData.id,
            availabilityTimes: availabilityDates.flatMap(
                (date) => date.availability
            ),
            displayName: user ? undefined : displayName,
        };

        const response = await saveAvailability(availability);

        if (response.status === 200) {
            setHasAvailability(true);
            setAvailabilityView("group");

            // Clear guest member name
            if (!user) {
                setGuestName("");
            }
        } else {
            console.error("Error saving availability:", response.body.error);
        }
    };

    const handleGuestSubmit = () => {
        if (guestName.trim()) {
            setIsGuestDialogOpen(false);
            saveAvailabilityData(guestName);
        }
    };

    return (
        <>
            <div className="flex-between px-2 pt-8 md:px-4 md:pt-10 lg:px-[60px]">
                <h1 className="line-clamp-1 h-8 pr-2 font-montserrat text-xl font-medium md:h-fit md:text-3xl">
                    {meetingData.title}
                </h1>

                {availabilityView === "personal" ? (
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
                    </div>
                ) : (
                    <div className="flex space-x-4">
                        <Button
                            className={cn(
                                "flex-center h-8 min-h-fit px-2 uppercase md:w-40 md:p-0"
                            )}
                            onClick={() => setAvailabilityView("personal")}
                        >
                            <span className="hidden md:flex">
                                {hasAvailability
                                    ? "Edit Availability"
                                    : "Add Availability"}
                            </span>
                        </Button>
                    </div>
                )}
            </div>

            <Dialog
                open={isGuestDialogOpen}
                onOpenChange={setIsGuestDialogOpen}
            >
                <DialogContent>
                    <DialogTitle>Continue as Guest</DialogTitle>
                    <Input
                        id="name"
                        placeholder="Enter your name..."
                        value={guestName}
                        onChange={(e) => setGuestName(e.target.value)}
                        autoFocus
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                handleGuestSubmit();
                            }
                        }}
                    />
                    <DialogFooter>
                        <Button
                            type="button"
                            onClick={handleGuestSubmit}
                            disabled={!guestName.trim()}
                        >
                            Submit
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
