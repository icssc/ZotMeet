import { Typography } from "@mui/material";
import { memo } from "react";
import { cn } from "@/lib/utils";

interface GroupAvailabilityBlockProps {
	className?: string;
	tableCellStyles?: string;
	onClick: VoidFunction;
	onHover?: VoidFunction;
	onPointerDown?: (e: React.PointerEvent) => void;
	onPointerMove?: (e: React.PointerEvent) => void;
	onPointerUp?: (e: React.PointerEvent) => void;
	onPointerCancel?: (e: React.PointerEvent) => void;
	blockColor: string;
	hasSpacerBefore?: boolean;
	isScheduled?: boolean;
	isScheduledTopEdge?: boolean;
	isScheduledBottomEdge?: boolean;
	scheduledMeetingTitle?: string;
	scheduledTimeRange?: string;
	scheduledBlockCount?: number;
	isInSelectionRange?: boolean;
	dateIndex: number;
	blockIndex: number;
}

export const GroupAvailabilityBlock = memo(
	({
		tableCellStyles = "",
		className = "",
		onClick,
		onHover,
		onPointerDown,
		onPointerMove,
		onPointerUp,
		onPointerCancel,
		blockColor,
		hasSpacerBefore = false,
		isScheduled = false,
		isScheduledTopEdge = false,
		isScheduledBottomEdge = false,
		scheduledMeetingTitle,
		scheduledTimeRange,
		scheduledBlockCount = 1,
		dateIndex,
		blockIndex,
	}: GroupAvailabilityBlockProps) => {
		return (
			<button
				type="button"
				className={cn(
					"relative h-full w-full border-gray-medium border-r-[1px] transition-opacity duration-200 [touch-action:none]",
					hasSpacerBefore && "border-l-[1px] border-l-gray-medium",
					isScheduledTopEdge && "z-[1]",
					tableCellStyles,
					className,
				)}
				onClick={onClick}
				onMouseEnter={onHover}
				onPointerDown={onPointerDown}
				onPointerMove={onPointerMove}
				onPointerUp={onPointerUp}
				onPointerCancel={onPointerCancel}
				data-date-index={dateIndex}
				data-block-index={blockIndex}
			>
				<div
					className="pointer-events-none block h-full w-full py-2"
					style={{ background: blockColor }}
					data-date-index={dateIndex}
					data-block-index={blockIndex}
				/>
				{isScheduled && (
					<div
						aria-hidden="true"
						className={cn(
							"pointer-events-none absolute inset-0 animate-meeting-pulse border-primary border-x-2",
							isScheduledTopEdge && "border-t-2",
							isScheduledBottomEdge && "border-b-2",
						)}
					/>
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
