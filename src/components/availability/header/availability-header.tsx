"use client";
import { getGoogleCalendarPrefilledLink } from "@actions/availability/google/calendar/action";
import {
	AccessTime,
	Add,
	CalendarMonth,
	Check,
	ContentCopy,
	LocationOn,
	Settings,
} from "@mui/icons-material";
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
		scheduledTimesCount,
		hasHydratedScheduledTimes,
	} = useAvailabilityStore(
		useShallow((state) => ({
			availabilityView: state.availabilityView,
			setAvailabilityView: state.setAvailabilityView,
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

	return (
		<Paper variant="outlined" className="mt-10">
			<div className="flex flex-col gap-4">
				<div className="flex w-full items-center">
					<h1 className="line-clamp-1 min-w-0 self-start truncate font-medium text-xl md:text-3xl">
						{meetingData.title}
					</h1>

					<div className="ml-auto sm:ml-8">
						<IconButton size="small" onClick={handleCopy}>
							<ContentCopy />
						</IconButton>
					</div>

					{availabilityView === "personal" ? (
						<Button
							size="square"
							variant="contained"
							onClick={() => {
								onCancel();
								setAvailabilityView("group");
							}}
						>
							<Check />
						</Button>
					) : (
						<div className="block sm:hidden">
							<IconButton size="small" onClick={() => setIsEditModalOpen(true)}>
								<MoreVerticalIcon />
							</IconButton>
						</div>
					)}
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

					{availabilityView === "group" && isScheduled && (
						<div className="order-2 flex w-full flex-col gap-2 self-start md:order-none md:ml-auto md:w-auto md:shrink-0">
							<div className="flex flex-wrap justify-end gap-2">
								<Button
									variant="outlined"
									size="medium"
									startIcon={<GoogleIcon sx={{ fontSize: 18 }} />}
									onClick={async () => {
										if (isGeneratingLink) return;
										setIsGeneratingLink(true);
										try {
											const { success, link } =
												await getGoogleCalendarPrefilledLink({
													meetingId: meetingData.id,
													meetingTitle: meetingData.title,
													meetingDescription: meetingData.description,
													meetingLocation: meetingData.location,
													timezone: meetingData.timezone,
												});

											if (!success || !link) {
												showError("Failed to generate Google Calendar link.");
												return;
											}

											window.open(link, "_blank", "noopener,noreferrer");

											showSuccess(
												"Google Calendar link opened! Confirm the event in your calendar.",
											);
										} catch (error) {
											console.error(
												"Error generating Google Calendar link:",
												error,
											);
											showError(
												"An error occurred while generating the Google Calendar link.",
											);
										} finally {
											setIsGeneratingLink(false);
										}
									}}
								>
									Add to Calendar
								</Button>
							</div>
						</div>
					)}
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
