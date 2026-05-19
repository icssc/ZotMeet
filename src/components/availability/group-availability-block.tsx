import type React from "react";
import { memo, useMemo } from "react";
import type { SelectionEdges } from "@/components/availability/group-availability";
import { GridPreviewOverlay } from "@/components/availability/table/grid-preview-overlay";
import { StudyRoomsBlock } from "@/components/availability/table/study-rooms-block";
import type { GridCell } from "@/hooks/use-grid-drag-selection";
import { cn } from "@/lib/utils";

export type BlockFill = {
	solid: { color: string } | null;
	stripes: { opacity: number } | null;
};

export const EMPTY_FILL: BlockFill = { solid: null, stripes: null };

interface GroupAvailabilityBlockProps {
	className?: string;
	tableCellStyles?: string;
	onPointerDown?: React.PointerEventHandler<HTMLElement>;
	onPointerMove?: React.PointerEventHandler<HTMLElement>;
	onPointerUp?: React.PointerEventHandler<HTMLElement>;
	onPointerCancel?: React.PointerEventHandler<HTMLElement>;
	onKeyDown?: React.KeyboardEventHandler<HTMLElement>;
	onHoverCell?: (cell: GridCell) => void;
	fill: BlockFill;
	hasSpacerBefore?: boolean;
	isScheduled?: boolean;
	isScheduledTopEdge?: boolean;
	isScheduledBottomEdge?: boolean;
	scheduledMeetingTitle?: string;
	scheduledTimeRange?: string;
	scheduledBlockCount?: number;
	selectionEdges?: SelectionEdges | null;
	dateIndex: number;
	blockIndex: number;
}

const SELECTION_EDGE_WIDTH: Record<keyof SelectionEdges, string> = {
	top: "border-t-2",
	bottom: "border-b-2",
	left: "border-l",
	right: "border-r",
};

export const GroupAvailabilityBlock = memo(
	({
		tableCellStyles = "",
		className = "",
		onPointerDown,
		onPointerMove,
		onPointerUp,
		onPointerCancel,
		onKeyDown,
		onHoverCell,
		fill,
		hasSpacerBefore = false,
		isScheduled = false,
		isScheduledTopEdge = false,
		isScheduledBottomEdge = false,
		scheduledMeetingTitle,
		scheduledTimeRange,
		scheduledBlockCount = 1,
		selectionEdges = null,
		dateIndex,
		blockIndex,
	}: GroupAvailabilityBlockProps) => {
		const onMouseEnter = useMemo(
			() =>
				onHoverCell
					? () => onHoverCell({ zotDateIndex: dateIndex, blockIndex })
					: undefined,
			[onHoverCell, dateIndex, blockIndex],
		);
		return (
			<button
				type="button"
				tabIndex={0}
				className={cn(
					"relative h-full w-full select-none border-gray-medium border-r-[1px] [-webkit-tap-highlight-color:transparent] [-webkit-touch-callout:none] [touch-action:pan-x_pan-y]",
					hasSpacerBefore && "border-l-[1px] border-l-gray-medium",
					isScheduledTopEdge && "z-[1]",
					tableCellStyles,
					className,
				)}
				onMouseEnter={onMouseEnter}
				onPointerDown={onPointerDown}
				onPointerMove={onPointerMove}
				onPointerUp={onPointerUp}
				onPointerCancel={onPointerCancel}
				onKeyDown={onKeyDown}
				data-date-index={dateIndex}
				data-block-index={blockIndex}
			>
				<div
					className="pointer-events-none relative block h-full w-full py-2"
					data-date-index={dateIndex}
					data-block-index={blockIndex}
				>
					{!fill.stripes && <div className="absolute inset-0 bg-paper" />}
					{fill.stripes && fill.stripes.opacity < 1 && (
						<div
							className="absolute inset-0 bg-paper"
							style={{ opacity: 1 - fill.stripes.opacity }}
						/>
					)}
					{fill.solid && (
						<div
							className="absolute inset-0"
							style={{ background: fill.solid.color }}
						/>
					)}
					<StudyRoomsBlock dateIndex={dateIndex} blockIndex={blockIndex} />
				</div>
				{selectionEdges && (
					<div
						aria-hidden="true"
						className={cn(
							"pointer-events-none absolute inset-0 border-slate-medium border-dashed",
							selectionEdges.top && SELECTION_EDGE_WIDTH.top,
							selectionEdges.bottom && SELECTION_EDGE_WIDTH.bottom,
							selectionEdges.left && SELECTION_EDGE_WIDTH.left,
							selectionEdges.right && SELECTION_EDGE_WIDTH.right,
						)}
					/>
				)}
{isScheduled && (
	<GridPreviewOverlay
		edges={{
			top: isScheduledTopEdge,
			bottom: isScheduledBottomEdge,
			left: true,
			right: true,
		}}
		title={scheduledMeetingTitle}
		timeRange={scheduledTimeRange}
		blockCount={scheduledBlockCount}
		showTopLabel={isScheduledTopEdge}
	/>
)}
			</button>
		);
	},
);

GroupAvailabilityBlock.displayName = "GroupAvailabilityBlock";
