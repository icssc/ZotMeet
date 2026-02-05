"use client";

import {
	Box,
	List,
	ListItemButton,
	ListItemText,
	Typography,
} from "@mui/material";
import * as React from "react";
import type { GroupedRooms } from "@/lib/types/studyrooms";

type RoomsSidebarProps = {
	groupedRooms: GroupedRooms;
	rowHeightPx?: number;
	groupHeaderHeightPx?: number;
	timeHeaderHeightPx?: number;
	widthPx?: number;

	hideTopHeader?: boolean;
};

export default function RoomsSidebar({
	groupedRooms,
	rowHeightPx = 44,
	groupHeaderHeightPx = 36,
	timeHeaderHeightPx = 48,
	widthPx = 360,
	hideTopHeader = false,
}: RoomsSidebarProps) {
	return (
		<Box
			sx={{
				width: widthPx,
				minWidth: widthPx,
				borderRight: "1px solid",
				borderColor: "divider",
				bgcolor: "background.paper",
			}}
		>
			{!hideTopHeader && (
				<Box
					sx={{
						position: "sticky",
						top: 0,
						zIndex: 6,
						height: timeHeaderHeightPx,
						display: "flex",
						alignItems: "center",
						px: 2,
						borderBottom: "1px solid",
						borderColor: "divider",
						bgcolor: "background.paper",
					}}
				>
					<Typography variant="subtitle1" fontWeight={700}>
						Rooms
					</Typography>
				</Box>
			)}

			{groupedRooms.map((group) => (
				<Box key={group.location}>
					<Box
						sx={{
							height: groupHeaderHeightPx,
							display: "flex",
							alignItems: "center",
							px: 2,
							borderBottom: "1px solid",
							borderColor: "divider",
							bgcolor: "background.paper",
							position: "sticky",
							top: hideTopHeader ? timeHeaderHeightPx : timeHeaderHeightPx,
							zIndex: 5,
						}}
					>
						<Typography variant="caption" fontWeight={800}>
							{group.location}
						</Typography>
					</Box>

					<List disablePadding>
						{group.rooms.map((room) => (
							<ListItemButton key={room.id} sx={{ height: rowHeightPx, px: 2 }}>
								<ListItemText
									primary={room.name}
									secondary={
										room.capacity != null ? `Cap ${room.capacity}` : undefined
									}
									primaryTypographyProps={{ fontSize: 14, fontWeight: 600 }}
									secondaryTypographyProps={{ fontSize: 12 }}
								/>
							</ListItemButton>
						))}
					</List>
				</Box>
			))}
		</Box>
	);
}
