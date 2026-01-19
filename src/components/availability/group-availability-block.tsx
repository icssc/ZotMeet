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
	blockColor: string;
	hasSpacerBefore?: boolean;
	isScheduled?: boolean;
	isInSelectionRange?: boolean;
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
		blockColor,
		hasSpacerBefore = false,
	}: GroupAvailabilityBlockProps) => {
		return (
			<button
				type="button"
				className={cn(
					"h-full w-full border-gray-medium border-r-[1px] transition-opacity duration-200",
					hasSpacerBefore && "border-l-[1px] border-l-gray-medium",
					tableCellStyles,
					className,
				)}
				onClick={onClick}
				onMouseEnter={onHover}
				onMouseDown={onMouseDown}
				onMouseMove={onMouseMove}
				onMouseUp={onMouseUp}
			>
				<div
					className={cn("block h-full w-full py-2")}
					style={{ background: blockColor }}
				/>
			</button>
		);
	},
);

GroupAvailabilityBlock.displayName = "GroupAvailabilityBlock";
