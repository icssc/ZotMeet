"use client";

import { useState } from "react";
import {
    AvailabilityBlockType,
    SelectionStateType,
} from "@/lib/types/availability";

export const useAvailabilityState = () => {
    const [startBlockSelection, setStartBlockSelection] =
        useState<AvailabilityBlockType>();
    const [endBlockSelection, setEndBlockSelection] =
        useState<AvailabilityBlockType>();
    const [selectionState, setSelectionState] = useState<SelectionStateType>();
    const [currentPage, setCurrentPage] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(0);

    return {
        startBlockSelection,
        setStartBlockSelection,
        endBlockSelection,
        setEndBlockSelection,
        selectionState,
        setSelectionState,
        currentPage,
        setCurrentPage,
        itemsPerPage,
        setItemsPerPage,
    };
};
