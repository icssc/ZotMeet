"use client";

import { RoomsPanel } from "@/components/availability/rooms/rooms-panel";
import { MuiBottomSheet } from "@/components/ui/mui/mui-bottom-sheet";
import type { StudyRoomFlow } from "@/hooks/use-study-room-flow";

// The panel scrolls its own steps and pins its Back / Next footer, so the
// sheet itself must not scroll.
const mobileSheetPaperSx = { overflow: "hidden" } as const;

export interface MobileRoomRecommendationsProps {
	open: boolean;
	onClose: () => void;
	flow: StudyRoomFlow;
	timeZone: string;
	onShowAttendees: () => void;
}

/** The phone's Rooms sheet: the sidebar's Rooms tab in a bottom sheet. */
export function MobileRoomRecommendations({
	open,
	onClose,
	...panelProps
}: MobileRoomRecommendationsProps) {
	return (
		<MuiBottomSheet open={open} onClose={onClose} paperSx={mobileSheetPaperSx}>
			<RoomsPanel {...panelProps} />
		</MuiBottomSheet>
	);
}
