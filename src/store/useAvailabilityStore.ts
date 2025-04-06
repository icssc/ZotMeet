import { create } from "zustand";

interface AvailabilityState {
    value: string;
    editAvailability: (
        fn?: () => void
    ) => (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const useAvailabilityStore = create<AvailabilityState>((set) => ({
    value: "group",
    editAvailability: (fn) => (e) => {
        if (fn) fn();
        set((state) => ({
            value: state.value === "group" ? "personal" : "group",
        }));
    },
}));

export default useAvailabilityStore;
