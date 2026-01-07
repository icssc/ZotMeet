import { create } from "zustand";

interface GroupSelectionState {
    selectedZotDateIndex: number | undefined;
    selectedBlockIndex: number | undefined;
    selectionIsLocked: boolean;
    hoveredMember: string | null;
    selectedMembers: string[];
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
    selectedMembers: [],
    isMobileDrawerOpen: false,
    setSelectedZotDateIndex: (index) => set({ selectedZotDateIndex: index }),
    setSelectedBlockIndex: (index) => set({ selectedBlockIndex: index }),
    setSelectionIsLocked: (locked) => set({ selectionIsLocked: locked }),
    setHoveredMember: (member) => set({ hoveredMember: member }),
    setSelectedMember: (members) => set({ selectedMembers: members }),
    toggleSelectedMember: (memberId) =>
        set((state) => {
            const isSelected = state.selectedMembers.includes(memberId);
            if (isSelected) {
                return {
                    selectedMembers: state.selectedMembers.filter(
                        (id) => id !== memberId
                    ),
                };
            } else {
                return {
                    selectedMembers: [...state.selectedMembers, memberId],
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
