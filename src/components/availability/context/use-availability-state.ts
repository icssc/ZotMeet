"use client";

import { useState } from "react";
import {
    AvailabilityBlockType,
    SelectionStateType,
} from "@/lib/types/availability";
import { ZotDate } from "@/lib/zotdate";

export const useAvailabilityState = () => {
    const [startBlockSelection, setStartBlockSelection] =
        useState<AvailabilityBlockType>();
    const [endBlockSelection, setEndBlockSelection] =
        useState<AvailabilityBlockType>();
    const [selectionState, setSelectionState] = useState<SelectionStateType>();
    const [currentPage, setCurrentPage] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(0);
    const [currentPageAvailability, setCurrentPageAvailability] =
        useState<ZotDate[]>();
    const [isEditingAvailability, setIsEditingAvailability] = useState(false);
    const [isStateUnsaved, setIsStateUnsaved] = useState(false);
    const [availabilityDates, setAvailabilityDates] = useState<ZotDate[]>([]);
    const [originalAvailabilityDates, setOriginalAvailabilityDates] = useState<
        ZotDate[]
    >([]);

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
        currentPageAvailability,
        setCurrentPageAvailability,
        isEditingAvailability,
        setIsEditingAvailability,
        isStateUnsaved,
        setIsStateUnsaved,
        availabilityDates,
        setAvailabilityDates,
        originalAvailabilityDates,
        setOriginalAvailabilityDates,
    };
};
