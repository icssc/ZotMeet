"use client";

import { Box, Typography } from "@mui/material";
import * as React from "react";
import AvailabilityGrid from "@/app/studyrooms/availability-grid";
import RoomsSidebar from "@/app/studyrooms/room-sidebar";
import type {
	GroupedRooms,
	StudyRoomFromApi,
} from "@/lib/studyrooms/groupRooms";

type Props = {
	grouped: GroupedRooms;
	roomsFromApi: StudyRoomFromApi[];
};

export default function StudyRoomsClient({ grouped, roomsFromApi }: Props) {
	// shared sizing contract
	const ROW_H = 44;
	const GROUP_H = 36;
	const TIME_H = 48;
	const SIDEBAR_W = 360;

	// two horizontal scrollers we will sync
	const headerScrollRef = React.useRef<HTMLDivElement | null>(null);
	const bodyScrollRef = React.useRef<HTMLDivElement | null>(null);

	const isSyncingRef = React.useRef(false);

	const syncScroll = (source: "header" | "body") => {
		if (isSyncingRef.current) return;
		isSyncingRef.current = true;

		const headerEl = headerScrollRef.current;
		const bodyEl = bodyScrollRef.current;
		if (!headerEl || !bodyEl) {
			isSyncingRef.current = false;
			return;
		}

		if (source === "header") {
			bodyEl.scrollLeft = headerEl.scrollLeft;
		} else {
			headerEl.scrollLeft = bodyEl.scrollLeft;
		}

		// release on next frame
		requestAnimationFrame(() => {
			isSyncingRef.current = false;
		});
	};

	return (
		<Box sx={{ height: "100vh", bgcolor: "background.default" }}>
			{/* Shared vertical scroll container */}
			<Box sx={{ height: "100%", overflowY: "auto", overflowX: "hidden" }}>
				{/* ✅ Sticky header row */}
				<Box
					sx={{
						position: "sticky",
						top: 0,
						zIndex: 50,
						display: "flex",
						height: TIME_H,
						bgcolor: "background.paper",
						borderBottom: "1px solid",
						borderColor: "divider",
					}}
				>
					{/* Left sticky header cell */}
					<Box
						sx={{
							width: SIDEBAR_W,
							minWidth: SIDEBAR_W,
							display: "flex",
							alignItems: "center",
							px: 2,
							borderRight: "1px solid",
							borderColor: "divider",
						}}
					>
						<Typography variant="subtitle1" fontWeight={700}>
							Rooms
						</Typography>
					</Box>

					{/* Right sticky header cell (horizontal scroll, synced with body) */}
					<Box sx={{ flex: 1, minWidth: 0 }}>
						<AvailabilityGrid
							mode="header"
							groupedRooms={grouped}
							roomsFromApi={roomsFromApi}
							rowHeightPx={ROW_H}
							groupHeaderHeightPx={GROUP_H}
							timeHeaderHeightPx={TIME_H}
							slotMinutes={30}
							startHour={0}
							endHour={24}
							colWidthPx={60}
							scrollRef={headerScrollRef}
							onScroll={() => syncScroll("header")}
						/>
					</Box>
				</Box>

				{/* Body row */}
				<Box sx={{ display: "flex" }}>
					<RoomsSidebar
						groupedRooms={grouped}
						rowHeightPx={ROW_H}
						groupHeaderHeightPx={GROUP_H}
						timeHeaderHeightPx={TIME_H}
						widthPx={SIDEBAR_W}
						hideTopHeader
					/>

					<Box sx={{ flex: 1, minWidth: 0 }}>
						<AvailabilityGrid
							mode="body"
							groupedRooms={grouped}
							roomsFromApi={roomsFromApi}
							rowHeightPx={ROW_H}
							groupHeaderHeightPx={GROUP_H}
							timeHeaderHeightPx={TIME_H}
							slotMinutes={30}
							startHour={0}
							endHour={24}
							colWidthPx={60}
							scrollRef={bodyScrollRef}
							onScroll={() => syncScroll("body")}
						/>
					</Box>
				</Box>
			</Box>
		</Box>
	);
}
