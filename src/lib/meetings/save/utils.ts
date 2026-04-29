"use client";

import {
	saveAvailability,
	saveIfNeeded,
} from "@actions/availability/save/action";
import {
	deleteScheduledTimeBlock,
	saveScheduledTimeBlock,
} from "@actions/meeting/schedule/action";
import type { UserProfile } from "@/lib/auth/user";
import type { ZotDate } from "@/lib/zotdate";

interface SavePersonalAvailabilityParams {
	meetingId: string;
	user: UserProfile | null;
	availabilityDates: ZotDate[];
	ifNeededDates: ZotDate[];
	onError?: (message: string) => void;
}

export async function savePersonalAvailabilityChanges({
	meetingId,
	user,
	availabilityDates,
	ifNeededDates,
	onError,
}: SavePersonalAvailabilityParams): Promise<boolean> {
	if (!user) return false;

	const availability = {
		meetingId,
		availabilityTimes: availabilityDates.flatMap((date) => date.availability),
		displayName: user.displayName,
	};
	const ifNeeded = {
		meetingId,
		availabilityTimes: ifNeededDates.flatMap((date) => date.availability),
		displayName: user.displayName,
	};

	const response = await saveAvailability(availability);
	if (response.status !== 200) {
		onError?.("Failed to save availability.");
		return false;
	}

	const ifNeededResponse = await saveIfNeeded(ifNeeded);
	if (ifNeededResponse.status !== 200) {
		onError?.("Failed to save if-needed availability.");
		return false;
	}

	return true;
}

interface SaveScheduleChangesParams {
	meetingId: string;
	pendingAdds: Set<string>;
	pendingRemovals: Set<string>;
	onError?: (message: string) => void;
}

export async function saveScheduleChanges({
	meetingId,
	pendingAdds,
	pendingRemovals,
	onError,
}: SaveScheduleChangesParams): Promise<boolean> {
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
			meetingId,
			scheduledDate,
			scheduledFromTime,
			scheduledToTime,
		});
		if ("error" in removalResult) {
			onError?.(removalResult.error ?? "Failed to delete scheduled meeting.");
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
			meetingId,
			scheduledDate,
			scheduledFromTime,
			scheduledToTime,
		});
		if ("error" in saveResult) {
			onError?.(saveResult.error ?? "Failed to save scheduled meeting.");
			return false;
		}
	}

	return true;
}
