import { BLOCK_LENGTH } from "../chrono/time";
import type { ZotDate } from "./zotdate";

/**
 * Split best times: when no single slot fits every responder, the fewest
 * sessions that together do, with the host able to attend each one.
 *
 * Every non-host member is required at exactly one session, so each session
 * asks for as few people as possible and its time window is as wide as the
 * assignment allows. Available and if-needed both count as attending, same as
 * `computeMaxAvailability`.
 */

export interface SplitSession {
	/** Who must attend: the host plus the members assigned here. */
	memberIds: string[];
	/** Every slot (ISO, ascending) where all of `memberIds` can attend. */
	timestamps: string[];
	/** The longest contiguous run within `timestamps`. */
	longestRun: string[];
}

export interface SplitBestTimesOption {
	sessions: SplitSession[];
}

export interface SplitBestTimes {
	/** Best first. Empty when one slot already fits everyone reachable, or the host is never free. */
	options: SplitBestTimesOption[];
	/** Responders never free while the host is; no split can include them. */
	unreachableMemberIds: string[];
}

export interface SplitBestTimesInput {
	availabilityDates: readonly ZotDate[];
	ifNeededDates: readonly ZotDate[];
	hostId: string;
	/** The members to cover (responders). Ids outside this list are ignored. */
	memberIds: readonly string[];
	/** Exhaustive search up to this many sessions; beyond it, one greedy cover. */
	maxSessions?: number;
	maxOptions?: number;
}

/** Combinations evaluated before the exhaustive search gives up on a size. */
const SEARCH_BUDGET = 200_000;
/** Cover candidates that get the (costlier) member assignment pass. */
const ASSIGN_CANDIDATES = 12;
const SLOT_MS = BLOCK_LENGTH * 60_000;

type Bits = Uint32Array;

const newBits = (words: number): Bits => new Uint32Array(words);
const setBit = (b: Bits, i: number) => {
	b[i >>> 5] |= 1 << (i & 31);
};
const hasBit = (b: Bits, i: number) => (b[i >>> 5] & (1 << (i & 31))) !== 0;
const bitsKey = (b: Bits) => b.join(",");

function isSubset(a: Bits, b: Bits): boolean {
	for (let w = 0; w < a.length; w++) if ((a[w] & ~b[w]) !== 0) return false;
	return true;
}

function orInto(target: Bits, src: Bits): void {
	for (let w = 0; w < target.length; w++) target[w] |= src[w];
}

function equals(a: Bits, b: Bits): boolean {
	for (let w = 0; w < a.length; w++) if (a[w] !== b[w]) return false;
	return true;
}

function popcount(b: Bits): number {
	let count = 0;
	for (let w = 0; w < b.length; w++) {
		let v = b[w];
		while (v) {
			v &= v - 1;
			count++;
		}
	}
	return count;
}

interface Slot {
	ts: string;
	bits: Bits;
}

interface CandidateSet {
	bits: Bits;
	/** Host slots whose attendees are a superset of `bits`. */
	slotCount: number;
}

/** The longest run of slots that are back to back. `timestamps` must be ascending. */
export function longestContiguousRun(timestamps: readonly string[]): string[] {
	let best: string[] = [];
	let run: string[] = [];
	let prev = Number.NaN;
	for (const ts of timestamps) {
		const t = Date.parse(ts);
		if (run.length > 0 && t - prev === SLOT_MS) {
			run.push(ts);
		} else {
			run = [ts];
		}
		if (run.length > best.length) best = run;
		prev = t;
	}
	return [...best];
}

export function computeSplitBestTimes({
	availabilityDates,
	ifNeededDates,
	hostId,
	memberIds,
	maxSessions = 3,
	maxOptions = 3,
}: SplitBestTimesInput): SplitBestTimes {
	const indexOf = new Map<string, number>();
	for (const id of memberIds) {
		if (!indexOf.has(id)) indexOf.set(id, indexOf.size);
	}
	const ids = [...indexOf.keys()];
	const hostIndex = indexOf.get(hostId);
	const nonHost = ids.filter((id) => id !== hostId);
	if (hostIndex === undefined) {
		return { options: [], unreachableMemberIds: nonHost };
	}
	const words = Math.max(1, Math.ceil(ids.length / 32));

	// Who can attend each slot (available or if-needed).
	const bySlot = new Map<string, Bits>();
	const addDay = (day: ZotDate | undefined) => {
		for (const [ts, attendees] of Object.entries(
			day?.groupAvailability ?? {},
		)) {
			let bits = bySlot.get(ts);
			for (const id of attendees) {
				const i = indexOf.get(id);
				if (i === undefined) continue;
				if (!bits) {
					bits = newBits(words);
					bySlot.set(ts, bits);
				}
				setBit(bits, i);
			}
		}
	};
	for (const day of availabilityDates) addDay(day);
	for (const day of ifNeededDates) addDay(day);

	const hostSlots: Slot[] = [];
	for (const [ts, bits] of bySlot) {
		if (hasBit(bits, hostIndex)) hostSlots.push({ ts, bits });
	}
	hostSlots.sort((a, b) => (a.ts < b.ts ? -1 : a.ts > b.ts ? 1 : 0));

	// Distinct attendee sets, then only the maximal ones: a subset of another
	// set never helps a cover.
	const distinct = new Map<string, Bits>();
	for (const { bits } of hostSlots) distinct.set(bitsKey(bits), bits);
	const bySize = [...distinct.entries()]
		.map(([key, bits]) => ({ key, bits, size: popcount(bits) }))
		.sort((a, b) => b.size - a.size || (a.key < b.key ? -1 : 1));
	const maximal: CandidateSet[] = [];
	for (const { bits } of bySize) {
		if (maximal.some((m) => isSubset(bits, m.bits))) continue;
		const slotCount = hostSlots.filter((s) => isSubset(bits, s.bits)).length;
		maximal.push({ bits, slotCount });
	}

	const target = newBits(words);
	for (const m of maximal) orInto(target, m.bits);
	const unreachableMemberIds = nonHost.filter(
		(id) => !hasBit(target, indexOf.get(id) as number),
	);

	// One slot already fits everyone reachable: the plain best-times view covers it.
	if (maximal.length <= 1 || maximal.some((m) => equals(m.bits, target))) {
		return { options: [], unreachableMemberIds };
	}

	const covers = findCovers(maximal, target, words, maxSessions);
	const ranked = covers
		.sort((a, b) => coverScore(b, maximal) - coverScore(a, maximal))
		.slice(0, ASSIGN_CANDIDATES)
		.map((cover) =>
			assignMembers(
				cover.map((i) => maximal[i].bits),
				target,
				hostIndex,
				ids,
				hostSlots,
			),
		);

	const seen = new Set<string>();
	const options = ranked
		.sort((a, b) => optionScore(b) - optionScore(a))
		.filter((option) => {
			const key = option.sessions
				.map((s) => [...s.memberIds].sort().join(","))
				.sort()
				.join("|");
			if (seen.has(key)) return false;
			seen.add(key);
			return true;
		})
		.slice(0, maxOptions);

	return { options, unreachableMemberIds };
}

