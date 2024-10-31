"use client";

import { createContext, Dispatch, SetStateAction, useContext } from "react";
import { useAvailabilityState } from "@/app/components/availability/use-availability-state";
import {
    AvailabilityBlockType,
    SelectionStateType,
} from "@/lib/types/availability";

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
}

const AvailabilityContext = createContext<AvailabilityContextProps | undefined>(
    undefined
);

export const AvailabilityContextProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const {
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
    } = useAvailabilityState();

    return (
        <AvailabilityContext.Provider
            value={{
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
            }}
        >
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
