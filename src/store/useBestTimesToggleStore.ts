import { create } from "zustand";

interface BestTimesToggleState {
	enabled: boolean;
	setEnabled: (v: boolean) => void;
}

export const useBestTimesToggleStore = create<BestTimesToggleState>((set) => ({
	enabled: false,
	setEnabled: (enabled) => set({ enabled }),
}));
