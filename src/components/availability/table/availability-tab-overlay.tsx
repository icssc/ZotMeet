"use client";

import { ScheduledTabOverlay } from "@/components/availability/table/scheduled-tab-overlay";

export type AvailabilityTabLabel = {
	title?: string;
	timeRange?: string;
	blockCount: number;
};

/** Renders the scheduled meeting's navy tab over a grid cell. */
export function AvailabilityTabOverlay({
	tab,
}: {
	tab: AvailabilityTabLabel | null;
}) {
	if (!tab) {
		return null;
	}

	return (
		<div className="pointer-events-none absolute inset-0 z-20">
			<ScheduledTabOverlay
				title={tab.title}
				timeRange={tab.timeRange}
				blockCount={tab.blockCount}
			/>
		</div>
	);
}
