"use client";

import {
	createContext,
	useCallback,
	useContext,
	useEffect,
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
	setHoveredRoom: (variants: StudyRoomApiEntry[] | null) => void;
}

const StudyRoomHoverContext = createContext<StudyRoomHoverContextValue>({
	setHoveredRoom: () => {},
});

function displayRoomName(name: string): string {
	return name.replace(/\s*\(\d+\s*hours?\)/i, "").trim() || name;
}

function filterAvailableVariants(
	variants: StudyRoomApiEntry[] | null,
): StudyRoomApiEntry[] | null {
	if (!variants?.length) return null;

	return variants.map((variant) => ({
		...variant,
		slots: variant.slots.filter((slot) => slot.isAvailable),
	}));
}

export function buildRoomCellPreview(
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

function mergeCellPreviewMaps(
	maps: Map<string, HoveredRoomCellPreview>[],
): Map<string, HoveredRoomCellPreview> {
	const merged = new Map<string, HoveredRoomCellPreview>();

	for (const map of maps) {
		for (const [key, preview] of map) {
			const existing = merged.get(key);
			if (!existing) {
				merged.set(key, preview);
				continue;
			}

			merged.set(key, {
				edges: existing.edges,
				label: existing.label ?? preview.label,
			});
		}
	}

	return merged;
}

interface StudyRoomHoverProviderProps {
	children: React.ReactNode;
	showRoomPreviews: boolean;
	fromTimeMinutes: number;
	availabilityDates: ZotDate[];
	availabilityTimeBlocks: number[];
	timeZone: string;
	rawRoomsByKey: Map<string, StudyRoomApiEntry[]>;
	selectedRoomIds: string[];
}

export function StudyRoomHoverProvider({
	children,
	showRoomPreviews,
	fromTimeMinutes,
	availabilityDates,
	availabilityTimeBlocks,
	timeZone,
	rawRoomsByKey,
	selectedRoomIds,
}: StudyRoomHoverProviderProps) {
	const [hoveredRoomVariants, setHoveredRoomVariants] = useState<
		StudyRoomApiEntry[] | null
	>(null);

	const emptyPreviewMap = useMemo(
		() => new Map<string, HoveredRoomCellPreview>(),
		[],
	);

	useEffect(() => {
		if (!showRoomPreviews) {
			setHoveredRoomVariants(null);
		}
	}, [showRoomPreviews]);

	const buildPreview = useCallback(
		(variants: StudyRoomApiEntry[] | null) =>
			buildRoomCellPreview(
				filterAvailableVariants(variants),
				fromTimeMinutes,
				availabilityDates,
				availabilityTimeBlocks.length,
				timeZone,
			),
		[
			fromTimeMinutes,
			availabilityDates,
			availabilityTimeBlocks.length,
			timeZone,
		],
	);

	const hoverCellPreviewByKey = useMemo(
		() =>
			showRoomPreviews ? buildPreview(hoveredRoomVariants) : emptyPreviewMap,
		[showRoomPreviews, buildPreview, hoveredRoomVariants, emptyPreviewMap],
	);

	const selectedCellPreviewByKey = useMemo(() => {
		if (!showRoomPreviews) return emptyPreviewMap;
		const perRoom = selectedRoomIds.map((roomId) =>
			buildPreview(rawRoomsByKey.get(roomId) ?? null),
		);
		return mergeCellPreviewMaps(perRoom);
	}, [
		showRoomPreviews,
		buildPreview,
		rawRoomsByKey,
		selectedRoomIds,
		emptyPreviewMap,
	]);

	const setHoveredRoom = useCallback((variants: StudyRoomApiEntry[] | null) => {
		setHoveredRoomVariants(variants);
	}, []);

	const value = useMemo(() => ({ setHoveredRoom }), [setHoveredRoom]);

	const previewMapsValue = useMemo(
		() => ({ hoverCellPreviewByKey, selectedCellPreviewByKey }),
		[hoverCellPreviewByKey, selectedCellPreviewByKey],
	);

	return (
		<StudyRoomHoverContext.Provider value={value}>
			<StudyRoomPreviewMapsContext.Provider value={previewMapsValue}>
				{children}
			</StudyRoomPreviewMapsContext.Provider>
		</StudyRoomHoverContext.Provider>
	);
}

interface StudyRoomPreviewMapsContextValue {
	hoverCellPreviewByKey: Map<string, HoveredRoomCellPreview>;
	selectedCellPreviewByKey: Map<string, HoveredRoomCellPreview>;
}

const StudyRoomPreviewMapsContext =
	createContext<StudyRoomPreviewMapsContextValue>({
		hoverCellPreviewByKey: new Map(),
		selectedCellPreviewByKey: new Map(),
	});

// Hooks

export function useStudyRoomHover() {
	return useContext(StudyRoomHoverContext);
}

export function useStudyRoomPreviewMaps() {
	return useContext(StudyRoomPreviewMapsContext);
}

export function useRoomCellPreview(
	dateIndex: number,
	blockIndex: number,
): HoveredRoomCellPreview | null {
	const { hoverCellPreviewByKey, selectedCellPreviewByKey } = useContext(
		StudyRoomPreviewMapsContext,
	);
	const key = generateCellKey(dateIndex, blockIndex);
	return (
		hoverCellPreviewByKey.get(key) ?? selectedCellPreviewByKey.get(key) ?? null
	);
}

/** @deprecated Use useRoomCellPreview */
export function useHoveredRoomPreview(
	dateIndex: number,
	blockIndex: number,
): HoveredRoomCellPreview | null {
	return useRoomCellPreview(dateIndex, blockIndex);
}
