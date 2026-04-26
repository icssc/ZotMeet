import { Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { memo } from "react";
import { cn } from "@/lib/utils";

interface GroupAvailabilityBlockProps {
	className?: string;
	tableCellStyles?: string;
	onClick: VoidFunction;
	onHover?: VoidFunction;
	onPointerDown?: React.PointerEventHandler<HTMLElement>;
	onPointerMove?: React.PointerEventHandler<HTMLElement>;
	onPointerUp?: React.PointerEventHandler<HTMLElement>;
	onPointerCancel?: React.PointerEventHandler<HTMLElement>;
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
		const theme = useTheme();
		const dashColor = theme.palette.secondary.main;

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
				/>
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
