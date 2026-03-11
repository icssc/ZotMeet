import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import FmdGoodIcon from "@mui/icons-material/FmdGood";
import GroupIcon from "@mui/icons-material/Group";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import Link from "next/link";
import React from "react";

interface MeetingCardProps {
	meetingName: string;
	meetingOrganizer: string;
	dateStart: string;
	dateEnd: string;
	timeStart: string;
	timeEnd: string;
	numResponders: number;
	location: string | null;
	scheduled: boolean;
	meetingLink: string;
}

const MeetingCard = ({
	meetingName,
	meetingOrganizer,
	dateStart,
	dateEnd,
	timeStart,
	timeEnd,
	numResponders,
	location,
	scheduled = false,
	meetingLink,
}: MeetingCardProps) => {
	return (
		<div className="border-2 border-gray-300 rounded-xl p-10 w-full mb-10">
			<div className="flex">
				<p className="text-2xl">{meetingName}</p>
				<MoreVertIcon className="ml-auto text-gray-500" />
			</div>

			<p className="text-gray-500 mb-4">{meetingOrganizer}</p>

			<div className="grid grid-cols-2 gap-x-16 gap-6 text-gray-500">
				<div className="flex items-center gap-2">
					<CalendarMonthIcon fontSize="small" />
					<span>
						{" "}
						{dateStart} - {dateEnd}
					</span>
				</div>

				<div className="flex items-center gap-2">
					<AccessTimeIcon fontSize="small" />
					<p>
						{" "}
						{timeStart} - {timeEnd}
					</p>
				</div>

				<div className="flex items-center gap-2">
					<GroupIcon fontSize="small" />
					<p>{numResponders} Responders</p>
				</div>

				{location && (
					<div className="flex items-center gap-2">
						<FmdGoodIcon fontSize="small" />
						<p>{location}</p>
					</div>
				)}
			</div>

			<div className="flex mt-5">
				{scheduled && <p className="text-sm">Scheduled</p>}

				<Link href={meetingLink} className="ml-auto text-[#F26489]">
					ADD AVAILABILITY
				</Link>
				<NavigateNextIcon className="text-[#F26489]" />
			</div>
		</div>
	);
};

export default MeetingCard;
