import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import FmdGoodIcon from "@mui/icons-material/FmdGood";
import GroupIcon from "@mui/icons-material/Group";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import Link from "next/link";

interface MeetingCardProps {
	meetingName: string;
	meetingOrganizer: string;
	dateStart: string;
	dateEnd: string;
	timeStart: string;
	timeEnd: string;
	numResponders: number;
	location: string | null;
	scheduled?: boolean;
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
		<div className="w-full rounded-xl border-2 border-gray-300 p-10">
			<div className="flex">
				<p className="text-2xl">{meetingName}</p>
				<MoreVertIcon className="ml-auto text-gray-500" />
			</div>

			<p className="mb-4 text-gray-500">{meetingOrganizer}</p>

			<div className="grid grid-cols-2 gap-6 gap-x-16 text-gray-500">
				<div className="flex items-center gap-2">
					<CalendarMonthIcon fontSize="small" />
					<span>
						{dateStart} - {dateEnd}
					</span>
				</div>

				<div className="flex items-center gap-2">
					<AccessTimeIcon fontSize="small" />
					<span>
						{timeStart} - {timeEnd}
					</span>
				</div>

				<div className="flex items-center gap-2">
					<GroupIcon fontSize="small" />
					<span>{numResponders} Responders</span>
				</div>

				{location && (
					<div className="flex items-center gap-2">
						<FmdGoodIcon fontSize="small" />
						<span>{location}</span>
					</div>
				)}
			</div>

			<div className="mt-5 flex">
				{scheduled && <p className="text-sm">Scheduled</p>}

				<Link
					href={meetingLink}
					className="ml-auto flex items-center text-[#F26489]"
				>
					{scheduled ? "VIEW SCHEDULE" : "ADD AVAILABILITY"}
					<NavigateNextIcon />
				</Link>
			</div>
		</div>
	);
};

export default MeetingCard;
