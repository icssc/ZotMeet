"use client";

import FilterListIcon from "@mui/icons-material/FilterList";
import SearchIcon from "@mui/icons-material/Search";
import { Box, Button, Drawer, Paper, TextField } from "@mui/material";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { MobileIsland } from "@/components/mobile/mobile-island";
import { RoomsHeatmap } from "@/components/studyrooms/heatmap/rooms-heatmap";
import { Sidebar } from "@/components/studyrooms/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
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
	const isMobile = useIsMobile();
	const [committedStart, setCommittedStart] = useState<Date | null>(
		defaultStart,
	);
	const [committedEnd, setCommittedEnd] = useState<Date | null>(defaultEnd);
	const [committedDate, setCommittedDate] = useState<Date | null>(defaultDate);
	const [fallbackNotice, setFallbackNotice] = useState<string | null>(null);
	const [rooms, setRooms] = useState<StudyRooms["data"] | null>(null);
	const [drawerOpen, setOpen] = useState(false);
	const [filteredRooms, setFilteredRooms] = useState<StudyRooms["data"] | null>(
		null,
	);
	const [, startTransition] = useTransition();
	const searchRef = useRef("");
	const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

	useEffect(() => {
		setFilteredRooms(rooms);
	}, [rooms]);
	const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
		searchRef.current = event.target.value;
		clearTimeout(timerRef.current);
		timerRef.current = setTimeout(() => {
			startTransition(() => {
				const query = searchRef.current.toLowerCase();
				setFilteredRooms(
					query
						? rooms!.filter(
								(r) =>
									r.location.toLowerCase().includes(query) ||
									r.name.toLowerCase().includes(query),
							)
						: rooms,
				);
			});
		}, 300);
	};
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
					{filteredRooms && committedDate && committedStart && committedEnd ? (
						<RoomsHeatmap
							rooms={filteredRooms}
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
				{isMobile ? (
					<MobileIsland>
						<Box
							sx={{
								display: "flex",
								alignItems: "center",
								py: 1,
								pl: 1,
								width: "100%",
							}}
						>
							<TextField
								sx={{ flex: 7 }}
								slotProps={{
									input: {
										startAdornment: (
											<SearchIcon
												sx={{ fontSize: 20, color: "text.disabled", mr: 0.5 }}
											/>
										),
										placeholder: "Search Rooms",
									},
								}}
								onChange={handleSearch}
							/>
							<Button onClick={() => setOpen(true)} sx={{ flex: 1 }}>
								{" "}
								<FilterListIcon />{" "}
							</Button>
							<Drawer
								anchor="bottom"
								open={drawerOpen}
								onClose={() => setOpen(false)}
								sx={{
									"& .MuiDrawer-paper": {
										display: "flex",
										alignItems: "center",
									},
								}}
							>
								<Sidebar
									defaultDate={defaultDate}
									defaultStart={defaultStart}
									defaultEnd={defaultEnd}
									setRooms={setRooms}
									setCommittedDate={setCommittedDate}
									setCommittedStart={setCommittedStart}
									setCommittedEnd={setCommittedEnd}
									setFallbackNotice={setFallbackNotice}
									setDrawerClose={setOpen}
								/>
							</Drawer>
						</Box>
					</MobileIsland>
				) : (
					<Sidebar
						defaultDate={defaultDate}
						defaultStart={defaultStart}
						defaultEnd={defaultEnd}
						setRooms={setRooms}
						setCommittedDate={setCommittedDate}
						setCommittedStart={setCommittedStart}
						setCommittedEnd={setCommittedEnd}
						setFallbackNotice={setFallbackNotice}
						setDrawerClose={setOpen}
					/>
				)}
			</Stack>
		</LocalizationProvider>
	);
}
