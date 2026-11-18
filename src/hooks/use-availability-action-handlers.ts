"use client";

import { savePersonalAvailability } from "@actions/availability/save/action";
import { saveMeetingSchedule } from "@actions/meeting/schedule/action";
import type { ScheduleBlock } from "@zotmeet/shared";
import { useCallback, useMemo } from "react";
import { useShallow } from "zustand/shallow";
import { useSnackbar } from "@/components/ui/snackbar-provider";
import type { SelectMeeting } from "@/db/schema";
import type { UserProfile } from "@/lib/auth/user";
import type { ZotDate } from "@/lib/zotdate";
import { useAvailabilityStore } from "@/store/useAvailabilityStore";

/** One scheduled block is 15 minutes. */
const BLOCK_MS = 15 * 60 * 1000;

/** A pending-grid timestamp → the row shape `scheduled_meetings` stores (local time). */
function toBlock(timestamp: string): ScheduleBlock {
	const date = new Date(timestamp);
	return {
		scheduledDate: new Date(
			date.getFullYear(),
			date.getMonth(),
			date.getDate(),
		),
		scheduledFromTime: date.toTimeString().slice(0, 8),
		scheduledToTime: new Date(date.getTime() + BLOCK_MS)
			.toTimeString()
			.slice(0, 8),
	};
}

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
	const { showError } = useSnackbar();

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
		clearPendingTimes();
		setAvailabilityView("group");
	}, [clearPendingTimes, setAvailabilityView]);

	const { scheduledTimes, pendingAdds, pendingRemovals } = useAvailabilityStore(
		useShallow((s) => ({
			scheduledTimes: s.scheduledTimes,
			pendingAdds: s.pendingAdds,
			pendingRemovals: s.pendingRemovals,
		})),
	);

	const finalScheduledTimes = useMemo(() => {
		const final = new Set(scheduledTimes);
		for (const ts of pendingRemovals) final.delete(ts);
		for (const ts of pendingAdds) final.add(ts);
		return final;
	}, [scheduledTimes, pendingAdds, pendingRemovals]);
	const hasPendingChanges = pendingAdds.size > 0 || pendingRemovals.size > 0;
	const willNotifyOnSchedule =
		hasPendingChanges && finalScheduledTimes.size > 0;
	const isReschedule = isScheduled;

	const pendingScheduleWindow = useMemo(() => {
		if (finalScheduledTimes.size === 0) return null;
		const times = [...finalScheduledTimes].map((ts) => new Date(ts).getTime());
		return {
			start: new Date(Math.min(...times)),
			end: new Date(Math.max(...times) + BLOCK_MS),
		};
	}, [finalScheduledTimes]);

	const handleScheduleSave = useCallback(
		async (opts?: {
			skipExitToGroup?: boolean;
			message?: string;
		}): Promise<boolean> => {
			if (isMeetingDeletionPending) return false;
			try {
				const { pendingAdds, pendingRemovals } =
					useAvailabilityStore.getState();

				if (pendingAdds.size > 0 || pendingRemovals.size > 0) {
					const result = await saveMeetingSchedule({
						meetingId: meetingData.id,
						adds: [...pendingAdds].map(toBlock),
						removals: [...pendingRemovals].map(toBlock),
						message: opts?.message,
					});
					if ("error" in result) {
						showError(result.error);
						return false;
					}
					commitPendingTimes();
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
		exitToGroupView,
		runPersonalSave,
		handleScheduleCancel,
		handleScheduleSave,
		isScheduled,
		willNotifyOnSchedule,
		isReschedule,
		pendingScheduleWindow,
	};
}
