"use client";

import {
	Box,
	CircularProgress,
	FormControl,
	InputLabel,
	MenuItem,
	Button as MuiButton,
	Select as MuiSelect,
	Paper,
	Stack,
	TextField,
	Typography,
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";

import { RoomHeatmap } from "@/components/studyrooms/room-heatmap";
import { fetchStudyRooms } from "@/lib/studyrooms/get-rooms";
import type { StudyRooms } from "@/lib/types/studyrooms";

const DEFAULT_TIME_RANGE = "8:00am-10:00pm";

function todayDateString(): string {
	const d = new Date();
	const yyyy = d.getFullYear();
	const mm = String(d.getMonth() + 1).padStart(2, "0");
	const dd = String(d.getDate()).padStart(2, "0");
	return `${yyyy}-${mm}-${dd}`;
}

export default function Page() {
	const [date, setDate] = useState(todayDateString);
	const [timeRange, setTimeRange] = useState(DEFAULT_TIME_RANGE);
	const [location, setLocation] = useState("");
	const [capacityMin, setCapacityMin] = useState("");
	const [capacityMax, setCapacityMax] = useState("");
	const [isTechEnhanced, setIsTechEnhanced] = useState<
		"any" | "true" | "false"
	>("any");
	const [rooms, setRooms] = useState<StudyRooms["data"] | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);
	// Track which date+timeRange is currently displayed in the heatmap
	const [displayedTimeRange, setDisplayedTimeRange] =
		useState(DEFAULT_TIME_RANGE);

	const loadRooms = useCallback(
		async (params: {
			date: string;
			timeRange: string;
			location?: string;
			capacityMin?: number;
			capacityMax?: number;
			isTechEnhanced?: boolean;
		}) => {
			setError(null);
			setLoading(true);
			try {
				const { data } = await fetchStudyRooms(params);
				setRooms(data);
				setDisplayedTimeRange(params.timeRange);
			} catch (err) {
				setError(err instanceof Error ? err.message : "API call failed");
			} finally {
				setLoading(false);
			}
		},
		[],
	);

	// Auto-load on mount with today + default time range
	useEffect(() => {
		loadRooms({ date: todayDateString(), timeRange: DEFAULT_TIME_RANGE });
	}, [loadRooms]);

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();

		const timeRangePattern = /^\d{1,2}:\d{2}(am|pm)-\d{1,2}:\d{2}(am|pm)$/;
		if (!timeRangePattern.test(timeRange)) {
			setError("Invalid time range. Use format: 11:00am-5:00pm");
			return;
		}

		await loadRooms({
			date,
			timeRange,
			location: location || undefined,
			capacityMin: capacityMin ? Number(capacityMin) : undefined,
			capacityMax: capacityMax ? Number(capacityMax) : undefined,
			isTechEnhanced:
				isTechEnhanced === "any" ? undefined : isTechEnhanced === "true",
		});
	}

	return (
		<Box sx={{ p: 3, maxWidth: "100%" }}>
			<Typography variant="h5" fontWeight={700} gutterBottom>
				Study Room Availability
			</Typography>

			<Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
				<Box
					component="form"
					onSubmit={handleSubmit}
					sx={{
						display: "flex",
						flexWrap: "wrap",
						gap: 2,
						alignItems: "flex-end",
					}}
				>
					<TextField
						label="Date"
						type="date"
						size="small"
						value={date}
						onChange={(e) => setDate(e.target.value)}
						required
						slotProps={{ inputLabel: { shrink: true } }}
						sx={{ minWidth: 160 }}
					/>

					<TextField
						label="Time range"
						placeholder="e.g. 11:00am-5:00pm"
						size="small"
						value={timeRange}
						onChange={(e) => setTimeRange(e.target.value)}
						required
						sx={{ minWidth: 200 }}
					/>

					<TextField
						label="Location"
						placeholder="Optional"
						size="small"
						value={location}
						onChange={(e) => setLocation(e.target.value)}
						sx={{ minWidth: 160 }}
					/>

					<Stack direction="row" spacing={1}>
						<TextField
							label="Min cap"
							type="number"
							size="small"
							value={capacityMin}
							onChange={(e) => setCapacityMin(e.target.value)}
							sx={{ width: 90 }}
						/>
						<TextField
							label="Max cap"
							type="number"
							size="small"
							value={capacityMax}
							onChange={(e) => setCapacityMax(e.target.value)}
							sx={{ width: 90 }}
						/>
					</Stack>

					<FormControl size="small" sx={{ minWidth: 160 }}>
						<InputLabel>Tech enhanced</InputLabel>
						<MuiSelect
							label="Tech enhanced"
							value={isTechEnhanced}
							onChange={(e) =>
								setIsTechEnhanced(e.target.value as "any" | "true" | "false")
							}
						>
							<MenuItem value="any">Any</MenuItem>
							<MenuItem value="true">Yes</MenuItem>
							<MenuItem value="false">No</MenuItem>
						</MuiSelect>
					</FormControl>

					<MuiButton
						type="submit"
						variant="contained"
						disabled={loading}
						size="medium"
					>
						{loading ? "Searching…" : "Search"}
					</MuiButton>
				</Box>

				{error && (
					<Typography color="error" variant="body2" sx={{ mt: 1 }}>
						{error}
					</Typography>
				)}
			</Paper>

			{loading && (
				<Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
					<CircularProgress />
				</Box>
			)}

			{!loading && rooms && (
				<RoomHeatmap rooms={rooms} timeRange={displayedTimeRange} />
			)}
		</Box>
	);
}
