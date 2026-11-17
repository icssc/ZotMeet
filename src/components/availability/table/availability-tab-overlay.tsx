"use client";

import { ScheduledTabOverlay } from "@/components/availability/table/scheduled-tab-overlay";
import { useRoomCellPreview } from "@/components/availability/table/study-room-hover-context";
import { cn } from "@/lib/utils";

export type AvailabilityTabLabel = {
	title?: string;
	timeRange?: string;
	blockCount: number;
};

/** z-index layers within a grid cell (bottom → top). */
export const TAB_LAYER_Z = {
	room: "z-10",
	schedule: "z-20",
} as const;

/**
 * Resolves navy tab overlays for a grid cell from scheduled meeting (passed in),
 * a selected study room, or a hovered one (from context).
 */
export function useAvailabilityTabOverlay(
	dateIndex: number,
	blockIndex: number,
	scheduledTab: AvailabilityTabLabel | null | undefined,
): {
	roomTab: AvailabilityTabLabel | null;
	scheduledTab: AvailabilityTabLabel | null;
} {
	const roomPreview = useRoomCellPreview(dateIndex, blockIndex);

	const roomTab: AvailabilityTabLabel | null = roomPreview?.label
		? {
				title: roomPreview.label.title,
				timeRange: roomPreview.label.timeRange,
				blockCount: roomPreview.label.blockCount,
			}
		: null;

	const resolvedScheduled = scheduledTab ?? null;

	return {
		roomTab,
		scheduledTab: resolvedScheduled,
	};
}

interface AvailabilityTabOverlayProps {
	scheduledTab: AvailabilityTabLabel | null;
	roomTab?: AvailabilityTabLabel | null;
}

function TabLayer({
	tab,
	className,
}: {
	tab: AvailabilityTabLabel;
	className?: string;
}) {
	return (
		<div className={cn("pointer-events-none absolute inset-0", className)}>
			<ScheduledTabOverlay
				title={tab.title}
				timeRange={tab.timeRange}
				blockCount={tab.blockCount}
			/>
		</div>
	);
}

/**
 * Renders study-room and/or scheduled-meeting navy tabs.
 * Layer order (bottom → top): room preview, then scheduled meeting.
 */
export function AvailabilityTabOverlay({
	scheduledTab,
	roomTab = null,
}: AvailabilityTabOverlayProps) {
	if (scheduledTab && roomTab) {
		return (
			<>
				<TabLayer tab={roomTab} className={TAB_LAYER_Z.room} />
				<TabLayer tab={scheduledTab} className={TAB_LAYER_Z.schedule} />
			</>
		);
	}

	const tab = scheduledTab ?? roomTab;

	if (!tab) {
		return null;
	}

	return (
		<TabLayer
			tab={tab}
			className={scheduledTab ? TAB_LAYER_Z.schedule : TAB_LAYER_Z.room}
		/>
	);
}

interface AvailabilityTabOverlayCellProps {
	dateIndex: number;
	blockIndex: number;
	scheduledTab?: AvailabilityTabLabel | null;
}

/** Convenience wrapper for personal view cells (room preview only). */
export function AvailabilityTabOverlayCell({
	dateIndex,
	blockIndex,
	scheduledTab = null,
}: AvailabilityTabOverlayCellProps) {
	const { roomTab, scheduledTab: resolvedScheduled } =
		useAvailabilityTabOverlay(dateIndex, blockIndex, scheduledTab);
	return (
		<AvailabilityTabOverlay
			scheduledTab={resolvedScheduled}
			roomTab={roomTab}
		/>
	);
}
