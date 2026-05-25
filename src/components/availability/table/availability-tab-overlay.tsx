"use client";

import { ScheduledTabOverlay } from "@/components/availability/table/scheduled-tab-overlay";
import { useRoomCellPreview } from "@/components/availability/table/study-room-hover-context";

export type AvailabilityTabLabel = {
	title?: string;
	timeRange?: string;
	blockCount: number;
};

/**
 * Resolves the navy tab overlay for a grid cell from either a scheduled meeting
 * (passed in), a clicked/selected study room, or a hovered one (from context).
 * Hover wins over selected; both win over scheduled.
 */
export function useAvailabilityTabOverlay(
	dateIndex: number,
	blockIndex: number,
	scheduledTab: AvailabilityTabLabel | null | undefined,
): { tab: AvailabilityTabLabel | null; raiseZ: boolean } {
	const roomPreview = useRoomCellPreview(dateIndex, blockIndex);

	const roomTab: AvailabilityTabLabel | null = roomPreview?.label
		? {
				title: roomPreview.label.title,
				timeRange: roomPreview.label.timeRange,
				blockCount: roomPreview.label.blockCount,
			}
		: null;

	const tab = roomTab ?? scheduledTab ?? null;

	return { tab, raiseZ: Boolean(tab) };
}

interface AvailabilityTabOverlayProps {
	tab: AvailabilityTabLabel | null;
}

/** Navy scheduling tab — shared by scheduled meetings and study-room preview. */
export function AvailabilityTabOverlay({ tab }: AvailabilityTabOverlayProps) {
	if (!tab) {
		return null;
	}

	return (
		<div className="pointer-events-none absolute inset-0 z-[1]">
			<ScheduledTabOverlay
				title={tab.title}
				timeRange={tab.timeRange}
				blockCount={tab.blockCount}
			/>
		</div>
	);
}

interface AvailabilityTabOverlayCellProps {
	dateIndex: number;
	blockIndex: number;
	scheduledTab?: AvailabilityTabLabel | null;
}

/** Convenience wrapper when the parent does not need `raiseZ` for layout. */
export function AvailabilityTabOverlayCell({
	dateIndex,
	blockIndex,
	scheduledTab = null,
}: AvailabilityTabOverlayCellProps) {
	const { tab } = useAvailabilityTabOverlay(
		dateIndex,
		blockIndex,
		scheduledTab,
	);
	return <AvailabilityTabOverlay tab={tab} />;
}
