import type React from "react";
import type { Dispatch, SetStateAction } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface MeetingNameFieldProps {
	meetingName: string;
	setMeetingName: Dispatch<SetStateAction<string>>;
}

export function MeetingNameField({
	meetingName,
	setMeetingName,
}: MeetingNameFieldProps) {
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setMeetingName(e.target.value);
	};

	return (
		<div className="flex flex-row items-center gap-x-4 text-gray-500 text-lg">
			<Input
				type="text"
				className={cn(
					"w-full flex-center appearance-none rounded-none border-gray-base border-x-0 border-t-0 p-1 font-light text-2xl placeholder:text-gray-base md:text-3xl",
					"focus-visible:ring-0",
				)}
				placeholder={"Meeting name"}
				value={meetingName}
				onChange={handleChange}
				autoFocus
			/>
		</div>
	);
}
