"use client";

import { Box, Typography } from "@mui/material";
import * as React from "react";
import AvailabilityGrid from "@/components/studyrooms/availability-grid";
import RoomsSidebar from "@/components/studyrooms/room-sidebar";
import type { GroupedRooms, StudyRoomFromApi } from "@/lib/types/studyrooms";

type Props = {
	grouped: GroupedRooms;
	roomsFromApi: StudyRoomFromApi[];
};

export default function StudyRooms({ grouped, roomsFromApi }: Props) {
	const ROW_H = 44;
	const GROUP_H = 36;
	const TIME_H = 48;
	const SIDEBAR_W = 360;

	const slotMinutes = 30;
	const startHour = 0;
	const endHour = 24;
	const colWidthPx = 60;

	const totalCols = ((endHour - startHour) * 60) / slotMinutes;
	const gridWidthPx = totalCols * colWidthPx;
	const SCROLLBAR_H = 16;

	const headerScrollRef = React.useRef<HTMLDivElement | null>(null);
	const bodyScrollRef = React.useRef<HTMLDivElement | null>(null);
	const bottomScrollRef = React.useRef<HTMLDivElement | null>(null);

	const isSyncingRef = React.useRef(false);

	const syncScroll = (source: "body" | "bottom") => {
		if (isSyncingRef.current) return;
		isSyncingRef.current = true;

		const headerEl = headerScrollRef.current;
		const bodyEl = bodyScrollRef.current;
		const bottomEl = bottomScrollRef.current;

		if (!headerEl || !bodyEl || !bottomEl) {
			isSyncingRef.current = false;
			return;
		}

		const left = source === "body" ? bodyEl.scrollLeft : bottomEl.scrollLeft;

		headerEl.scrollLeft = left;
		bodyEl.scrollLeft = left;
		bottomEl.scrollLeft = left;

		requestAnimationFrame(() => {
			isSyncingRef.current = false;
		});
	};

	return (
		<Box sx={{ height: "100vh", bgcolor: "background.default" }}>
			{/* Shared vertical scroll container */}
			<Box sx={{ height: "100%", overflowY: "auto", overflowX: "hidden" }}>
				{/* Sticky time header row */}
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

					{/* Right header cell (scroll synced, but DON'T show its scrollbar) */}
					<Box sx={{ flex: 1, minWidth: 0, overflow: "hidden" }}>
						<AvailabilityGrid
							mode="header"
							groupedRooms={grouped}
							roomsFromApi={roomsFromApi}
							rowHeightPx={ROW_H}
							groupHeaderHeightPx={GROUP_H}
							timeHeaderHeightPx={TIME_H}
							slotMinutes={slotMinutes}
							startHour={startHour}
							endHour={endHour}
							colWidthPx={colWidthPx}
							scrollRef={headerScrollRef}
							// no onScroll here — bottom/body drives sync
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
							slotMinutes={slotMinutes}
							startHour={startHour}
							endHour={endHour}
							colWidthPx={colWidthPx}
							scrollRef={bodyScrollRef}
							onScroll={() => syncScroll("body")}
						/>
					</Box>
				</Box>

				{/* Sticky bottom horizontal scrollbar (always at bottom of viewport) */}
				<Box
					sx={{
						position: "sticky",
						bottom: 0,
						zIndex: 40,
						height: SCROLLBAR_H,
						bgcolor: "background.paper",
						borderTop: "1px solid",
						borderColor: "divider",
					}}
				>
					<Box sx={{ display: "flex", height: "100%" }}>
						{/* left gutter to align with sidebar */}
						<Box sx={{ width: SIDEBAR_W, minWidth: SIDEBAR_W }} />
						{/* actual scrollbar */}
						<Box
							ref={bottomScrollRef}
							onScroll={() => syncScroll("bottom")}
							sx={{
								flex: 1,
								minWidth: 0,
								overflowX: "auto",
								overflowY: "hidden",
							}}
						>
							{/* creates scrollable width */}
							<Box sx={{ width: gridWidthPx, height: 1 }} />
						</Box>
					</Box>
				</Box>
			</Box>
		</Box>
	);
}
