import { create } from "zustand";

interface GroupSelectionState {
    selectedZotDateIndex: number | undefined;
    selectedBlockIndex: number | undefined;
    selectionIsLocked: boolean;
    hoveredMember: string | null;
    setSelectedZotDateIndex: (index: number | undefined) => void;
    setSelectedBlockIndex: (index: number | undefined) => void;
    setSelectionIsLocked: (locked: boolean) => void;
    setHoveredMember: (member: string | null) => void;
    resetSelection: () => void;
}

export const useGroupSelectionStore = create<GroupSelectionState>((set) => ({
    selectedZotDateIndex: undefined,
    selectedBlockIndex: undefined,
    selectionIsLocked: false,
    hoveredMember: null,
    setSelectedZotDateIndex: (index) => set({ selectedZotDateIndex: index }),
    setSelectedBlockIndex: (index) => set({ selectedBlockIndex: index }),
    setSelectionIsLocked: (locked) => set({ selectionIsLocked: locked }),
    setHoveredMember: (member) => set({ hoveredMember: member }),
    resetSelection: () =>
        set({
            selectedZotDateIndex: undefined,
            selectedBlockIndex: undefined,
            hoveredMember: null,
        }),
}));
