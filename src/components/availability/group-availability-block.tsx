import { Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import type React from "react";
import { memo, useMemo } from "react";
import type { SelectionEdges } from "@/components/availability/group-availability";
import type { GridCell } from "@/hooks/use-grid-drag-selection";
import { cn } from "@/lib/utils";

export type BlockFill =
	| { kind: "none" }
	| { kind: "solid"; color: string }
	| { kind: "stripes"; opacity: number };

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
		const theme = useTheme();
		const dashColor = theme.palette.secondary.main;

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
					"relative h-full w-full border-gray-medium border-r-[1px] transition-opacity duration-200 [touch-action:none]",
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
					{fill.kind !== "stripes" && (
						<div className="absolute inset-0 bg-paper" />
					)}
					{fill.kind === "solid" && (
						<div
							className="absolute inset-0"
							style={{ background: fill.color }}
						/>
					)}
					{fill.kind === "stripes" && fill.opacity < 1 && (
						<div
							className="absolute inset-0 bg-paper"
							style={{ opacity: 1 - fill.opacity }}
						/>
					)}
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
					<svg
						aria-hidden="true"
						className="pointer-events-none absolute inset-0"
						width="100%"
						height="100%"
						overflow="visible"
					>
						<line
							x1="1"
							y1="0"
							x2="1"
							y2="100%"
							stroke={dashColor}
							strokeWidth="2"
							strokeDasharray="12 6"
						/>
						<line
							x1="calc(100% - 1px)"
							y1="0"
							x2="calc(100% - 1px)"
							y2="100%"
							stroke={dashColor}
							strokeWidth="2"
							strokeDasharray="12 6"
						/>
						{isScheduledTopEdge && (
							<line
								x1="0"
								y1="1"
								x2="100%"
								y2="1"
								stroke={dashColor}
								strokeWidth="2"
								strokeDasharray="12 6"
							/>
						)}
						{isScheduledBottomEdge && (
							<line
								x1="0"
								y1="calc(100% - 1px)"
								x2="100%"
								y2="calc(100% - 1px)"
								stroke={dashColor}
								strokeWidth="2"
								strokeDasharray="12 6"
							/>
						)}
					</svg>
				)}
				{isScheduledTopEdge &&
					(scheduledMeetingTitle || scheduledTimeRange) && (
						<div
							aria-hidden="true"
							className="pointer-events-none absolute inset-x-0 top-0 z-[10] flex flex-col justify-between overflow-hidden p-1.5"
							style={{ height: `calc(${scheduledBlockCount} * 100%)` }}
						>
							{scheduledMeetingTitle && (
								<Typography
									variant="body1"
									sx={{
										display: "-webkit-box",
										WebkitLineClamp: 3,
										WebkitBoxOrient: "vertical",
										overflow: "hidden",
										lineHeight: 1.2,
										letterSpacing: "0.15px",
									}}
								>
									{scheduledMeetingTitle}
								</Typography>
							)}
							{scheduledTimeRange && (
								<Typography
									variant="caption"
									noWrap
									sx={{
										fontWeight: 500,
										lineHeight: 1,
										letterSpacing: "0.4px",
									}}
								>
									{scheduledTimeRange}
								</Typography>
							)}
						</div>
					)}
			</button>
		);
	},
);

GroupAvailabilityBlock.displayName = "GroupAvailabilityBlock";
