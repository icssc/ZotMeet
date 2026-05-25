"use client";

import { ScheduledTabOverlay } from "@/components/availability/table/scheduled-tab-overlay";
import { useRoomCellPreview } from "@/components/availability/table/study-room-hover-context";
import { cn } from "@/lib/utils";

export type AvailabilityTabLabel = {
	title?: string;
	timeRange?: string;
	blockCount: number;
};

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
	raiseZ: boolean;
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
		raiseZ: Boolean(roomTab || resolvedScheduled),
	};
}

interface AvailabilityTabOverlayProps {
	scheduledTab: AvailabilityTabLabel | null;
	roomTab?: AvailabilityTabLabel | null;
	/** When true, render both tabs with the meeting block above the room block. */
	stackScheduleOnTop?: boolean;
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

/** Navy scheduling tab — shared by scheduled meetings and study-room preview. */
export function AvailabilityTabOverlay({
	scheduledTab,
	roomTab = null,
	stackScheduleOnTop = false,
}: AvailabilityTabOverlayProps) {
	if (stackScheduleOnTop && scheduledTab && roomTab) {
		return (
			<>
				<TabLayer tab={roomTab} className="z-[5]" />
				<TabLayer tab={scheduledTab} className="z-[10]" />
			</>
		);
	}

	const tab = stackScheduleOnTop
		? (scheduledTab ?? roomTab)
		: (roomTab ?? scheduledTab);

	if (!tab) {
		return null;
	}

	return <TabLayer tab={tab} className="z-[1]" />;
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
	const { roomTab, scheduledTab: resolvedScheduled } =
		useAvailabilityTabOverlay(dateIndex, blockIndex, scheduledTab);
	return (
		<AvailabilityTabOverlay
			scheduledTab={resolvedScheduled}
			roomTab={roomTab}
		/>
	);
}
