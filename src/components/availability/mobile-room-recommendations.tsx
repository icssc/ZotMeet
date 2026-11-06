"use client";

import { RoomsPanel } from "@/components/availability/rooms/rooms-panel";
import { MuiBottomSheet } from "@/components/ui/mui/mui-bottom-sheet";

// The panel scrolls its own steps, so the sheet itself must not scroll.
const mobileSheetPaperSx = { overflow: "hidden" } as const;

export interface MobileRoomRecommendationsProps {
	open: boolean;
	onClose: () => void;
}

/** The phone's Rooms sheet: the sidebar's Rooms tab in a bottom sheet. */
export function MobileRoomRecommendations({
	open,
	onClose,
}: MobileRoomRecommendationsProps) {
	return (
		<MuiBottomSheet open={open} onClose={onClose} paperSx={mobileSheetPaperSx}>
			<RoomsPanel />
		</MuiBottomSheet>
	);
}
