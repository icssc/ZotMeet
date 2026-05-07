import { getTimestampFromBlockIndex } from "@/lib/availability/utils";
import type { SelectionStateType } from "@/lib/types/availability";
import type { ZotDate } from "@/lib/zotdate";

export type MemberRangeStatus = "available" | "if-needed" | "absent";

export interface GroupMembersForRange {
	readonly availableMemberIds: ReadonlySet<string>;
	readonly coveredMemberIds: ReadonlySet<string>;
}

export function statusForMember(
	memberId: string,
	groups: GroupMembersForRange,
): MemberRangeStatus {
	if (groups.availableMemberIds.has(memberId)) return "available";
	if (groups.coveredMemberIds.has(memberId)) return "if-needed";
	return "absent";
}

function intersect(a: Set<string>, b: Set<string>): Set<string> {
	const out = new Set<string>();
	for (const id of a) if (b.has(id)) out.add(id);
	return out;
}

export function computeGroupMembersForRange(args: {
	range: SelectionStateType;
	availabilityDates: ZotDate[];
	ifNeededDates: ZotDate[];
	fromTimeMinutes: number;
	timeZone: string;
}): GroupMembersForRange {
	const { range, availabilityDates, ifNeededDates, fromTimeMinutes, timeZone } =
		args;

	let availableAcc: Set<string> | null = null;
	let coveredAcc: Set<string> | null = null;

	for (
		let dateIndex = range.earlierDateIndex;
		dateIndex <= range.laterDateIndex;
		dateIndex++
	) {
		const availableDay = availabilityDates[dateIndex];
		const ifNeededDay = ifNeededDates[dateIndex];
		if (!availableDay) {
			availableAcc = new Set();
			coveredAcc = new Set();
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
			const coveredForCell = new Set<string>([
				...availableForCell,
				...ifNeededForCell,
			]);

			availableAcc =
				availableAcc === null
					? availableForCell
					: intersect(availableAcc, availableForCell);
			coveredAcc =
				coveredAcc === null
					? coveredForCell
					: intersect(coveredAcc, coveredForCell);
		}
	}

	return {
		availableMemberIds: availableAcc ?? new Set<string>(),
		coveredMemberIds: coveredAcc ?? new Set<string>(),
	};
}
