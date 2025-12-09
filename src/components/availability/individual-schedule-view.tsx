"use client";

import React, { useEffect, useState } from "react";
import { AvailabilityBlocks } from "@/components/availability/table/availability-blocks";
import { ZotDate } from "@/lib/zotdate";
import { useGroupSelectionStore } from "@/store/useGroupSelectionStore";

export const IndividualScheduleView = () => {
    // destructure the hovered availability
    const availability = useGroupSelectionStore((state) => state.hoveredMember);

    // returns null if unhovered

    if (!availability) {
        return null;
    }

    //debugging
    console.log("FROM NEW PAGE: ", availability);

    return (
        <div>
            <p className="bg-red-300">{String(availability)}</p>
            <h1 className="bg-red-200">BELLO</h1>

            <AvailabilityBlocks
                setAvailabilities={setAvailabilities}
                timeBlock={timeBlock}
                blockIndex={blockIndex}
                availabilityTimeBlocksLength={availabilityTimeBlocks.length}
                currentPageAvailability={currentPageAvailability}
                processedCellSegments={processedCellSegments}
            />
        </div>
    );
};
