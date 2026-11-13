"use client";

import { savePersonalAvailability } from "@actions/availability/save/action";
import { commitMeetingSchedule } from "@actions/meeting/schedule/action";
import { useCallback, useRef, useState } from "react";
import { useShallow } from "zustand/shallow";
import { useSnackbar } from "@/components/ui/snackbar-provider";
import type { SelectMeeting } from "@/db/schema";
import type { UserProfile } from "@/lib/auth/user";
import type { ZotDate } from "@/lib/zotdate";
import { useAvailabilityStore } from "@/store/useAvailabilityStore";

export interface UseAvailabilityActionHandlersParams {
	meetingData: SelectMeeting;
	user: UserProfile | null;
	availabilityDates: ZotDate[];
	ifNeededDates: ZotDate[];
	onCancel: () => void;
	onSave: () => void;
	setChangeableTimezone: (can: boolean) => void;
	userTimezone: string;
	isMeetingDeletionPending?: boolean;
}

export function useAvailabilityActionHandlers({
	meetingData,
	user,
	availabilityDates,
	ifNeededDates,
	onCancel,
	onSave,
	setChangeableTimezone,
	userTimezone,
	isMeetingDeletionPending = false,
}: UseAvailabilityActionHandlersParams) {
	const { showError, showSuccess, showWarning } = useSnackbar();
	const isScheduleSavingRef = useRef(false);
	const [isScheduleSaving, setIsScheduleSaving] = useState(false);

	const {
		setHasAvailability,
		setAvailabilityView,
		commitPendingTimes,
		clearPendingTimes,
		scheduledTimesCount,
		hasHydratedScheduledTimes,
	} = useAvailabilityStore(
		useShallow((state) => ({
			setHasAvailability: state.setHasAvailability,
			setAvailabilityView: state.setAvailabilityView,
			commitPendingTimes: state.commitPendingTimes,
			clearPendingTimes: state.clearPendingTimes,
			scheduledTimesCount: state.scheduledTimes.size,
			hasHydratedScheduledTimes: state.hasHydratedScheduledTimes,
		})),
	);

	// Prefer hydrated client state once available so optimistic edits are
	// reflected immediately; fall back to the server flag pre-hydration.
	const isScheduled = hasHydratedScheduledTimes
		? scheduledTimesCount > 0
		: Boolean(meetingData.scheduled);

	const revertPersonalDraft = useCallback(() => {
		onCancel();
		setChangeableTimezone(true);
	}, [onCancel, setChangeableTimezone]);

	const exitToGroupView = useCallback(() => {
		setAvailabilityView("group");
	}, [setAvailabilityView]);

	const handlePersonalCancel = useCallback(() => {
		revertPersonalDraft();
		exitToGroupView();
	}, [revertPersonalDraft, exitToGroupView]);

	const runPersonalSave = useCallback(async (): Promise<boolean> => {
		if (!user || isMeetingDeletionPending) return false;

		setChangeableTimezone(true);
		const response = await savePersonalAvailability({
			meetingId: meetingData.id,
			meetingAvailabilityTimes: availabilityDates.flatMap(
				(date) => date.availability,
			),
			ifNeededAvailabilityTimes: ifNeededDates.flatMap(
				(date) => date.availability,
			),
			timezone: userTimezone,
		});
		if (response.status === 200) {
			setHasAvailability(true);
			onSave();
			return true;
		}
		console.error("Error saving availability:", response.body.error);
		return false;
	}, [
		user,
		isMeetingDeletionPending,
		meetingData.id,
		availabilityDates,
		ifNeededDates,
		userTimezone,
		setChangeableTimezone,
		setHasAvailability,
		onSave,
	]);

	const handlePersonalSave = useCallback(async () => {
		if (await runPersonalSave()) {
			exitToGroupView();
		}
	}, [runPersonalSave, exitToGroupView]);

	const handleScheduleCancel = useCallback(() => {
		if (isScheduleSavingRef.current) return;
		clearPendingTimes();
		setAvailabilityView("group");
	}, [clearPendingTimes, setAvailabilityView]);

	const handleScheduleSave = useCallback(
		async (opts?: { skipExitToGroup?: boolean }): Promise<boolean> => {
			if (isMeetingDeletionPending || isScheduleSavingRef.current) return false;
			isScheduleSavingRef.current = true;
			useAvailabilityStore.setState({ scheduleEditsLocked: true });
			setIsScheduleSaving(true);
			try {
				const { pendingAdds, pendingRemovals } =
					useAvailabilityStore.getState();

				const toBlock = (timestamp: string) => {
					const date = new Date(timestamp);
					const scheduledDate = new Date(
						date.getFullYear(),
						date.getMonth(),
						date.getDate(),
					);
					const scheduledFromTime = date.toTimeString().slice(0, 8);
					const scheduledToTime = new Date(date.getTime() + 15 * 60 * 1000)
						.toTimeString()
						.slice(0, 8);
					return { scheduledDate, scheduledFromTime, scheduledToTime };
				};

				const response = await commitMeetingSchedule({
					meetingId: meetingData.id,
					additions: Array.from(pendingAdds).map(toBlock),
					removals: Array.from(pendingRemovals).map(toBlock),
				});

				if (!response.success) {
					showError(response.error ?? "Failed to save meeting schedule.");
					return false;
				}

				if (pendingAdds.size > 0 || pendingRemovals.size > 0) {
					commitPendingTimes();
				}

				const { synced, skipped, failed } = response.outcome;
				if (response.remainingBlocks === 0 && failed > 0) {
					showWarning(
						`Schedule cleared, but the event could not be removed from ${failed} member calendar(s). They may need to delete it manually.`,
					);
				} else if (
					response.remainingBlocks > 0 &&
					synced + skipped + failed > 0
				) {
					const message = `Scheduled. ${synced} added to calendars, ${skipped} skipped, ${failed} failed.`;
					if (failed > 0) {
						showWarning(message);
					} else {
						showSuccess(message);
					}
				}

				if (!opts?.skipExitToGroup) {
					setAvailabilityView("group");
				}
				return true;
			} catch (error) {
				console.error("Failed to save meeting blocks", error);
				showError("Failed to save meeting schedule. Please try again.");
				return false;
			} finally {
				isScheduleSavingRef.current = false;
				useAvailabilityStore.setState({ scheduleEditsLocked: false });
				setIsScheduleSaving(false);
			}
		},
		[
			isMeetingDeletionPending,
			meetingData.id,
			showError,
			showSuccess,
			showWarning,
			commitPendingTimes,
			setAvailabilityView,
		],
	);

	return {
		handlePersonalCancel,
		handlePersonalSave,
		revertPersonalDraft,
		exitToGroupView,
		runPersonalSave,
		handleScheduleCancel,
		handleScheduleSave,
		isScheduleSaving,
		isScheduled,
	};
}
