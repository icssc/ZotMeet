"use client";

import {
	createContext,
	useCallback,
	useContext,
	useMemo,
	useState,
} from "react";
import type { SelectionEdges } from "@/components/availability/group-availability";
import type { StudyRoomApiEntry } from "@/components/availability/room-recommendations";
import {
	BLOCK_LENGTH,
	formatScheduledTimeRange,
	generateCellKey,
	getTimestampFromBlockIndex,
} from "@/lib/availability/utils";
import type { ZotDate } from "@/lib/zotdate";

export interface HoveredRoomCellPreview {
	edges: SelectionEdges;
	label?: {
		title: string;
		timeRange: string;
		blockCount: number;
	};
}

interface StudyRoomHoverContextValue {
	cellPreviewByKey: Map<string, HoveredRoomCellPreview>;
	setHoveredRoom: (variants: StudyRoomApiEntry[] | null) => void;
}

const StudyRoomHoverContext = createContext<StudyRoomHoverContextValue>({
	cellPreviewByKey: new Map(),
	setHoveredRoom: () => {},
});

function displayRoomName(name: string): string {
	return name.replace(/\s*\(\d+\s*hours?\)/i, "").trim() || name;
}

function buildHoveredRoomPreview(
	filteredVariants: StudyRoomApiEntry[] | null,
	fromTimeMinutes: number,
	availabilityDates: ZotDate[],
	blockCount: number,
	timeZone: string,
): Map<string, HoveredRoomCellPreview> {
	if (!filteredVariants?.length) return new Map();

	const covered = new Set<string>();
	const cellTimestamps = new Map<string, string>();

	for (let d = 0; d < availabilityDates.length; d++) {
		for (let b = 0; b < blockCount; b++) {
			const cellIso = getTimestampFromBlockIndex(
				b,
				d,
				fromTimeMinutes,
				availabilityDates,
				timeZone,
			);
			if (!cellIso) continue;

			const cellStart = new Date(cellIso);
			const cellEnd = new Date(cellStart.getTime() + BLOCK_LENGTH * 60_000);

			for (const variant of filteredVariants) {
				let matched = false;
				for (const slot of variant.slots) {
					const slotStart = new Date(slot.start);
					const slotEnd = new Date(slot.end);
					if (slotStart < cellEnd && slotEnd > cellStart) {
						const key = generateCellKey(d, b);
						covered.add(key);
						cellTimestamps.set(key, cellIso);
						matched = true;
						break;
					}
				}
				if (matched) break;
			}
		}
	}

	if (covered.size === 0) return new Map();

	const roomTitle = displayRoomName(filteredVariants[0]?.name ?? "Room");
	const previewByKey = new Map<string, HoveredRoomCellPreview>();

	for (const key of covered) {
		const [dStr, bStr] = key.split("_");
		const d = Number(dStr);
		const b = Number(bStr);

		const edges: SelectionEdges = {
			top: !covered.has(generateCellKey(d, b - 1)),
			bottom: !covered.has(generateCellKey(d, b + 1)),
			left: !covered.has(generateCellKey(d - 1, b)),
			right: !covered.has(generateCellKey(d + 1, b)),
		};

		let label: HoveredRoomCellPreview["label"];
		if (edges.top) {
			let blockCountInRun = 1;
			let nextBlock = b + 1;
			while (covered.has(generateCellKey(d, nextBlock))) {
				blockCountInRun++;
				nextBlock++;
			}

			const timestamps: string[] = [];
			for (let i = 0; i < blockCountInRun; i++) {
				const ts = cellTimestamps.get(generateCellKey(d, b + i));
				if (ts) timestamps.push(ts);
			}

			label = {
				title: roomTitle,
				timeRange: formatScheduledTimeRange(timestamps),
				blockCount: blockCountInRun,
			};
		}

		previewByKey.set(key, { edges, label });
	}

	return previewByKey;
}

interface StudyRoomHoverProviderProps {
	children: React.ReactNode;
	fromTimeMinutes: number;
	availabilityDates: ZotDate[];
	availabilityTimeBlocks: number[];
	timeZone: string;
}

export function StudyRoomHoverProvider({
	children,
	fromTimeMinutes,
	availabilityDates,
	availabilityTimeBlocks,
	timeZone,
}: StudyRoomHoverProviderProps) {
	const [hoveredRoomVariants, setHoveredRoomVariants] = useState<
		StudyRoomApiEntry[] | null
	>(null);

	const filteredRoomVariants = useMemo(() => {
		if (!hoveredRoomVariants) return null;

		return hoveredRoomVariants.map((variant) => ({
			...variant,
			slots: variant.slots.filter((slot) => slot.isAvailable),
		}));
	}, [hoveredRoomVariants]);

	const cellPreviewByKey = useMemo(
		() =>
			buildHoveredRoomPreview(
				filteredRoomVariants,
				fromTimeMinutes,
				availabilityDates,
				availabilityTimeBlocks.length,
				timeZone,
			),
		[
			filteredRoomVariants,
			fromTimeMinutes,
			availabilityDates,
			availabilityTimeBlocks.length,
			timeZone,
		],
	);

	const setHoveredRoom = useCallback((variants: StudyRoomApiEntry[] | null) => {
		setHoveredRoomVariants(variants);
	}, []);

	const value = useMemo(
		() => ({
			cellPreviewByKey,
			setHoveredRoom,
		}),
		[cellPreviewByKey, setHoveredRoom],
	);

	return (
		<StudyRoomHoverContext.Provider value={value}>
			{children}
		</StudyRoomHoverContext.Provider>
	);
}

// Hooks

export function useStudyRoomHover() {
	return useContext(StudyRoomHoverContext);
}

export function useHoveredRoomPreview(
	dateIndex: number,
	blockIndex: number,
): HoveredRoomCellPreview | null {
	const { cellPreviewByKey } = useStudyRoomHover();
	return cellPreviewByKey.get(generateCellKey(dateIndex, blockIndex)) ?? null;
}
