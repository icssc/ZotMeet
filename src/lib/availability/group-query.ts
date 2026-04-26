import { getTimestampFromBlockIndex } from "@/lib/availability/utils";
import type { SelectionStateType } from "@/lib/types/availability";
import type { ZotDate } from "@/lib/zotdate";

function intersect(a: Set<string>, b: Set<string>): Set<string> {
	const out = new Set<string>();
	for (const id of a) if (b.has(id)) out.add(id);
	return out;
}

/**
 * Computes the intersection of member availability across every 15-minute cell in
 * `range`. Returns the members who are available (respectively, marked "if-needed")
 * for every cell in the range, matching the standard "find a meeting time" semantics.
 *
 * An empty or missing bucket anywhere in the range drops the member from the result.
 */
export function computeGroupMembersForRange(args: {
	range: SelectionStateType;
	availabilityDates: ZotDate[];
	ifNeededDates: ZotDate[];
	fromTimeMinutes: number;
	timeZone: string;
}): { availableMemberIds: string[]; ifNeededMemberIds: string[] } {
	const { range, availabilityDates, ifNeededDates, fromTimeMinutes, timeZone } =
		args;

	let availableAcc: Set<string> | null = null;
	let ifNeededAcc: Set<string> | null = null;

	for (
		let dateIndex = range.earlierDateIndex;
		dateIndex <= range.laterDateIndex;
		dateIndex++
	) {
		const availableDay = availabilityDates[dateIndex];
		const ifNeededDay = ifNeededDates[dateIndex];
		if (!availableDay) {
			availableAcc = new Set();
			ifNeededAcc = new Set();
			continue;
		}

		for (
			let blockIndex = range.earlierBlockIndex;
			blockIndex <= range.laterBlockIndex;
			blockIndex++
		) {
			const timestamp = getTimestampFromBlockIndex(
				blockIndex,
				dateIndex,
				fromTimeMinutes,
				availabilityDates,
				timeZone,
			);
			const availableForCell = new Set<string>(
				timestamp ? (availableDay.groupAvailability[timestamp] ?? []) : [],
			);
			const ifNeededForCell = new Set<string>(
				timestamp ? (ifNeededDay?.groupAvailability[timestamp] ?? []) : [],
			);

			availableAcc =
				availableAcc === null
					? availableForCell
					: intersect(availableAcc, availableForCell);
			ifNeededAcc =
				ifNeededAcc === null
					? ifNeededForCell
					: intersect(ifNeededAcc, ifNeededForCell);
		}
	}

	return {
		availableMemberIds: [...(availableAcc ?? new Set<string>())].sort(),
		ifNeededMemberIds: [...(ifNeededAcc ?? new Set<string>())].sort(),
	};
}
