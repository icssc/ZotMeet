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
    }: GroupAvailabilityBlockProps) => {
        const isMemberAvailable =
            hoveredMember && block && block.includes(hoveredMember);

        return (
            <button
                className={cn(
                    "h-full w-full border-r-[1px] border-gray-medium",
                    hoveredMember && !isMemberAvailable && "opacity-30",
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
