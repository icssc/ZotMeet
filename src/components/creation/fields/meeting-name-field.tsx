import React, { Dispatch, SetStateAction, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const DEFAULT_MEETING_NAME = "";

interface MeetingNameFieldProps {
    meetingName: string;
    setMeetingName: Dispatch<SetStateAction<string>>;
}

export function MeetingNameField({
    meetingName,
    setMeetingName,
}: MeetingNameFieldProps) {
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setMeetingName(DEFAULT_MEETING_NAME);

        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, [setMeetingName]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMeetingName(e.target.value);
    };

    return (
        <div className="flex flex-row items-center gap-x-4 text-lg text-gray-500">
            <Input
                type="text"
                className={cn(
                    "flex-center border-gray-base placeholder:text-gray-base w-full appearance-none rounded-none border-x-0 border-t-0 p-1 text-2xl font-light md:text-3xl",
                    "focus-visible:ring-0"
                )}
                placeholder="Meeting Name"
                value={meetingName}
                onChange={handleChange}
                ref={inputRef}
            />
        </div>
    );
}
