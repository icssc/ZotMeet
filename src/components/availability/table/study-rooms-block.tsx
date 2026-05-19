"use client";

import { GridPreviewOverlay } from "@/components/availability/table/grid-preview-overlay";
import { useHoveredRoomPreview } from "@/components/availability/table/study-room-hover-context";
import { cn } from "@/lib/utils";

interface StudyRoomsBlockProps {
	dateIndex: number;
	blockIndex: number;
}

export function StudyRoomsBlock({
	dateIndex,
	blockIndex,
}: StudyRoomsBlockProps) {
	const preview = useHoveredRoomPreview(dateIndex, blockIndex);

	if (!preview) {
		return null;
	}

	return (
		<div
			className={cn(
				"pointer-events-none absolute inset-0",
				preview.edges.top && "z-[1]",
			)}
		>
			<GridPreviewOverlay
				edges={preview.edges}
				title={preview.label?.title}
				timeRange={preview.label?.timeRange}
				blockCount={preview.label?.blockCount}
				showTopLabel={preview.edges.top && !!preview.label}
			/>
		</div>
	);
}
