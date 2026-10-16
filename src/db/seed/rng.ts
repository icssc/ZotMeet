export interface Rng {
	next(): number;
	int(min: number, max: number): number;
	chance(p: number): boolean;
	pick<T>(items: readonly T[]): T;
	shuffle<T>(items: readonly T[]): T[];
	sample<T>(items: readonly T[], count: number): T[];
}

export function createRng(seed: number): Rng {
	let state = seed >>> 0;

	const next = (): number => {
		state = (state + 0x6d2b79f5) >>> 0;
		let t = state;
		t = Math.imul(t ^ (t >>> 15), t | 1);
		t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};

	const int = (min: number, max: number): number =>
		min + Math.floor(next() * (max - min + 1));

	const shuffle = <T>(items: readonly T[]): T[] => {
		const copy = [...items];
		for (let i = copy.length - 1; i > 0; i--) {
			const j = int(0, i);
			[copy[i], copy[j]] = [copy[j], copy[i]];
		}
		return copy;
	};

	return {
		next,
		int,
		chance: (p) => next() < p,
		pick: (items) => items[int(0, items.length - 1)],
		shuffle,
		sample: (items, count) => shuffle(items).slice(0, count),
	};
}
