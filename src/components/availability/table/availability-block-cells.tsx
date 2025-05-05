import { AvailabilityBlock } from "@/components/availability/table/availability-block";
import {
    AvailabilityBlockType,
    SelectionStateType,
} from "@/lib/types/availability";
import { cn } from "@/lib/utils";

interface AvailabilityBlockCellProps {
    blockIndex: number;
    isAvailable: boolean;
    zotDateIndex: number;
    setAvailabilities: (startBlock: AvailabilityBlockType) => void;
    isTopOfHour: boolean;
    isHalfHour: boolean;
    isLastRow: boolean;
    startBlockSelection: AvailabilityBlockType | undefined;
    setStartBlockSelection: (block: AvailabilityBlockType | undefined) => void;
    endBlockSelection: AvailabilityBlockType | undefined;
    setEndBlockSelection: (block: AvailabilityBlockType | undefined) => void;
    selectionState: SelectionStateType | undefined;
}

export function AvailabilityBlockCells({
    blockIndex,
    isAvailable,
    zotDateIndex,
    setAvailabilities,
    isTopOfHour,
    isHalfHour,
    isLastRow,
    startBlockSelection,
    setStartBlockSelection,
    endBlockSelection,
    setEndBlockSelection,
    selectionState,
}: AvailabilityBlockCellProps) {
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
            className="px-0 py-0"
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
