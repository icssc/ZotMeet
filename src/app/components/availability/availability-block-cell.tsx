import { AvailabilityBlock } from "@/app/components/availability/availability-block";
import { useAvailabilityContext } from "@/app/components/availability/availability-context";
import { cn } from "@/lib/utils";

export function AvailabilityBlockCell({
    blockIndex,
    isAvailable,
    zotDateIndex,
    availabilitySelection,
    handleTouchMove,
    setAvailabilities,
    isTopOfHour,
    isHalfHour,
    isLastRow,
}) {
    const {
        startBlockSelection,
        setStartBlockSelection,
        setEndBlockSelection,
        selectionState,
    } = useAvailabilityContext();

    const handleMouseUp = () => {
        if (startBlockSelection) {
            setEndBlockSelection(availabilitySelection);
            setAvailabilities(startBlockSelection);
        }
    };

    const handleMouseDown = () => {
        setStartBlockSelection(availabilitySelection);
        setEndBlockSelection(availabilitySelection);
    };

    const handleMouseMove = () => {
        if (startBlockSelection) {
            setEndBlockSelection(availabilitySelection);
        }
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        if (e.cancelable) {
            e.preventDefault();
        }
        setStartBlockSelection(availabilitySelection);
        setEndBlockSelection(availabilitySelection);
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        if (e.cancelable) {
            e.preventDefault();
        }

        if (startBlockSelection) {
            setEndBlockSelection(availabilitySelection);
            setAvailabilities(startBlockSelection);
        }
    };

    return (
        <td
            onMouseUp={handleMouseUp}
            className="px-0 py-0"
        >
            <button
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onTouchEnd={handleTouchEnd}
                // TODO: Fix
                // tabIndex="0"
                data-date-index={zotDateIndex}
                data-block-index={blockIndex}
                className={cn(
                    "border-gray-medium block h-full w-full cursor-row-resize border-r-[1px]",
                    isTopOfHour && "border-t-gray-medium border-t-[1px]",
                    isHalfHour && "border-t-gray-base border-t-[1px]",
                    isLastRow && "border-b-[1px]"
                )}
            >
                <AvailabilityBlock
                    isAvailable={isAvailable}
                    zotDateIndex={zotDateIndex}
                    blockIndex={blockIndex}
                    selectionState={selectionState}
                />
            </button>
        </td>
    );
}
