"use client";

import { Paper } from "@mui/material";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { useState } from "react";
import { RoomsHeatmap } from "@/components/studyrooms/heatmap/rooms-heatmap";
import { Sidebar } from "@/components/studyrooms/sidebar";
import { getDefaultWindow } from "@/lib/rooms/utils";
import type { StudyRooms } from "@/lib/types/studyrooms";

export default function Page() {
	const [{ defaultDate, defaultStart, defaultEnd }] = useState(() => {
		const { start, end } = getDefaultWindow();
		return {
			defaultStart: start,
			defaultEnd: end,
			defaultDate: new Date(
				start.getFullYear(),
				start.getMonth(),
				start.getDate(),
			),
		};
	});
	const [committedStart, setCommittedStart] = useState<Date | null>(
		defaultStart,
	);
	const [committedEnd, setCommittedEnd] = useState<Date | null>(defaultEnd);
	const [committedDate, setCommittedDate] = useState<Date | null>(defaultDate);
	const [fallbackNotice, setFallbackNotice] = useState<string | null>(null);
	const [rooms, setRooms] = useState<StudyRooms["data"] | null>(null);

	return (
		<LocalizationProvider dateAdapter={AdapterDateFns}>
			{fallbackNotice && (
				<Typography variant="body2" color="info.main" sx={{ mt: 2 }}>
					{fallbackNotice}
				</Typography>
			)}
			<div className="block sm:hidden">
				<Typography variant="h3" className="p-4">
					Rooms
				</Typography>
			</div>

			<Stack direction={{ xs: "column", md: "row" }}>
				<Paper
					sx={{
						flex: { xs: "unset", md: 3 },
						width: { xs: "100%", md: "auto" },
						minWidth: 0,
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
					}}
					className="md:m-4"
					variant="outlined"
				>
					{rooms && committedDate && committedStart && committedEnd ? (
						<RoomsHeatmap
							rooms={rooms}
							searchDate={committedDate}
							startTime={committedStart}
							endTime={committedEnd}
						/>
					) : (
						<Typography variant="body2" color="text.secondary" sx={{ p: 4 }}>
							Loading available rooms...
						</Typography>
					)}
				</Paper>

				<Sidebar
					defaultDate={defaultDate}
					defaultStart={defaultStart}
					defaultEnd={defaultEnd}
					setRooms={setRooms}
					setCommittedDate={setCommittedDate}
					setCommittedStart={setCommittedStart}
					setCommittedEnd={setCommittedEnd}
					setFallbackNotice={setFallbackNotice}
				/>
			</Stack>
		</LocalizationProvider>
	);
}
