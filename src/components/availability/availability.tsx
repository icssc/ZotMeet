"use client";

import { Paper } from "@mui/material";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useShallow } from "zustand/shallow";
import { AvailabilityActions } from "@/components/availability/availability-actions";
import { GroupAvailability } from "@/components/availability/group-availability";
import { GroupResponses } from "@/components/availability/group-responses";
import { AvailabilityHeader } from "@/components/availability/header/availability-header";
import { InviteMembersDialog } from "@/components/availability/invite-members-dialog";
import { PersonalAvailability } from "@/components/availability/personal-availability";
import { AvailabilityNavButton } from "@/components/availability/table/availability-nav-button";
import { AvailabilityTableHeader } from "@/components/availability/table/availability-table-header";
import { TimeZoneDropdown } from "@/components/availability/table/availability-timezone";
import type { SelectMeeting, SelectScheduledMeeting } from "@/db/schema";
import { useAvailabilityData } from "@/hooks/use-availability-data";
import { useGridInteraction } from "@/hooks/use-grid-interaction";
import { useIsMobile } from "@/hooks/use-mobile";
import type { UserProfile } from "@/lib/auth/user";
import { paintPersonalSelection } from "@/lib/availability/paint-selection";
import {
	convertTimeFromUTC,
	generateTimeBlocks,
	getTimeFromHourMinuteString,
	mergeImportedGridSlots,
} from "@/lib/availability/utils";
import type { MemberMeetingAvailability } from "@/lib/types/availability";
import type { HourMinuteString } from "@/lib/types/chrono";
import { useAvailabilityStore } from "@/store/useAvailabilityStore";
import { PersonalAvailabilitySidebar } from "../nav/personal-availability-sidebar";

