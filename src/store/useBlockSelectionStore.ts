import type {
    AvailabilityBlockType,
    SelectionStateType,
} from "@/lib/types/availability";
import { create } from "zustand";

interface BlockSelectionState {
    startBlockSelection: AvailabilityBlockType | undefined;
    endBlockSelection: AvailabilityBlockType | undefined;
    selectionState: SelectionStateType | undefined;
    setStartBlockSelection: (block: AvailabilityBlockType | undefined) => void;
    setEndBlockSelection: (block: AvailabilityBlockType | undefined) => void;
    setSelectionState: (state: SelectionStateType | undefined) => void;
}

export const useBlockSelectionStore = create<BlockSelectionState>((set) => ({
    startBlockSelection: undefined,
    endBlockSelection: undefined,
    selectionState: undefined,
    setStartBlockSelection: (block) => set({ startBlockSelection: block }),
    setEndBlockSelection: (block) => set({ endBlockSelection: block }),
    setSelectionState: (state) => set({ selectionState: state }),
}));
