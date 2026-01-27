import { memo } from "react";
import { cn } from "@/lib/utils";

interface GroupAvailabilityBlockProps {
	className?: string;
	tableCellStyles?: string;
	onClick: VoidFunction;
	onHover?: VoidFunction;
	onMouseDown?: VoidFunction;
	onMouseMove?: VoidFunction;
	onMouseUp?: VoidFunction;
	onTouchStart?: (e: React.TouchEvent) => void;
	onTouchMove?: (e: React.TouchEvent) => void;
	onTouchEnd?: (e: React.TouchEvent) => void;
	blockColor: string;
	hasSpacerBefore?: boolean;
	isScheduled?: boolean;
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
		onMouseDown,
		onMouseMove,
		onMouseUp,
		onTouchStart,
		onTouchMove,
		onTouchEnd,
		blockColor,
		hasSpacerBefore = false,
		dateIndex,
		blockIndex,
	}: GroupAvailabilityBlockProps) => {
		return (
			<button
				type="button"
				className={cn(
					"h-full w-full border-gray-medium border-r-[1px] transition-opacity duration-200 [touch-action:pinch-zoom]",
					hasSpacerBefore && "border-l-[1px] border-l-gray-medium",
					tableCellStyles,
					className,
				)}
				onClick={onClick}
				onMouseEnter={onHover}
				onMouseDown={onMouseDown}
				onMouseMove={onMouseMove}
				onMouseUp={onMouseUp}
				onTouchStart={onTouchStart}
				onTouchMove={onTouchMove}
				onTouchEnd={onTouchEnd}
			>
				<div
					className={cn("block h-full w-full py-2")}
					style={{ background: blockColor }}
					data-date-index={dateIndex}
					data-block-index={blockIndex}
				/>
			</button>
		);
	},
);

GroupAvailabilityBlock.displayName = "GroupAvailabilityBlock";
