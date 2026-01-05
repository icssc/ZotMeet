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
    selectedMember: string[];
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
        selectedMember,
        hasSpacerBefore = false,
    }: GroupAvailabilityBlockProps) => {
        // Check if hovered member is available (for dimming when hovering)
        const isHoveredMemberAvailable =
            hoveredMember && block && block.includes(hoveredMember);

        // Check if any selected member is available (for dimming when not hovering)
        const hasSelectedMemberAvailable =
            !hoveredMember &&
            selectedMember.length > 0 &&
            selectedMember.some((memberId) => block.includes(memberId));

        return (
            <button
                className={cn(
                    "h-full w-full border-r-[1px] border-gray-medium transition-opacity duration-200",
                    // Dim if hovering and hovered member is not available
                    hoveredMember && !isHoveredMemberAvailable && "opacity-30",
                    // Dim if not hovering, have selections, but no selected member is available
                    !hoveredMember &&
                        selectedMember.length > 0 &&
                        !hasSelectedMemberAvailable &&
                        "opacity-30",
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
