"use client";

import {
	RoomRecommendationSettings,
	type StudyRoomApiEntry,
} from "@/components/availability/room-recommendations";
import { MuiBottomSheet } from "@/components/ui/mui/mui-bottom-sheet";
import type { RoomFilters } from "@/lib/types/studyrooms";

const mobileSheetPaperSx = { px: 2, py: 1 } as const;

export interface MobileRoomRecommendationsProps {
	open: boolean;
	onClose: () => void;
	rawRooms: StudyRoomApiEntry[];
	hasSearched: boolean;
	filters: RoomFilters;
	onFiltersChange: (filters: RoomFilters) => void;
	onShowBestRooms: () => void;
	isLoading: boolean;
	errorMessage: string | null;
	selectedRoomIds: string[];
	onSelectedRoomIdsChange: (ids: string[]) => void;
}

export function MobileRoomRecommendations({
	open,
	onClose,
	...roomProps
}: MobileRoomRecommendationsProps) {
	return (
		<MuiBottomSheet open={open} onClose={onClose} paperSx={mobileSheetPaperSx}>
			<RoomRecommendationSettings layout="sheet" {...roomProps} />
		</MuiBottomSheet>
	);
}
