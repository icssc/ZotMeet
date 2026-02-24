"use server";

import { getUserAvailabilitiesAndScheduled } from "@data/availability/queries";
import { fromZonedTime } from "date-fns-tz";
import { getCurrentSession } from "@/lib/auth";
import { BLOCK_LENGTH } from "@/lib/availability/utils";

function expandScheduledBlockToISOSlots(
	scheduledDate: Date,
	fromTime: string,
	toTime: string,
	timezone: string,
): Set<string> {
	const slots = new Set<string>();
	const datePart = scheduledDate.toISOString().substring(0, 10);

	const [fh, fm] = fromTime.split(":").map(Number);
	const [th, tm] = toTime.split(":").map(Number);

	let currentMinutes = fh * 60 + fm;
	const endMinutes = th * 60 + tm;
	while (currentMinutes < endMinutes) {
		const h = Math.floor(currentMinutes / 60)
			.toString()
			.padStart(2, "0");
		const m = (currentMinutes % 60).toString().padStart(2, "0");
		const utcDate = fromZonedTime(`${datePart}T${h}:${m}:00`, timezone);
		slots.add(utcDate.toISOString());
		currentMinutes += BLOCK_LENGTH;
	}

	return slots;
}

export async function getUserFreeTimes(): Promise<
	{ freeTimes: string[] } | { error: string }
> {
	const { user } = await getCurrentSession();

	if (!user) {
		return { error: "You must be logged in to view free times." };
	}

	try {
		const { userAvailabilities, scheduledBlocks } =
			await getUserAvailabilitiesAndScheduled(user.memberId);

		const scheduledSlots = new Set<string>();
		for (const block of scheduledBlocks) {
			const blockSlots = expandScheduledBlockToISOSlots(
				block.scheduledDate,
				block.scheduledFromTime,
				block.scheduledToTime,
				block.timezone,
			);
			for (const slot of blockSlots) {
				scheduledSlots.add(slot);
			}
		}

		const freeTimes = new Set<string>();
		for (const avail of userAvailabilities) {
			for (const isoString of avail.meetingAvailabilities) {
				if (!scheduledSlots.has(isoString)) {
					freeTimes.add(isoString);
				}
			}
		}

		return { freeTimes: [...freeTimes].sort() };
	} catch (error) {
		console.error("Failed to fetch free times:", error);
		return { error: "Failed to fetch free times." };
	}
}
