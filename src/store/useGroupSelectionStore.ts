import { create } from "zustand";

interface GroupSelectionState {
    selectedZotDateIndex: number | undefined;
    selectedBlockIndex: number | undefined;
    selectionIsLocked: boolean;
    hoveredMember: string | null;
    selectedMember: string[];
    isMobileDrawerOpen: boolean;
    setSelectedZotDateIndex: (index: number | undefined) => void;
    setSelectedBlockIndex: (index: number | undefined) => void;
    setSelectionIsLocked: (locked: boolean) => void;
    setHoveredMember: (member: string | null) => void;
    toggleSelectedMember: (memberId: string) => void;
    setSelectedMember: (members: string[]) => void;
    setIsMobileDrawerOpen: (open: boolean) => void;
    resetSelection: () => void;
}

export const useGroupSelectionStore = create<GroupSelectionState>((set) => ({
    selectedZotDateIndex: undefined,
    selectedBlockIndex: undefined,
    selectionIsLocked: false,
    hoveredMember: null,
    selectedMember: [],
    isMobileDrawerOpen: false,
    setSelectedZotDateIndex: (index) => set({ selectedZotDateIndex: index }),
    setSelectedBlockIndex: (index) => set({ selectedBlockIndex: index }),
    setSelectionIsLocked: (locked) => set({ selectionIsLocked: locked }),
    setHoveredMember: (member) => set({ hoveredMember: member }),
    setSelectedMember: (members) => set({ selectedMember: members }),
    toggleSelectedMember: (memberId) =>
        set((state) => {
            const isSelected = state.selectedMember.includes(memberId);
            if (isSelected) {
                return {
                    selectedMember: state.selectedMember.filter(
                        (id) => id !== memberId
                    ),
                };
            } else {
                return {
                    selectedMember: [...state.selectedMember, memberId],
                };
            }
        }),
    setIsMobileDrawerOpen: (open) => set({ isMobileDrawerOpen: open }),
    resetSelection: () =>
        set({
            selectedZotDateIndex: undefined,
            selectedBlockIndex: undefined,
        }),
}));