export function Availability({
	meetingData,
	allAvailabilities,
	user,
	scheduledBlocks,
	autoOpenInviteDialog = false,
	inviteQueryInUrl = false,
}: {
	meetingData: SelectMeeting;
	allAvailabilities: MemberMeetingAvailability[];
	user: UserProfile | null;
	scheduledBlocks: SelectScheduledMeeting[];
	autoOpenInviteDialog?: boolean;
	inviteQueryInUrl?: boolean;
}) {
	const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);

	// View + paint mode live in the store (paint mode is reset atomically in
	// `setAvailabilityView`, so it cannot drift across view switches).
	const { availabilityView, paintMode } = useAvailabilityStore(
		useShallow((state) => ({
			availabilityView: state.availabilityView,
			paintMode: state.paintMode,
		})),
	);

	// Paging lives in the store; grouped into one subscription for readability.
	const {
		currentPage,
		itemsPerPage,
		isFirstPage,
		nextPage,
		prevPage,
		setItemsPerPage,
	} = useAvailabilityStore(
		useShallow((state) => ({
			currentPage: state.currentPage,
			itemsPerPage: state.itemsPerPage,
			isFirstPage: state.isFirstPage,
			nextPage: state.nextPage,
			prevPage: state.prevPage,
			setItemsPerPage: state.setItemsPerPage,
		})),
	);

	// Import-preview overlay (cleared on meeting/tz change and on view-switch
	// away from personal). Lives in the store so the sidebar and cells can
	// read it uniformly.
	const setImportPreview = useAvailabilityStore((s) => s.setImportPreview);
	const setCommittedRange = useAvailabilityStore((s) => s.setCommittedRange);
	const setDraftRange = useAvailabilityStore((s) => s.setDraftRange);
	const setHoverRange = useAvailabilityStore((s) => s.setHoverRange);

	const isMobile = useIsMobile();
	useEffect(() => {
		setItemsPerPage(isMobile ? 2 : 5);
	}, [isMobile, setItemsPerPage]);

	useEffect(() => {
		if (autoOpenInviteDialog) {
			setIsInviteDialogOpen(true);
		}
	}, [autoOpenInviteDialog]);

	// ─── Timezone + time-block derivation ────────────────────────────────
	const [userTimezone, setUserTimezone] = useState(
		Intl.DateTimeFormat().resolvedOptions().timeZone,
	);
	const [changeableTimezone, setChangeableTimezone] = useState(true);
	const referenceDate = meetingData.dates[0];

	const fromTimeLocal = useMemo(
		() => convertTimeFromUTC(meetingData.fromTime, userTimezone, referenceDate),
		[meetingData.fromTime, userTimezone, referenceDate],
	);
	const toTimeLocal = useMemo(
		() => convertTimeFromUTC(meetingData.toTime, userTimezone, referenceDate),
		[meetingData.toTime, userTimezone, referenceDate],
	);
	const fromTimeMinutes = useMemo(
		() => getTimeFromHourMinuteString(fromTimeLocal as HourMinuteString),
		[fromTimeLocal],
	);
	const toTimeMinutes = useMemo(
		() => getTimeFromHourMinuteString(toTimeLocal as HourMinuteString),
		[toTimeLocal],
	);
	const availabilityTimeBlocks = useMemo(
		() => generateTimeBlocks(fromTimeMinutes, toTimeMinutes),
		[fromTimeMinutes, toTimeMinutes],
	);

	// Import overlay lifecycle — clear on meeting/tz change and whenever the
	// view leaves personal.
	// biome-ignore lint/correctness/useExhaustiveDependencies: clear overlay when meeting or viewer TZ changes
	useEffect(() => {
		setImportPreview(null);
	}, [meetingData.id, userTimezone, setImportPreview]);

	useEffect(() => {
		if (availabilityView !== "personal") setImportPreview(null);
	}, [availabilityView, setImportPreview]);

	const {
		availabilityDates,
		setAvailabilityDates,
		ifNeededDates,
		setIfNeededDates,
		googleCalendarEvents,
		members,
		pendingMembers,
		anchorNormalizedDate,
		importGridIsoSet,
		doesntNeedDay,
		currentPageAvailability,
		cancelEdit,
		confirmSave,
	} = useAvailabilityData({
		meetingData,
		allAvailabilities,
		user,
		scheduledBlocks,
		userTimezone,
		fromTimeMinutes,
		availabilityTimeBlocks,
		currentPage,
		itemsPerPage,
	});

	const isLastPage =
		currentPage === Math.floor((meetingData.dates.length - 1) / itemsPerPage);

	const { handlers, gridHandlers, handleMouseLeave } = useGridInteraction({
		availabilityView,
		paintMode,
		availabilityDates,
		ifNeededDates,
		setAvailabilityDates,
		setIfNeededDates,
		userMemberId: user?.memberId,
		fromTimeMinutes,
		userTimezone,
	});

	const handleImportSlotsFromMeeting = useCallback(
		(slotIsoStrings: string[]) => {
			if (!user?.memberId || slotIsoStrings.length === 0) return;
			const merged = mergeImportedGridSlots(
				availabilityDates,
				slotIsoStrings,
				user.memberId,
			);
			setAvailabilityDates(merged);
			setImportPreview(null);
		},
		[availabilityDates, user?.memberId, setAvailabilityDates, setImportPreview],
	);

	const handleCancelEditing = useCallback(() => {
		const originalDates = cancelEdit();
		setAvailabilityDates(originalDates[0]);
		setIfNeededDates(originalDates[1]);
	}, [cancelEdit, setAvailabilityDates, setIfNeededDates]);

	const handleClearAvailability = useCallback(() => {
		const memberId = user?.memberId;
		if (!memberId) return;
		if (availabilityDates.length === 0 || availabilityTimeBlocks.length === 0) {
			return;
		}
		const next = paintPersonalSelection({
			availabilityDates,
			ifNeededDates,
			mode: "unavailable",
			range: {
				earlierDateIndex: 0,
				laterDateIndex: availabilityDates.length - 1,
				earlierBlockIndex: 0,
				laterBlockIndex: availabilityTimeBlocks.length - 1,
			},
			memberId,
			fromTimeMinutes,
			timeZone: userTimezone,
		});
		setAvailabilityDates(next.availabilityDates);
		setIfNeededDates(next.ifNeededDates);
		setCommittedRange(undefined);
		setDraftRange(undefined);
		setHoverRange(undefined);
	}, [
		user?.memberId,
		availabilityDates,
		ifNeededDates,
		availabilityTimeBlocks.length,
		fromTimeMinutes,
		userTimezone,
		setAvailabilityDates,
		setIfNeededDates,
		setCommittedRange,
		setDraftRange,
		setHoverRange,
	]);

	const handleSuccessfulSave = useCallback(() => {
		confirmSave();
	}, [confirmSave]);

	return (
		<div className="flex min-h-[80vh] flex-col gap-6">
			<AvailabilityHeader
				meetingData={meetingData}
				user={user}
				availabilityDates={availabilityDates}
				ifNeededDates={ifNeededDates}
				onCancel={handleCancelEditing}
				onSave={handleSuccessfulSave}
				setChangeableTimezone={setChangeableTimezone}
				setTimezone={setUserTimezone}
				inviteQueryInUrl={inviteQueryInUrl}
			/>

			<div className="flex min-h-0 w-full min-w-0 flex-1 flex-row items-stretch justify-start">
				<Paper
					component="div"
					variant="outlined"
					className="mr-4 flex min-h-0 min-w-0 flex-1 items-start justify-between self-stretch overflow-x-auto lg:overflow-x-hidden lg:pr-14"
				>
					<div className="-mt-2 translate-x-3">
						<AvailabilityNavButton
							direction="left"
							handleClick={prevPage}
							disabled={isFirstPage}
						/>
					</div>
					<div className="flex flex-col gap-4">
						<div className="shrink-0 lg:hidden">
							<AvailabilityActions
								meetingData={meetingData}
								user={user}
								availabilityDates={availabilityDates}
								ifNeededDates={ifNeededDates}
								onCancel={handleCancelEditing}
								onSave={handleSuccessfulSave}
								setChangeableTimezone={setChangeableTimezone}
								setTimezone={setUserTimezone}
								onOpenInviteDialog={() => setIsInviteDialogOpen(true)}
							/>
						</div>
						<table className="w-full table-fixed">
							<AvailabilityTableHeader
								currentPageAvailability={currentPageAvailability}
								meetingType={meetingData.meetingType}
								doesntNeedDay={doesntNeedDay}
							/>

							<tbody onMouseLeave={handleMouseLeave}>
								{availabilityView === "group" ||
								availabilityView === "schedule" ? (
									<GroupAvailability
										meetingId={meetingData.id}
										meetingTitle={meetingData.title}
										availabilityTimeBlocks={availabilityTimeBlocks}
										fromTime={fromTimeMinutes}
										availabilityDates={availabilityDates}
										currentPageAvailability={currentPageAvailability}
										members={members}
										onMouseLeave={handleMouseLeave}
										isScheduling={availabilityView === "schedule"}
										timeZone={userTimezone}
										handlers={gridHandlers}
									/>
								) : (
									<PersonalAvailability
										availabilityTimeBlocks={availabilityTimeBlocks}
										fromTimeMinutes={fromTimeMinutes}
										availabilityDates={availabilityDates}
										currentPageAvailability={currentPageAvailability}
										googleCalendarEvents={googleCalendarEvents}
										meetingDates={meetingData.dates}
										userTimezone={userTimezone}
										handlers={handlers}
										paintMode={paintMode}
									/>
								)}
							</tbody>
						</table>

						<div className="ml-10 flex flex-row items-center justify-between gap-4 md:ml-16">
							<TimeZoneDropdown
								timeZone={userTimezone}
								changeTimeZone={setUserTimezone}
								changeableTimezone={changeableTimezone}
							/>
						</div>
					</div>

					<div className="-mt-2 -translate-x-9">
						<AvailabilityNavButton
							direction="right"
							handleClick={() => nextPage(availabilityDates.length)}
							disabled={isLastPage}
						/>
					</div>
				</Paper>

				{(availabilityView === "group" || availabilityView === "schedule") && (
					<div className="hidden w-96 min-w-0 shrink-0 flex-col items-stretch gap-3 lg:flex lg:min-h-0">
						<AvailabilityActions
							meetingData={meetingData}
							user={user}
							availabilityDates={availabilityDates}
							ifNeededDates={ifNeededDates}
							onCancel={handleCancelEditing}
							onSave={handleSuccessfulSave}
							setChangeableTimezone={setChangeableTimezone}
							setTimezone={setUserTimezone}
							onOpenInviteDialog={() => setIsInviteDialogOpen(true)}
						/>
						<Paper
							variant="outlined"
							className="flex min-h-[24rem] min-w-0 flex-1 flex-col overflow-hidden"
						>
							<GroupResponses
								availabilityDates={availabilityDates}
								fromTime={fromTimeMinutes}
								members={members}
								pendingMembers={pendingMembers}
								timezone={userTimezone}
								anchorNormalizedDate={anchorNormalizedDate}
								currentPageAvailability={currentPageAvailability}
								availabilityTimeBlocks={availabilityTimeBlocks}
								doesntNeedDay={doesntNeedDay}
							/>
						</Paper>
					</div>
				)}
				{availabilityView === "personal" && (
					<div className="hidden w-96 min-w-0 shrink-0 flex-col items-stretch gap-3 lg:flex lg:min-h-0">
						<AvailabilityActions
							meetingData={meetingData}
							user={user}
							availabilityDates={availabilityDates}
							ifNeededDates={ifNeededDates}
							onCancel={handleCancelEditing}
							onSave={handleSuccessfulSave}
							setChangeableTimezone={setChangeableTimezone}
							setTimezone={setUserTimezone}
							onOpenInviteDialog={() => setIsInviteDialogOpen(true)}
						/>
						<Paper
							variant="outlined"
							className="flex min-h-[24rem] min-w-0 flex-1 flex-col overflow-hidden"
						>
							<PersonalAvailabilitySidebar
								meetingId={meetingData.id}
								userTimezone={userTimezone}
								importGridIsoSet={importGridIsoSet}
								canImport={Boolean(user?.memberId)}
								onImportSlots={handleImportSlotsFromMeeting}
								onClearAvailability={handleClearAvailability}
							/>
						</Paper>
					</div>
				)}
			</div>
			<InviteMembersDialog
				open={isInviteDialogOpen}
				onOpenChange={setIsInviteDialogOpen}
				meetingId={meetingData.id}
			/>
		</div>
	);
}
