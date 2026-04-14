"use client";

import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import FormControlLabel from "@mui/material/FormControlLabel";
import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { format } from "date-fns";
import { useEffect, useState } from "react";

import { RoomsHeatmap } from "@/components/studyrooms/heatmap/rooms-heatmap";
import { fetchStudyRooms } from "@/lib/rooms/get-rooms";
import type { StudyRooms } from "@/lib/types/studyrooms";

const LOCATION_OPTIONS = [
	"Plaza Verde",
	"Langson Library",
	"Science Library",
	"Multimedia Resources Center",
	"Gateway Study Center",
	"Ayala Science Library",
];

const toLocalStr = (d: Date) => {
	const h = d.getHours();
	const m = d.getMinutes();
	return `${h % 12 || 12}:${m.toString().padStart(2, "0")}${h >= 12 ? "pm" : "am"}`;
};

export default function Page() {
	const defaultStart = new Date();
	defaultStart.setHours(11, 0, 0, 0);
	const defaultEnd = new Date();
	defaultEnd.setHours(17, 0, 0, 0);

	const tomorrow = new Date();
	tomorrow.setDate(tomorrow.getDate() + 1);

	const [date, setDate] = useState<Date | null>(tomorrow);
	const [startTime, setStartTime] = useState<Date | null>(defaultStart);
	const [endTime, setEndTime] = useState<Date | null>(defaultEnd);
	const [committedStart, setCommittedStart] = useState<Date | null>(
		defaultStart,
	);
	const [committedEnd, setCommittedEnd] = useState<Date | null>(defaultEnd);
	const [committedDate, setCommittedDate] = useState<Date | null>(tomorrow);
	const [location, setLocation] = useState<string | null>(null);
	const [capacityMin, setCapacityMin] = useState("");
	const [capacityMax, setCapacityMax] = useState("");
	const [isTechEnhanced, setIsTechEnhanced] = useState(false);
	const [rooms, setRooms] = useState<StudyRooms["data"] | null>(null);
	const [error, setError] = useState<string | null>(null);

	const activeFilters = [
		date && { label: `Date: ${format(date, "MMM d, yyyy")}`, key: "date" },
		startTime &&
			endTime && {
				label: `Time: ${format(startTime, "h:mmaaa")}–${format(endTime, "h:mmaaa")}`,
				key: "time",
			},
		location && { label: `Location: ${location}`, key: "location" },
		(capacityMin || capacityMax) && {
			label: `Capacity: ${capacityMin || "any"}–${capacityMax || "any"}`,
			key: "capacity",
		},
		isTechEnhanced && { label: "Tech Enhanced", key: "techEnhanced" },
	].filter(Boolean) as { label: string; key: string }[];

	const handleClearFilter = (key: string) => {
		if (key === "date") setDate(null);
		if (key === "time") {
			setStartTime(null);
			setEndTime(null);
		}
		if (key === "location") setLocation(null);
		if (key === "capacity") {
			setCapacityMin("");
			setCapacityMax("");
		}
		if (key === "techEnhanced") setIsTechEnhanced(false);
	};

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		setError(null);
		setRooms(null);

		if (!date || !startTime || !endTime) {
			setError("Please select a date and time range.");
			return;
		}

		const today = new Date();
		today.setHours(0, 0, 0, 0);
		if (date < today) {
			setError("Date cannot be in the past.");
			return;
		}

		if (endTime <= startTime) {
			setError("End time must be after start time.");
			return;
		}

		if (
			capacityMin &&
			capacityMax &&
			Number(capacityMin) > Number(capacityMax)
		) {
			setError("Min capacity cannot be greater than max capacity.");
			return;
		}

		const tr = `${toLocalStr(startTime)}-${toLocalStr(endTime)}`;

		try {
			const { data } = await fetchStudyRooms({
				date: format(date, "yyyy-MM-dd"),
				timeRange: tr,
				location: location || undefined,
				capacityMin: capacityMin ? Number(capacityMin) : undefined,
				capacityMax: capacityMax ? Number(capacityMax) : undefined,
				isTechEnhanced: isTechEnhanced || undefined,
			});

			setRooms(data);
			setCommittedDate(date);
			setCommittedStart(startTime);
			setCommittedEnd(endTime);
		} catch (err) {
			setError(err instanceof Error ? err.message : "API call failed");
		}
	}

	useEffect(() => {
		const tmrw = new Date();
		tmrw.setDate(tmrw.getDate() + 1);
		const today = format(tmrw, "yyyy-MM-dd");
		const defaultTr = "11:00am-5:00pm";
		const initialCommittedStart = new Date();
		initialCommittedStart.setHours(11, 0, 0, 0);
		const initialCommittedEnd = new Date();
		initialCommittedEnd.setHours(17, 0, 0, 0);
		fetchStudyRooms({ date: today, timeRange: defaultTr })
			.then(({ data }) => {
				setRooms(data);
				setCommittedDate(tmrw);
				setCommittedStart(initialCommittedStart);
				setCommittedEnd(initialCommittedEnd);
			})
			.catch((err) =>
				setError(err instanceof Error ? err.message : "API call failed"),
			);
	}, []);

	return (
		<LocalizationProvider dateAdapter={AdapterDateFns}>
			<Box
				component="form"
				onSubmit={handleSubmit}
				sx={{
					display: "flex",
					flexDirection: "column",
					gap: 2,
					maxWidth: "sm",
					p: 2,
				}}
			>
				<DatePicker
					label="Date"
					value={date}
					onChange={setDate}
					slotProps={{ textField: { fullWidth: true } }}
				/>

				<Stack direction="row" spacing={2}>
					<TimePicker
						label="Start Time"
						value={startTime}
						onAccept={setStartTime}
						slotProps={{ textField: { fullWidth: true } }}
					/>
					<TimePicker
						label="End Time"
						value={endTime}
						onAccept={setEndTime}
						slotProps={{ textField: { fullWidth: true } }}
					/>
				</Stack>

				<Autocomplete
					freeSolo
					options={LOCATION_OPTIONS}
					value={location}
					onChange={(_, val) => setLocation(val)}
					onInputChange={(_, val, reason) => {
						if (reason !== "reset") setLocation(val || null);
					}}
					renderInput={(params) => (
						<TextField {...params} label="Location" fullWidth />
					)}
				/>

				<Stack direction="row" spacing={2}>
					<TextField
						label="Min Capacity"
						type="number"
						value={capacityMin}
						onChange={(e) => setCapacityMin(e.target.value)}
						fullWidth
						slotProps={{ htmlInput: { min: 0 } }}
					/>
					<TextField
						label="Max Capacity"
						type="number"
						value={capacityMax}
						onChange={(e) => setCapacityMax(e.target.value)}
						fullWidth
						slotProps={{ htmlInput: { min: 0 } }}
					/>
				</Stack>

				<FormControlLabel
					control={
						<Switch
							checked={isTechEnhanced}
							onChange={(e) => setIsTechEnhanced(e.target.checked)}
						/>
					}
					label="Tech Enhanced"
				/>

				{activeFilters.length > 0 && (
					<Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
						{activeFilters.map((f) => (
							<Chip
								key={f.key}
								label={f.label}
								onDelete={() => handleClearFilter(f.key)}
								size="small"
								variant="outlined"
							/>
						))}
					</Stack>
				)}

				{error && (
					<Typography color="error" variant="body2">
						{error}
					</Typography>
				)}

				<Button type="submit" variant="contained" fullWidth>
					Search Rooms
				</Button>
			</Box>

			{rooms && committedDate && committedStart && committedEnd && (
				<RoomsHeatmap
					rooms={rooms}
					searchDate={committedDate}
					startTime={committedStart}
					endTime={committedEnd}
				/>
			)}

			{/*rooms && committedStart && committedEnd && (
				<RoomResults
					rooms={rooms}
					startTime={committedStart}
					endTime={committedEnd}
				/>
			)*/}
		</LocalizationProvider>
	);
}
