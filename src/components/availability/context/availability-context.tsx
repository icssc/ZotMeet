"use client";

import { createContext, Dispatch, SetStateAction, useContext } from "react";
import { useAvailabilityState } from "@/components/availability/context/use-availability-state";
import {
    AvailabilityBlockType,
    SelectionStateType,
} from "@/lib/types/availability";
import { ZotDate } from "@/lib/zotdate";

interface AvailabilityContextProps {
    startBlockSelection: AvailabilityBlockType | undefined;
    setStartBlockSelection: Dispatch<
        SetStateAction<AvailabilityBlockType | undefined>
    >;
    endBlockSelection: AvailabilityBlockType | undefined;
    setEndBlockSelection: Dispatch<
        SetStateAction<AvailabilityBlockType | undefined>
    >;
    selectionState: SelectionStateType | undefined;
    setSelectionState: Dispatch<SetStateAction<SelectionStateType | undefined>>;
    currentPage: number;
    setCurrentPage: Dispatch<SetStateAction<number>>;
    itemsPerPage: number;
    setItemsPerPage: Dispatch<SetStateAction<number>>;
    currentPageAvailability: ZotDate[] | undefined;
    setCurrentPageAvailability: Dispatch<SetStateAction<ZotDate[] | undefined>>;
    isEditingAvailability: boolean;
    setIsEditingAvailability: Dispatch<SetStateAction<boolean>>;
    isStateUnsaved: boolean;
    setIsStateUnsaved: Dispatch<SetStateAction<boolean>>;
    availabilityDates: ZotDate[];
    setAvailabilityDates: Dispatch<SetStateAction<ZotDate[]>>;
    originalAvailabilityDates: ZotDate[];
    setOriginalAvailabilityDates: Dispatch<SetStateAction<ZotDate[]>>;
}

const AvailabilityContext = createContext<AvailabilityContextProps | undefined>(
    undefined
);

export const AvailabilityContextProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const state = useAvailabilityState();

    return (
        <AvailabilityContext.Provider value={state}>
            {children}
        </AvailabilityContext.Provider>
    );
};

export const useAvailabilityContext = (): AvailabilityContextProps => {
    const context = useContext(AvailabilityContext);
    if (!context) {
        throw new Error(
            "useAvailabilityContext must be used within a AvailabilityContextProvider"
        );
    }
    return context;
};
