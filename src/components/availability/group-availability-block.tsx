import { memo } from "react";
import { cn } from "@/lib/utils";

interface GroupAvailabilityBlockProps {
	block: string[];
	className?: string;
	tableCellStyles?: string;
	onClick: VoidFunction;
	onHover?: VoidFunction;
	onMouseDown?: VoidFunction;
	onMouseMove?: VoidFunction;
	onMouseUp?: VoidFunction;
	blockColor: string;
	hoveredMember?: string | null;
	hasSpacerBefore?: boolean;
	isScheduled?: boolean;
	isInSelectionRange?: boolean;
}

export const GroupAvailabilityBlock = memo(
	({
		block,
		tableCellStyles = "",
		className = "",
		onClick,
		onHover,
		onMouseDown,
		onMouseMove,
		onMouseUp,
		blockColor,
		hoveredMember,
		hasSpacerBefore = false,
		isScheduled = false,
		isInSelectionRange = false,
	}: GroupAvailabilityBlockProps) => {
		const isMemberAvailable =
			hoveredMember && block && block.includes(hoveredMember);

		// Gold color when scheduling takes precedence over group availability colors
		let finalBackgroundColor = blockColor;
		if (isInSelectionRange && !isScheduled) {
			// lighter gold when dragging
			finalBackgroundColor = "rgba(255, 215, 0, 0.3)";
		} else if (isScheduled) {
			// Darker gold when drag ends
			finalBackgroundColor = "rgba(255, 215, 0, 0.6)";
		}

		return (
			<button
				type="button"
				className={cn(
					"h-full w-full border-gray-medium border-r-[1px] transition-opacity duration-200",
					hoveredMember && !isMemberAvailable && "opacity-30",
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
					style={{ background: finalBackgroundColor }}
				/>
			</button>
		);
	},
);

GroupAvailabilityBlock.displayName = "GroupAvailabilityBlock";
