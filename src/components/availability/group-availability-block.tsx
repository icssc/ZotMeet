import { memo } from "react";
import { cn } from "@/lib/utils";

interface GroupAvailabilityBlockProps {
    block: string[];
    className?: string;
    tableCellStyles?: string;
    onClick: VoidFunction;
    onHover?: VoidFunction;
    blockColor: string;
    hoveredMember?: string | null;
    selectedMembers: string[];
    hasSpacerBefore?: boolean;
}

export const GroupAvailabilityBlock = memo(
    ({
        block,
        tableCellStyles = "",
        className = "",
        onClick,
        onHover,
        blockColor,
        hoveredMember,
        selectedMembers,
        hasSpacerBefore = false,
    }: GroupAvailabilityBlockProps) => {
        const isHoveredMemberAvailable =
            hoveredMember && block && block.includes(hoveredMember);

        const hasSelectedMemberAvailable =
            !hoveredMember &&
            selectedMembers &&
            selectedMembers.length > 0 &&
            selectedMembers.some((memberId) => block.includes(memberId));

        const shouldDim =
            (hoveredMember && !isHoveredMemberAvailable) ||
            (!hoveredMember &&
                selectedMembers &&
                selectedMembers.length > 0 &&
                !hasSelectedMemberAvailable);

        return (
            <button
                className={cn(
                    "h-full w-full border-r-[1px] border-gray-medium transition-opacity duration-200",
                    shouldDim && "opacity-30",
                    hasSpacerBefore && "border-l-[1px] border-l-gray-medium",
                    tableCellStyles,
                    className
                )}
                onClick={onClick}
                onMouseEnter={onHover}
            >
                <div
                    className={cn("block h-full w-full py-2")}
                    style={{ background: blockColor }}
                />
            </button>
        );
    }
);

GroupAvailabilityBlock.displayName = "GroupAvailabilityBlock";
