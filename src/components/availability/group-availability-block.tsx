import { memo } from "react";
import { cn } from "@/lib/utils";
import { ZotDate } from "@/lib/zotdate";

interface GroupAvailabilityBlockProps {
    groupAvailabilities: ZotDate[];
    className?: string;
    tableCellStyles?: string;
    onClick: VoidFunction;
    onHover?: VoidFunction;
    timestamp: string;
    hoveredMember?: string | null;
}

function getAllUniqueMembers(dates: ZotDate[]): string[] {
    return Array.from(
        new Set(
            dates
                .flatMap((date) => Object.values(date.groupAvailability))
                .flat()
        )
    );
}

export const GroupAvailabilityBlock = memo(
    ({
        timestamp,
        groupAvailabilities,
        tableCellStyles = "",
        className = "",
        onClick,
        onHover,
        hoveredMember,
    }: GroupAvailabilityBlockProps) => {
        const members = getAllUniqueMembers(groupAvailabilities);

        const calculateGroupBlockColor = () => {
            const day = groupAvailabilities.find(
                (date) => date.day.getDay() === new Date(timestamp).getDay()
            );

            const block = day?.groupAvailability[timestamp];

            if (!block) {
                return "transparent";
            }

            if (hoveredMember) {
                if (block.includes(hoveredMember)) {
                    return "rgba(55, 124, 251)";
                }
                return "transparent";
            }

            const opacity = block.length / members.length;
            return `rgba(55, 124, 251, ${opacity})`;
        };

        const day = groupAvailabilities.find(
            (date) => date.day.getDay() === new Date(timestamp).getDay()
        );

        const block = day?.groupAvailability[timestamp];
        const isMemberAvailable =
            hoveredMember && block && block.includes(hoveredMember);

        return (
            <button
                className={cn(
                    "h-full w-full border-r-[1px] border-gray-medium transition-opacity duration-200",
                    hoveredMember && !isMemberAvailable && "opacity-30",
                    tableCellStyles,
                    className
                )}
                onClick={onClick}
                onMouseEnter={onHover}
            >
                <div
                    className={cn(
                        "block h-full w-full py-2",
                        `bg-[${calculateGroupBlockColor()}]`
                    )}
                />
            </button>
        );
    }
);

GroupAvailabilityBlock.displayName = "GroupAvailabilityBlock";
