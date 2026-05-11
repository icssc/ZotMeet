"use client";

import { savePersonalAvailability } from "@actions/availability/save/action";
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
		const response = await savePersonalAvailability({
			meetingId: meetingData.id,
			meetingAvailabilityTimes: availabilityDates.flatMap(
				(date) => date.availability,
			),
			ifNeededAvailabilityTimes: ifNeededDates.flatMap(
				(date) => date.availability,
			),
			displayName: user.displayName,
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

	const handleScheduleSave = useCallback(
		async (opts?: { skipExitToGroup?: boolean }): Promise<boolean> => {
			if (isMeetingDeletionPending) return false;
			try {
				const { pendingAdds, pendingRemovals } =
					useAvailabilityStore.getState();

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
						return false;
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
						return false;
					}
				}

				if (pendingAdds.size > 0 || pendingRemovals.size > 0) {
					commitPendingTimes();
					const { scheduledTimes } = useAvailabilityStore.getState();
					setIsScheduled(scheduledTimes.size > 0);
				}
				if (!opts?.skipExitToGroup) {
					setAvailabilityView("group");
				}
				return true;
			} catch (error) {
				console.error("Failed to save meeting blocks", error);
				showError("Failed to save meeting schedule. Please try again.");
				return false;
			}
		},
		[
			isMeetingDeletionPending,
			meetingData.id,
			showError,
			commitPendingTimes,
			setAvailabilityView,
		],
	);

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
