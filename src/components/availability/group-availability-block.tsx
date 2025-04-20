import { cn } from "@/lib/utils";
import { ZotDate } from "@/lib/zotdate";

interface GroupAvailabilityBlockProps {
    groupAvailabilities: ZotDate[];
    className?: string;
    tableCellStyles?: string;
    onClick: VoidFunction;
    onHover?: VoidFunction;
    timestamp: string;
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

export function GroupAvailabilityBlock({
    timestamp,
    groupAvailabilities,
    tableCellStyles = "",
    className = "",
    onClick,
    onHover,
}: GroupAvailabilityBlockProps) {
    const members = getAllUniqueMembers(groupAvailabilities);

    const calculateGroupBlockColor = () => {
        const day = groupAvailabilities.find(
            (date) => date.day.getDay() === new Date(timestamp).getDay()
        );

        const block = day?.groupAvailability[timestamp];

        if (!block) {
            return "transparent";
        }

        const opacity = block.length / members.length;
        return `rgba(55, 124, 251, ${opacity})`;
    };

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
                className="block w-full h-full py-2"
                style={{
                    backgroundColor: calculateGroupBlockColor(),
                }}
            />
        </button>
    );
}
