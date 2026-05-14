"use client";

import {
	AccessTime,
	CalendarMonth,
	ExitToApp,
	LocationOn,
	Settings,
} from "@mui/icons-material";
import { Button, IconButton, Paper, Typography } from "@mui/material";
import { MoreVerticalIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { DeleteModal } from "@/components/availability/header/delete-modal";
import { EditModal } from "@/components/availability/header/edit-modal";
import { CopyToClipboardButton } from "@/components/tools/copy-clipboard-button";
import type { SelectMeeting } from "@/db/schema";
import type { UserProfile } from "@/lib/auth/user";
import {
	convertTimeFromUTC,
	formatDateToUSNumeric,
	formatTimeWithHoursAndMins,
	sortMeetingIsoDatesAsc,
} from "@/lib/availability/utils";

interface AvailabilityHeaderProps {
	meetingData: SelectMeeting;
	user: UserProfile | null;
	inviteQueryInUrl?: boolean;
	isMeetingDeletionPending: boolean;
	onMeetingDeletionPendingChange: (pending: boolean) => void;
}

export function AvailabilityHeader({
	meetingData,
	user,
	inviteQueryInUrl = false,
	isMeetingDeletionPending,
	onMeetingDeletionPendingChange,
}: AvailabilityHeaderProps) {
	const router = useRouter();
	const pathname = usePathname();
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

	const isOwner = !!user && meetingData.hostId === user.memberId;
	const isMember = !!user && !isOwner;

	useEffect(() => {
		if (!inviteQueryInUrl) return;
		router.replace(pathname, { scroll: false });
	}, [inviteQueryInUrl, pathname, router]);

	const sortedMeetingDates = useMemo(
		() => sortMeetingIsoDatesAsc(meetingData.dates),
		[meetingData.dates],
	);

	const firstMeetingDate =
		sortedMeetingDates.at(0) ?? meetingData.dates.at(0) ?? "";
	const lastMeetingDate =
		sortedMeetingDates.at(-1) ?? meetingData.dates.at(-1) ?? firstMeetingDate;

	const formattedStartDate = formatDateToUSNumeric(new Date(firstMeetingDate));
	const formattedEndDate = formatDateToUSNumeric(new Date(lastMeetingDate));

	const displayTimezone =
		meetingData.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone;
	const referenceDate = firstMeetingDate;
	const formattedStartTime = formatTimeWithHoursAndMins(
		convertTimeFromUTC(meetingData.fromTime, displayTimezone, referenceDate),
	);
	const formattedEndTime = formatTimeWithHoursAndMins(
		convertTimeFromUTC(meetingData.toTime, displayTimezone, referenceDate),
	);

	const copyTitleButton = (
		<CopyToClipboardButton
			content={meetingData.title}
			successMessage="Meeting name copied to clipboard"
			errorMessage="Failed to copy meeting name"
		/>
	);

	return (
		<Paper variant="outlined" className="mt-10">
			<div className="flex flex-col gap-4">
				<div className="flex w-full items-center">
					<h1 className="line-clamp-1 min-w-0 self-start truncate font-medium text-xl md:text-3xl">
						{meetingData.title}
					</h1>

					<div className="ml-auto hidden sm:ml-8 sm:block">
						{copyTitleButton}
					</div>

					{(isOwner || isMember) && (
						<div className="ml-auto flex items-center sm:hidden">
							{copyTitleButton}
							<IconButton
								size="small"
								onClick={() =>
									isOwner
										? setIsEditModalOpen(true)
										: setIsDeleteModalOpen(true)
								}
							>
								<MoreVerticalIcon />
							</IconButton>
						</div>
					)}
				</div>

				<div className="flex flex-wrap items-center gap-x-5 gap-y-3 md:gap-x-5">
					<div className="flex min-w-0 flex-wrap items-center gap-x-10 gap-y-2 md:gap-x-5">
						<div className="flex items-center gap-2">
							<CalendarMonth fontSize="small" />
							<Typography color="textSecondary" className="whitespace-nowrap">
								{formattedStartDate} - {formattedEndDate}
							</Typography>
						</div>

						<div className="flex items-center gap-2">
							<AccessTime fontSize="small" />
							<Typography color="textSecondary" className="whitespace-nowrap">
								{formattedStartTime} - {formattedEndTime}
							</Typography>
						</div>

						{isMember && (
							<div className="-ml-2 hidden items-center sm:flex">
								<Button
									onClick={() => setIsDeleteModalOpen(true)}
									variant="text"
									size="medium"
									color="warning"
									startIcon={<ExitToApp />}
								>
									<Typography>Leave Meeting</Typography>
								</Button>
							</div>
						)}
					</div>

					{meetingData.location && (
						<div className="flex items-center gap-2">
							<LocationOn fontSize="small" />
							<Typography color="textSecondary" className="whitespace-nowrap">
								{meetingData.location}
							</Typography>
						</div>
					)}

					{isOwner && (
						<div className="hidden items-center gap-x-1 sm:flex">
							<Button
								onClick={() => setIsEditModalOpen(true)}
								variant="text"
								size="medium"
								color="primary"
								startIcon={<Settings sx={{ color: "primary.main" }} />}
							>
								<Typography>Edit Meeting</Typography>
							</Button>
						</div>
					)}
				</div>

				<EditModal
					meetingData={meetingData}
					isOpen={isEditModalOpen}
					handleOpenChange={setIsEditModalOpen}
					onDeleteRequest={() => {
						setIsEditModalOpen(false);
						setIsDeleteModalOpen(true);
					}}
				/>

				<DeleteModal
					meetingData={meetingData}
					isOpen={isDeleteModalOpen}
					handleOpenChange={setIsDeleteModalOpen}
					isOwner={isOwner}
					isDeletionPending={isMeetingDeletionPending}
					onDeletionPendingChange={onMeetingDeletionPendingChange}
				/>
			</div>
		</Paper>
	);
}
