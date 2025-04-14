import { MemberAvailability } from "@/lib/types/availability";
import { cn } from "@/lib/utils";

interface GroupAvailabilityBlockProps {
    groupAvailabilities: MemberAvailability[];
    availableMemberIndices: number[] | null;
    className?: string;
    tableCellStyles?: string;
    onClick: VoidFunction;
    onHover?: VoidFunction;
}

export function GroupAvailabilityBlock({
    groupAvailabilities,
    availableMemberIndices,
    tableCellStyles = "",
    className = "",
    onClick,
    onHover,
}: GroupAvailabilityBlockProps) {
    const calculateGroupBlockColor = (
        availableMemberIndices: number[] | null
    ) => {
        if (availableMemberIndices) {
            const opacity =
                availableMemberIndices.length / groupAvailabilities.length;
            return `rgba(55, 124, 251, ${opacity})`;
        }
        return "transparent";
    };

    // console.log(calculateGroupBlockColor(availableMemberIndices));

    return (
        <button
            className={cn(
                "h-full w-full border-r-[1px] border-gray-medium",
                tableCellStyles,
                className
            )}
            onClick={onClick}
            onMouseEnter={onHover}
        >
            <div
                className="block h-full w-full py-2"
                style={{
                    backgroundColor: calculateGroupBlockColor(
                        availableMemberIndices
                    ),
                }}
            />
        </button>
    );
}
