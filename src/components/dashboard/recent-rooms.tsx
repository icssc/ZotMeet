"use client";

import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { Box, Button, Typography } from "@mui/material";
import { SectionCard } from "@/components/dashboard/dashboard-parts";
import { RoomCard } from "@/components/dashboard/room-card";
import { useRecentRooms } from "@/hooks/use-recent-rooms";
import { clearRecentRooms } from "@/lib/rooms/recent-rooms";

const VISIBLE_RECENT_ROOMS = 3;

export function RecentRooms() {
	const rooms = useRecentRooms();

	return (
		<SectionCard
			component="section"
			sx={{
				px: 2.5,
				py: 3.75,
				display: "flex",
				flexDirection: "column",
				gap: 3,
			}}
		>
			<Box
				sx={{
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
				}}
			>
				<Typography variant="h6" component="h2">
					Recently Visited Rooms
				</Typography>
				{rooms.length > 0 && (
					<Button
						size="small"
						onClick={clearRecentRooms}
						sx={{ typography: "caption", color: "info.main", minWidth: 0 }}
					>
						Clear all
					</Button>
				)}
			</Box>

			{rooms.length === 0 ? (
				<Typography variant="body2" color="text.secondary">
					Rooms you open from Quick Book or Rooms will show up here.
				</Typography>
			) : (
				<Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
					{rooms.slice(0, VISIBLE_RECENT_ROOMS).map((room) => (
						<RoomCard
							key={room.id}
							room={room}
							action={
								<Box
									sx={{
										display: "flex",
										alignItems: "center",
										gap: 0.5,
										color: "primary.main",
										flexShrink: 0,
									}}
								>
									<Typography variant="caption" color="inherit">
										Book
									</Typography>
									<ChevronRightIcon sx={{ fontSize: 16, color: "inherit" }} />
								</Box>
							}
						/>
					))}
				</Box>
			)}
		</SectionCard>
	);
}
