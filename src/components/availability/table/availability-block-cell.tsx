import { AvailabilityBlock } from "@/components/availability/table/availability-block";
import { GoogleCalendarEventBlock } from "@/components/availability/table/google-calendar-event-block";
import type {
    AvailabilityBlockType,
    EventSegment,
} from "@/lib/types/availability";
import { cn } from "@/lib/utils";
import { useBlockSelectionStore } from "@/store/useBlockSelectionStore";
import { useShallow } from "zustand/shallow";

interface AvailabilityBlockCellProps {
    blockIndex: number;
    isAvailable: boolean;
    zotDateIndex: number;
    setAvailabilities: (startBlock: AvailabilityBlockType) => void;
    isTopOfHour: boolean;
    isHalfHour: boolean;
    isLastRow: boolean;
    eventSegments: EventSegment[];
    hasSpacerBefore?: boolean;
}

export function AvailabilityBlockCell({
    blockIndex,
    isAvailable,
    zotDateIndex,
    setAvailabilities,
    isTopOfHour,
    isHalfHour,
    isLastRow,
    eventSegments,
    hasSpacerBefore = false,
}: AvailabilityBlockCellProps) {
    const {
        startBlockSelection,
        selectionState,
        setStartBlockSelection,
        setEndBlockSelection,
    } = useBlockSelectionStore(
        useShallow((state) => ({
            startBlockSelection: state.startBlockSelection,
            selectionState: state.selectionState,
            setStartBlockSelection: state.setStartBlockSelection,
            setEndBlockSelection: state.setEndBlockSelection,
        }))
    );

    const availabilitySelection = {
        zotDateIndex: zotDateIndex,
        blockIndex: blockIndex,
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        const touchingElement = document.elementFromPoint(
            e.touches[0].clientX,
            e.touches[0].clientY
        );

        if (!touchingElement) return;

        const touchingDateIndex = parseInt(
            touchingElement.getAttribute("data-date-index") || "",
            10
        );
        const touchingBlockIndex = parseInt(
            touchingElement.getAttribute("data-block-index") || "",
            10
        );

        if (
            !isNaN(touchingDateIndex) &&
            !isNaN(touchingBlockIndex) &&
            startBlockSelection
        ) {
            setEndBlockSelection({
                zotDateIndex: touchingDateIndex,
                blockIndex: touchingBlockIndex,
            });
        }
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

    return (
        <td
            onMouseUp={handleMouseUp}
            className="relative px-0 py-0"
        >
            <button
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                data-date-index={zotDateIndex}
                data-block-index={blockIndex}
                className={cn(
                    "block h-full w-full cursor-row-resize border-r-[1px] border-gray-medium",
                    isTopOfHour && "border-t-[1px] border-t-gray-medium",
                    isHalfHour && "border-t-[1px] border-t-gray-base",
                    isLastRow && "border-b-[1px]",
                    hasSpacerBefore && "border-l-[1px] border-l-gray-medium"
                )}
            >
                <AvailabilityBlock
                    isAvailable={isAvailable}
                    zotDateIndex={zotDateIndex}
                    blockIndex={blockIndex}
                    selectionState={selectionState}
                />
            </button>

            <GoogleCalendarEventBlock
                eventSegments={eventSegments}
                isAvailable={isAvailable}
            />
        </td>
    );
}
