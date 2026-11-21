"use client";

import { savePersonalAvailability } from "@actions/availability/save/action";
import { saveMeetingSchedule } from "@actions/meeting/schedule/action";
import {
	type ScheduleBlock,
	type ScheduleNotificationKind,
	scheduleNotificationKind,
} from "@zotmeet/shared";
import { useCallback, useMemo, useState } from "react";
import { useShallow } from "zustand/shallow";
import type { ScheduleConfirmDialogProps } from "@/components/availability/schedule-confirm-dialog";
import { useSnackbar } from "@/components/ui/snackbar-provider";
import type { SelectMeeting } from "@/db/schema";
import type { UserProfile } from "@/lib/auth/user";
import type { Member } from "@/lib/types/availability";
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
	/** Everyone attached to the meeting; used for the confirm dialog's email count. */
	members: Member[];
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
	members,
	onCancel,
	onSave,
	setChangeableTimezone,
	userTimezone,
	isMeetingDeletionPending = false,
}: UseAvailabilityActionHandlersParams) {
	const { showError, showSuccess } = useSnackbar();

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

	const pendingKind = scheduleNotificationKind({
		wasScheduled: isScheduled,
		hasChanges: pendingAdds.size > 0 || pendingRemovals.size > 0,
		hasBlocksAfter: finalScheduledTimes.size > 0,
	});

	/** Span of the meeting after this save, for the confirm dialog's summary. */
	const pendingScheduleWindow = useMemo(() => {
		if (finalScheduledTimes.size === 0) return null;
		const times = [...finalScheduledTimes].map((ts) => new Date(ts).getTime());
		return {
			start: new Date(Math.min(...times)),
			end: new Date(Math.max(...times) + BLOCK_MS),
		};
	}, [finalScheduledTimes]);

	// Mirrors `getMeetingParticipantUserIds` (src/server/data/meeting/queries.ts):
	// every attached member except the host. Change the two together.
	const recipientCount = members.filter(
		(member) => member.memberId !== meetingData.hostId,
	).length;

	const [isConfirmOpen, setIsConfirmOpen] = useState(false);
	const [confirmKind, setConfirmKind] =
		useState<ScheduleNotificationKind>("scheduled");

	const saveSchedule = useCallback(
		async (opts?: {
			skipExitToGroup?: boolean;
			message?: string;
		}): Promise<
			{ saved: true; kind: ScheduleNotificationKind | null } | { saved: false }
		> => {
			if (isMeetingDeletionPending) return { saved: false };
			try {
				const { pendingAdds, pendingRemovals } =
					useAvailabilityStore.getState();

				let kind: ScheduleNotificationKind | null = null;
				if (pendingAdds.size > 0 || pendingRemovals.size > 0) {
					const result = await saveMeetingSchedule({
						meetingId: meetingData.id,
						adds: [...pendingAdds].map(toBlock),
						removals: [...pendingRemovals].map(toBlock),
						message: opts?.message,
					});
					if ("error" in result) {
						showError(result.error);
						return { saved: false };
					}
					kind = result.kind;
					commitPendingTimes();
				}
				if (!opts?.skipExitToGroup) {
					setAvailabilityView("group");
				}
				return { saved: true, kind };
			} catch (error) {
				console.error("Failed to save meeting blocks", error);
				showError("Failed to save meeting schedule. Please try again.");
				return { saved: false };
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

	/**
	 * What every schedule-mode Save button calls. A save that will email
	 * members opens the confirm dialog instead and resolves `false`: nothing
	 * is saved until the host confirms.
	 */
	const handleScheduleSave = useCallback(
		async (opts?: { skipExitToGroup?: boolean }): Promise<boolean> => {
			if (pendingKind) {
				setConfirmKind(pendingKind);
				setIsConfirmOpen(true);
				return false;
			}
			return (await saveSchedule(opts)).saved;
		},
		[pendingKind, saveSchedule],
	);

	const confirmScheduleSave = useCallback(
		async (message: string) => {
			const outcome = await saveSchedule({ message });
			if (!outcome.saved) return false;
			if (outcome.kind) {
				const done =
					outcome.kind === "rescheduled"
						? "Meeting rescheduled."
						: "Meeting scheduled.";
				const memberWord = recipientCount === 1 ? "member" : "members";
				showSuccess(
					recipientCount > 0
						? `${done} ${recipientCount} ${memberWord} will be emailed.`
						: done,
				);
			}
			return true;
		},
		[saveSchedule, recipientCount, showSuccess],
	);

	const scheduleConfirmDialogProps: ScheduleConfirmDialogProps | null =
		pendingScheduleWindow
			? {
					open: isConfirmOpen,
					onClose: () => setIsConfirmOpen(false),
					onConfirm: confirmScheduleSave,
					kind: confirmKind,
					meetingTitle: meetingData.title,
					start: pendingScheduleWindow.start,
					end: pendingScheduleWindow.end,
					recipientCount,
				}
			: null;

	return {
		handlePersonalCancel,
		handlePersonalSave,
		revertPersonalDraft,
		exitToGroupView,
		runPersonalSave,
		handleScheduleCancel,
		handleScheduleSave,
		isScheduled,
		scheduleConfirmDialogProps,
	};
}
