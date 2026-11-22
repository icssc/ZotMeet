"use client";

import DesktopWindowsOutlinedIcon from "@mui/icons-material/DesktopWindowsOutlined";
import PersonIcon from "@mui/icons-material/Person";
import { Typography } from "@mui/material";
import type { Room } from "@zotmeet/shared";

/** "👤 3 seats  🖥 Tech Enhanced", under a room card's building name. */
export function RoomDetails({ room }: { room: Room }) {
	return (
		<Typography
			variant="body2"
			color="textSecondary"
			component="span"
			className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1"
		>
			{room.capacity != null && (
				<span className="flex items-center gap-1.5">
					<PersonIcon fontSize="small" />
					{room.capacity} {room.capacity === 1 ? "seat" : "seats"}
				</span>
			)}
			{room.techEnhanced && (
				<span className="flex items-center gap-1.5">
					<DesktopWindowsOutlinedIcon fontSize="small" />
					Tech Enhanced
				</span>
			)}
		</Typography>
	);
}
