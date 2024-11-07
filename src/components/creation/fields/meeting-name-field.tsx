"use client";

import React, { Dispatch, SetStateAction, useEffect, useRef } from "react";

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
            <input
                type="text"
                className="flex-center border-gray-base placeholder:text-gray-base w-full appearance-none rounded-none border-x-0 border-t-0 p-1 text-2xl font-light focus:outline-none focus:ring-0 md:text-3xl"
                placeholder="Meeting Name"
                value={meetingName}
                onChange={handleChange}
                ref={inputRef}
            />
        </div>
    );
}
