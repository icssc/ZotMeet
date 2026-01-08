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
		<div className="flex flex-row items-center gap-x-4 text-lg text-gray-500">
			<Input
				type="text"
				className={cn(
					"flex-center w-full appearance-none rounded-none border-x-0 border-t-0 border-gray-base p-1 text-2xl font-light placeholder:text-gray-base md:text-3xl",
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
