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
		onPointerDown,
		onPointerMove,
		onPointerUp,
		blockColor,
		hasSpacerBefore = false,
		dateIndex,
		blockIndex,
	}: GroupAvailabilityBlockProps) => {
		return (
			<button
				type="button"
				className={cn(
					"h-full w-full border-gray-medium border-r-[1px] transition-opacity duration-200 [touch-action:none]",
					hasSpacerBefore && "border-l-[1px] border-l-gray-medium",
					tableCellStyles,
					className,
				)}
				onClick={onClick}
				onMouseEnter={onHover}
				onPointerDown={onPointerDown}
				onPointerMove={onPointerMove}
				onPointerUp={onPointerUp}
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
