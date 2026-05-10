"use client";

import {
	saveAvailability,
	saveIfNeeded,
} from "@actions/availability/save/action";
import {
	deleteScheduledTimeBlock,
	saveScheduledTimeBlock,
} from "@actions/meeting/schedule/action";
import { useCallback, useEffect, useState } from "react";
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
	isMeetingDeletionPending = false,
}: UseAvailabilityActionHandlersParams) {
	const { showError } = useSnackbar();
	const [isScheduled, setIsScheduled] = useState(() =>
		Boolean(meetingData.scheduled),
	);

	useEffect(() => {
		setIsScheduled(Boolean(meetingData.scheduled));
	}, [meetingData.scheduled]);

	const { setHasAvailability, setAvailabilityView } = useAvailabilityStore(
		useShallow((state) => ({
			setHasAvailability: state.setHasAvailability,
			setAvailabilityView: state.setAvailabilityView,
		})),
	);

	const { commitPendingTimes, clearPendingTimes } = useAvailabilityStore(
		useShallow((state) => ({
			commitPendingTimes: state.commitPendingTimes,
			clearPendingTimes: state.clearPendingTimes,
		})),
	);

	const revertPersonalDraft = useCallback(() => {
		onCancel();
		setChangeableTimezone(true);
	}, [onCancel, setChangeableTimezone]);

	const exitPersonalView = useCallback(() => {
		setAvailabilityView("group");
	}, [setAvailabilityView]);

	const handlePersonalCancel = useCallback(() => {
		revertPersonalDraft();
		exitPersonalView();
	}, [revertPersonalDraft, exitPersonalView]);

	const runPersonalSave = useCallback(async (): Promise<boolean> => {
		if (!user || isMeetingDeletionPending) return false;

		setChangeableTimezone(true);
		const availability = {
			meetingId: meetingData.id,
			availabilityTimes: availabilityDates.flatMap((date) => date.availability),
			displayName: user.displayName,
		};
		const ifNeeded = {
			meetingId: meetingData.id,
			availabilityTimes: ifNeededDates.flatMap((date) => date.availability),
			displayName: user.displayName,
		};

		const response = await saveAvailability(availability);
		if (response.status !== 200) {
			console.error("Error saving availability:", response.body.error);
			return false;
		}

		const ifNeededResponse = await saveIfNeeded(ifNeeded);
		if (ifNeededResponse.status === 200) {
			setHasAvailability(true);
			onSave();
			return true;
		}
		console.error(
			"Error saving if-needed availability:",
			ifNeededResponse.body.error,
		);
		return false;
	}, [
		user,
		isMeetingDeletionPending,
		meetingData.id,
		availabilityDates,
		ifNeededDates,
		setChangeableTimezone,
		setHasAvailability,
		onSave,
	]);

	const handlePersonalSave = useCallback(async () => {
		if (await runPersonalSave()) {
			exitPersonalView();
		}
	}, [runPersonalSave, exitPersonalView]);

	const handleScheduleCancel = useCallback(() => {
		clearPendingTimes();
		setAvailabilityView("group");
	}, [clearPendingTimes, setAvailabilityView]);

	const handleScheduleSave = useCallback(async () => {
		if (isMeetingDeletionPending) return;
		try {
			const { pendingAdds, pendingRemovals } = useAvailabilityStore.getState();

			for (const timestamp of pendingRemovals) {
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

				const removalResult = await deleteScheduledTimeBlock({
					meetingId: meetingData.id,
					scheduledDate,
					scheduledFromTime,
					scheduledToTime,
				});
				if ("error" in removalResult) {
					showError(
						removalResult.error ?? "Failed to delete scheduled meeting.",
					);
					return;
				}
			}

			for (const timestamp of pendingAdds) {
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

				const saveResult = await saveScheduledTimeBlock({
					meetingId: meetingData.id,
					scheduledDate,
					scheduledFromTime,
					scheduledToTime,
				});
				if ("error" in saveResult) {
					showError(saveResult.error ?? "Failed to save scheduled meeting.");
					return;
				}
			}

			if (pendingAdds.size > 0 || pendingRemovals.size > 0) {
				commitPendingTimes();
				const { scheduledTimes } = useAvailabilityStore.getState();
				setIsScheduled(scheduledTimes.size > 0);
			}
			setAvailabilityView("group");
		} catch (error) {
			console.error("Failed to save meeting blocks", error);
			showError("Failed to save meeting schedule. Please try again.");
		}
	}, [
		isMeetingDeletionPending,
		meetingData.id,
		showError,
		commitPendingTimes,
		setAvailabilityView,
	]);

	return {
		handlePersonalCancel,
		handlePersonalSave,
		revertPersonalDraft,
		exitPersonalView,
		runPersonalSave,
		handleScheduleCancel,
		handleScheduleSave,
		isScheduled,
	};
}
