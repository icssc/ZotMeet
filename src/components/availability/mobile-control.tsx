"use client";

import { Drawer, Paper } from "@mui/material";
import {
	CalendarIcon,
	MapPinIcon,
	SparklesIcon,
	UsersIcon,
} from "lucide-react";

export function FloatingControlBar({
	onOpen,
	numRooms,
	numAttendees,
}: {
	onOpen: () => void;
	numRooms: number;
	numAttendees: number;
}) {
	return (
		<div className="fixed bottom-16 left-1/2 z-50 -translate-x-1/2">
			<Paper
				elevation={4}
				onClick={onOpen}
				className="flex cursor-pointer items-center gap-4 rounded-3xl px-4 py-2"
			>
				<div className="flex flex-col items-center gap-2 text-sm">
					<MapPinIcon size={16} />
					<span>{numRooms} Rooms</span>
				</div>

				<div className="flex flex-col items-center gap-2 text-sm">
					<UsersIcon size={16} />
					<span>{numAttendees} Attendees</span>
				</div>

				<div className="flex flex-col items-center gap-2 text-sm">
					<CalendarIcon size={16} />
					<span>Add Availability</span>
				</div>

				<div className="flex flex-col items-center gap-2 text-sm">
					<SparklesIcon size={16} />
					<span>Schedule</span>
				</div>
			</Paper>
		</div>
	);
}

export function BottomSheet({
	open,
	onClose,
	children,
}: {
	open: boolean;
	onClose: () => void;
	children: React.ReactNode;
}) {
	return (
		<Drawer
			anchor="bottom"
			open={open}
			onClose={onClose}
			PaperProps={{
				sx: {
					borderTopLeftRadius: "16px",
					borderTopRightRadius: "16px",
					maxHeight: "85vh",
					overflowY: "auto",
					pb: 2,
				},
			}}
		>
			<div className="flex justify-center py-2">
				<div className="h-1.5 w-10 rounded-full bg-gray-300" />
			</div>

			<div className="px-4 pb-4">{children}</div>
		</Drawer>
	);
}
