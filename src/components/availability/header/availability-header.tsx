"use client";
import {
	AccessTime,
	CalendarMonth,
	ChevronLeft,
	ContentCopy,
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

	const { scheduledTimesCount, hasHydratedScheduledTimes } =
		useAvailabilityStore(
			useShallow((state) => ({
				scheduledTimesCount: state.scheduledTimes.size,
				hasHydratedScheduledTimes: state.hasHydratedScheduledTimes,
			})),
		);
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

					<div className="ml-auto sm:ml-8 hidden sm:block">
						{copyTitleButton}
					</div>
					
					{(isOwner || isMember) && (
						<div className="block sm:hidden ml-auto flex items-center">
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
			</div>
		</Paper>
					)}
				</div>
			</div>

			<Paper variant="outlined" className="mt-2">
				<div className="flex flex-col gap-4">
					<div className="flex w-full items-center">
						<h1 className="line-clamp-1 min-w-0 self-start truncate font-medium text-xl md:text-3xl">
							{meetingData.title}
						</h1>
						<div className="ml-6 hidden sm:block">{copyTitleButton}</div>
					</div>
					<div className="flex flex-wrap items-start gap-4">
						<div className="flex min-w-0 flex-wrap items-center gap-x-6 gap-y-2">
							<div className="flex items-center gap-2">
								<CalendarMonth fontSize="small" />
								<Typography color="textSecondary" className="whitespace-nowrap">
									{formattedStartDate} - {formattedEndDate}
								</Typography>
							</div>

<div className="flex items-center gap-2">
	<AccessTime />
	<Typography color="textSecondary" className="whitespace-nowrap">
		{formattedStartTime} - {formattedEndTime}
	</Typography>
</div>

{isOwner && (
	<div className="-ml-2 hidden items-center sm:flex">
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
									<LocationOn />
									<Typography
										color="textSecondary"
										className="whitespace-nowrap"
									>
										{meetingData.location}
									</Typography>
								</div>
							)}

							{isOwner && (
								<div className="-ml-2 hidden items-center gap-x-1 sm:flex">
									<Button
										onClick={() => setIsEditModalOpen(true)}
										variant="text"
										size="medium"
										color="primary"
										startIcon={<Settings sx={{ color: "primary.main" }} />}
									>
										<Typography>Edit Meeting</Typography>
									</Button>

									<Button
										onClick={() => setIsDeleteModalOpen(true)}
										variant="text"
										size="medium"
										startIcon={<DeleteIcon />}
									>
										<Typography>Delete Meeting</Typography>
									</Button>
								</div>
							)}
						</div>
					</div>

					<EditModal
						meetingData={meetingData}
						isOpen={isEditModalOpen}
						handleOpenChange={setIsEditModalOpen}
					/>

					<DeleteModal
						meetingData={meetingData}
						isOpen={isDeleteModalOpen}
						handleOpenChange={setIsDeleteModalOpen}
						isDeletionPending={isMeetingDeletionPending}
						onDeletionPendingChange={onMeetingDeletionPendingChange}
					/>
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
				/>
			</div>
		</Paper>
	);
}