/** Indices into `sets`: every cover of the smallest size up to `maxSessions`, else one greedy cover. */
function findCovers(
	sets: readonly CandidateSet[],
	target: Bits,
	words: number,
	maxSessions: number,
): number[][] {
	for (let k = 2; k <= Math.min(maxSessions, sets.length); k++) {
		const found: number[][] = [];
		let budget = SEARCH_BUDGET;
		const pick = (start: number, chosen: number[], union: Bits) => {
			if (budget <= 0) return;
			if (chosen.length === k) {
				budget--;
				if (equals(union, target)) found.push([...chosen]);
				return;
			}
			for (let i = start; i <= sets.length - (k - chosen.length); i++) {
				const next = union.slice();
				orInto(next, sets[i].bits);
				chosen.push(i);
				pick(i + 1, chosen, next);
				chosen.pop();
			}
		};
		pick(0, [], newBits(words));
		if (found.length > 0) return found;
	}

	// Greedy set cover: each step takes the set adding the most uncovered members.
	const cover: number[] = [];
	const union = newBits(words);
	while (!equals(union, target)) {
		let bestIndex = -1;
		let bestGain = 0;
		sets.forEach((set, i) => {
			const next = union.slice();
			orInto(next, set.bits);
			const gain = popcount(next) - popcount(union);
			if (gain > bestGain) {
				bestGain = gain;
				bestIndex = i;
			}
		});
		if (bestIndex < 0) break;
		cover.push(bestIndex);
		orInto(union, sets[bestIndex].bits);
	}
	return [cover];
}

/** Cheap pre-assignment ranking: the weakest session's slot count leads. */
function coverScore(cover: readonly number[], sets: readonly CandidateSet[]) {
	const counts = cover.map((i) => sets[i].slotCount);
	return Math.min(...counts) * 10_000 + counts.reduce((a, b) => a + b, 0);
}

function optionScore({ sessions }: SplitBestTimesOption): number {
	const runs = sessions.map((s) => s.longestRun.length);
	const total = sessions.reduce((sum, s) => sum + s.timestamps.length, 0);
	return Math.min(...runs) * 1_000_000 + total;
}

/**
 * Required at exactly one session each: members only one set contains go
 * there; the rest, most-constrained first, go wherever leaves the widest
 * window. Every window stays non-empty because each session's required
 * members are a subset of a set some slot actually has.
 */
function assignMembers(
	sessionSets: readonly Bits[],
	target: Bits,
	hostIndex: number,
	ids: readonly string[],
	hostSlots: readonly Slot[],
): SplitBestTimesOption {
	const sessions = sessionSets.map(() => ({
		members: [hostIndex],
		slots: [...hostSlots],
	}));

	const toAssign: { member: number; choices: number[] }[] = [];
	for (let m = 0; m < ids.length; m++) {
		if (m === hostIndex || !hasBit(target, m)) continue;
		const choices = sessionSets.flatMap((set, i) =>
			hasBit(set, m) ? [i] : [],
		);
		toAssign.push({ member: m, choices });
	}
	toAssign.sort((a, b) => a.choices.length - b.choices.length);

	for (const { member, choices } of toAssign) {
		let best = choices[0];
		let bestSlots: Slot[] | null = null;
		for (const i of choices) {
			const slots = sessions[i].slots.filter((s) => hasBit(s.bits, member));
			const better =
				!bestSlots ||
				slots.length > bestSlots.length ||
				(slots.length === bestSlots.length &&
					sessions[i].members.length < sessions[best].members.length);
			if (better) {
				best = i;
				bestSlots = slots;
			}
		}
		sessions[best].members.push(member);
		sessions[best].slots = bestSlots ?? [];
	}

	return {
		sessions: sessions
			// Only the greedy fallback can leave a session with nobody but the host.
			.filter(({ members }) => members.length > 1)
			.map(({ members, slots }) => {
				const timestamps = slots.map((s) => s.ts);
				return {
					memberIds: members.map((m) => ids[m]),
					timestamps,
					longestRun: longestContiguousRun(timestamps),
				};
			})
			.sort((a, b) => (a.longestRun[0] < b.longestRun[0] ? -1 : 1)),
	};
}
