"use client";
import {
	AccessTime,
	CalendarMonth,
	Check,
	Close,
	ContentCopy,
	LocationOn,
	Settings,
} from "@mui/icons-material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import GoogleIcon from "@mui/icons-material/Google";
import { Button, IconButton, Paper, Typography } from "@mui/material";
import { DeleteIcon, MoreVerticalIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useShallow } from "zustand/shallow";
import { DeleteModal } from "@/components/availability/header/delete-modal";
import { EditModal } from "@/components/availability/header/edit-modal";
import { useSnackbar } from "@/components/ui/snackbar-provider";
import type { SelectMeeting } from "@/db/schema";
import type { UserProfile } from "@/lib/auth/user";
import {
	convertTimeFromUTC,
	formatDateToUSNumeric,
	formatTimeWithHoursAndMins,
} from "@/lib/availability/utils";
import { copyTextToClipboard } from "@/lib/clipboard/utils";
import {
	savePersonalAvailabilityChanges,
	saveScheduleChanges,
} from "@/lib/meetings/save/utils";
import type { ZotDate } from "@/lib/zotdate";
import { useAvailabilityStore } from "@/store/useAvailabilityStore";
import type { Availability } from "../availability";

interface AvailabilityHeaderProps {
	meetingData: SelectMeeting;
	user: UserProfile | null;
	availabilityDates: ZotDate[];
	ifNeededDates: ZotDate[];
	onCancel: () => void;
	onSave: () => void;
	setChangeableTimezone: (can: boolean) => void;
	setTimezone: (timezone: string) => void;
	availabilityEditState: Availability;
	inviteQueryInUrl?: boolean;
}

export function AvailabilityHeader({
	meetingData,
	user,
	availabilityDates: _availabilityDates,
	ifNeededDates: _ifNeededDates,
	onCancel,
	onSave: _onSave,
	setChangeableTimezone: _setChangeableTimezone,
	setTimezone: _setTimezone,
	availabilityEditState: _availabilityEditState,
	inviteQueryInUrl = false,
}: AvailabilityHeaderProps) {
	const router = useRouter();
	const pathname = usePathname();
	const { showSuccess, showError } = useSnackbar();
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [isGeneratingLink, setIsGeneratingLink] = useState(false); // disable gcal button reclick while generating link

	const isOwner = !!user && meetingData.hostId === user.memberId;
	const {
		availabilityView,
		setAvailabilityView,
		clearPendingTimes,
		commitPendingTimes,
		setHasAvailability,
		scheduledTimesCount,
		hasHydratedScheduledTimes,
	} = useAvailabilityStore(
		useShallow((state) => ({
			availabilityView: state.availabilityView,
			setAvailabilityView: state.setAvailabilityView,
			clearPendingTimes: state.clearPendingTimes,
			commitPendingTimes: state.commitPendingTimes,
			setHasAvailability: state.setHasAvailability,
			scheduledTimesCount: state.scheduledTimes.size,
			hasHydratedScheduledTimes: state.hasHydratedScheduledTimes,
		})),
	);
	const isScheduled = hasHydratedScheduledTimes
		? scheduledTimesCount > 0
		: meetingData.scheduled;

	// const [isGuestDialogOpen, setIsGuestDialogOpen] = useState(false);
	// const [guestName, setGuestName] = useState("");

	useEffect(() => {
		if (!inviteQueryInUrl) return;
		router.replace(pathname, { scroll: false });
	}, [inviteQueryInUrl, pathname, router]);

	const formattedStartDate = formatDateToUSNumeric(
		new Date(meetingData.dates[0]),
	);
	const formattedEndDate = formatDateToUSNumeric(
		new Date(meetingData.dates[meetingData.dates.length - 1]),
	);

	const displayTimezone =
		meetingData.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone;
	const referenceDate = meetingData.dates[0];
	const formattedStartTime = formatTimeWithHoursAndMins(
		convertTimeFromUTC(meetingData.fromTime, displayTimezone, referenceDate),
	);

	const formattedEndTime = formatTimeWithHoursAndMins(
		convertTimeFromUTC(meetingData.toTime, displayTimezone, referenceDate),
	);

	async function handleCopy() {
		try {
			const copied = await copyTextToClipboard(meetingData.title);
			if (!copied) {
				throw new Error("Clipboard write failed");
			}
			showSuccess("Meeting name copied to clipboard");
		} catch (_clipboardError) {
			showError("Failed to copy Meeting name");
		}
	}

	function handleCloseEditing() {
		onCancel();
		clearPendingTimes();
		setAvailabilityView("group");
	}

	async function handleConfirmEditing() {
		try {
			if (availabilityView === "personal") {
				const didSave = await savePersonalAvailabilityChanges({
					meetingId: meetingData.id,
					user,
					availabilityDates: _availabilityDates,
					ifNeededDates: _ifNeededDates,
					onError: showError,
				});
				if (!didSave) return;

				setHasAvailability(true);
				_onSave();
				setAvailabilityView("group");
				return;
			}

			if (availabilityView === "schedule") {
				const { pendingAdds, pendingRemovals } =
					useAvailabilityStore.getState();
				const didSave = await saveScheduleChanges({
					meetingId: meetingData.id,
					pendingAdds,
					pendingRemovals,
					onError: showError,
				});
				if (!didSave) return;

				if (pendingAdds.size > 0 || pendingRemovals.size > 0) {
					commitPendingTimes();
				}
				setAvailabilityView("group");
			}
		} catch (_error) {
			showError("An unexpected error occurred while saving. Please try again.");
		}
	}

	return (
		<Paper variant="outlined" className="mt-10">
			<div className="flex flex-col gap-4">
				{availabilityView === "group" && (
					<div className="flex items-center sm:hidden">
						<Button
							color="inherit"
							startIcon={
								<ChevronLeftIcon fontSize="small" sx={{ display: "block" }} />
							}
							sx={{ pl: 0 }}
							href="/summary"
						>
							Back
						</Button>
					</div>
				)}

				<div className="flex w-full items-center">
					{(availabilityView === "personal" ||
						availabilityView === "schedule") && (
						<Button size="square" onClick={handleCloseEditing}>
							<Close />
						</Button>
					)}

					{availabilityView !== "personal" && (
						<h1 className="line-clamp-1 min-w-0 truncate font-medium text-xl md:text-3xl">
							{meetingData.title}
						</h1>
					)}

					{availabilityView === "personal" && (
						<div>
							<Typography>Add Availability</Typography>
							<Typography variant="caption" color="textSecondary">
								Drag to add availability
							</Typography>
						</div>
					)}

					<div className="ml-auto sm:ml-8">
						<IconButton size="small" onClick={handleCopy}>
							<ContentCopy />
						</IconButton>
					</div>

					<div className="block sm:hidden">
						{availabilityView === "personal" ||
						availabilityView === "schedule" ? (
							<Button
								size="square"
								variant="contained"
								onClick={handleConfirmEditing}
							>
								<Check />
							</Button>
						) : isOwner ? (
							<div className="block sm:hidden">
								<IconButton
									size="small"
									onClick={() => setIsEditModalOpen(true)}
								>
									<MoreVerticalIcon />
								</IconButton>
							</div>
						) : null}
					</div>
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

						{meetingData.location && (
							<div className="flex items-center gap-2">
								<LocationOn />
								<Typography color="textSecondary" className="whitespace-nowrap">
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
				/>
			</div>
		</Paper>
	);
}
