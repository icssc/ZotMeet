import { Paper } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import FormControlLabel from "@mui/material/FormControlLabel";
import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { format } from "date-fns";
import { useCallback, useEffect, useState } from "react";
import { RoomsHeatmapLegend } from "@/components/studyrooms/legend";
import { fetchStudyRooms } from "@/lib/rooms/get-rooms";
import { toLocalStr } from "@/lib/rooms/utils";
import {
	BUILDINGS,
	CAPACITY_RANGES,
	type StudyRooms,
} from "@/lib/types/studyrooms";

const MAX_FALLBACK_DAYS = 7;

const CAPACITY_PRESETS = CAPACITY_RANGES.map((r) =>
	"max" in r
		? { label: r.label, min: String(r.min), max: String(r.max) }
		: { label: r.label, min: String(r.min), max: "40" },
);

interface SidebarProps {
	defaultDate: Date;
	defaultStart: Date;
	defaultEnd: Date;
	setRooms: React.Dispatch<React.SetStateAction<StudyRooms["data"] | null>>;
	setCommittedDate: React.Dispatch<React.SetStateAction<Date | null>>;
	setCommittedStart: React.Dispatch<React.SetStateAction<Date | null>>;
	setCommittedEnd: React.Dispatch<React.SetStateAction<Date | null>>;
	setFallbackNotice: React.Dispatch<React.SetStateAction<string | null>>;
	setDrawerClose: React.Dispatch<React.SetStateAction<boolean>>;
}
export function Sidebar({
	defaultDate,
	defaultStart,
	defaultEnd,
	setRooms,
	setCommittedDate,
	setCommittedStart,
	setCommittedEnd,
	setFallbackNotice,
	setDrawerClose,
}: SidebarProps) {
	const [date, setDate] = useState<Date | null>(defaultDate);
	const [startTime, setStartTime] = useState<Date | null>(defaultStart);
	const [endTime, setEndTime] = useState<Date | null>(defaultEnd);
	const [location, setLocation] = useState<string | null>(null);
	const [capacityMin, setCapacityMin] = useState("");
	const [capacityMax, setCapacityMax] = useState("");
	const [isTechEnhanced, setIsTechEnhanced] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);

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

	const searchWithFallback = useCallback(
		async ({
			baseDate,
			startTime: slotStart,
			endTime: slotEnd,
			fallbackStart = slotStart,
			fallbackEnd = slotEnd,
			filters = {},
			updateFormState = false,
		}: {
			baseDate: Date;
			startTime: Date;
			endTime: Date;
			fallbackStart?: Date;
			fallbackEnd?: Date;
			filters?: {
				location?: string | null;
				capacityMin?: string;
				capacityMax?: string;
				isTechEnhanced?: boolean;
			};
			updateFormState?: boolean;
		}) => {
			for (let offset = 0; offset < MAX_FALLBACK_DAYS; offset++) {
				const tryDate = new Date(baseDate);
				tryDate.setDate(tryDate.getDate() + offset);
				const isFallback = offset > 0;
				const start = isFallback ? fallbackStart : slotStart;
				const end = isFallback ? fallbackEnd : slotEnd;

				try {
					const { data } = await fetchStudyRooms({
						date: format(tryDate, "yyyy-MM-dd"),
						timeRange: `${toLocalStr(start)}-${toLocalStr(end)}`,
						location: filters.location || undefined,
						capacityMin: filters.capacityMin
							? Number(filters.capacityMin)
							: undefined,
						capacityMax: filters.capacityMax
							? Number(filters.capacityMax)
							: undefined,
						isTechEnhanced: filters.isTechEnhanced || undefined,
					});

					if (data.length > 0) {
						const committedStartForDay = new Date(tryDate);
						committedStartForDay.setHours(
							start.getHours(),
							start.getMinutes(),
							0,
							0,
						);
						const committedEndForDay = new Date(tryDate);
						committedEndForDay.setHours(end.getHours(), end.getMinutes(), 0, 0);
						setRooms(data);
						setCommittedDate(tryDate);
						setCommittedStart(committedStartForDay);
						setCommittedEnd(committedEndForDay);
						if (updateFormState) {
							setDate(tryDate);
							setStartTime(committedStartForDay);
							setEndTime(committedEndForDay);
						}
						if (isFallback) {
							setFallbackNotice(
								`No rooms available for ${format(baseDate, "EEEE, MMM d")}. Showing results for ${format(tryDate, "EEEE, MMM d")} instead.`,
							);
						}
						return true;
					}
				} catch (err) {
					setError(err instanceof Error ? err.message : "API call failed");
					return false;
				}
			}
			setRooms([]);
			setCommittedDate(null);
			setCommittedStart(null);
			setCommittedEnd(null);
			setError(`No rooms available in the next ${MAX_FALLBACK_DAYS} days.`);
			return false;
		},
		// State setters are stable; listed for react-hooks/exhaustive-deps.
		[
			setRooms,
			setCommittedDate,
			setCommittedStart,
			setCommittedEnd,
			setFallbackNotice,
		],
	);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);
		setFallbackNotice(null);

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

		const baseDate = new Date(date);
		baseDate.setHours(0, 0, 0, 0);
		setIsLoading(true);
		try {
			const foundRooms = await searchWithFallback({
				baseDate,
				startTime,
				endTime,
				filters: { location, capacityMin, capacityMax, isTechEnhanced },
			});
			if (foundRooms) {
				setDrawerClose(false);
			}
		} finally {
			setIsLoading(false);
		}
	};
	useEffect(() => {
		const fallbackStart = new Date(defaultDate);
		fallbackStart.setHours(11, 0, 0, 0);
		const fallbackEnd = new Date(defaultDate);
		fallbackEnd.setHours(17, 0, 0, 0);
		searchWithFallback({
			baseDate: defaultDate,
			startTime: defaultStart,
			endTime: defaultEnd,
			fallbackStart,
			fallbackEnd,
			updateFormState: true,
		});
	}, [searchWithFallback, defaultDate, defaultStart, defaultEnd]);
	return (
		<Stack
			direction="column"
			sx={{
				width: 360,
				pt: 2,
				pr: { xs: 0, md: 2 },
				pb: { xs: 2, md: 0 },
			}}
		>
			<Box className="pb-4">
				<RoomsHeatmapLegend
					availabilityColor="#86efac"
					notAvailableColor="#fca5a5"
				/>
			</Box>
			<Paper variant="outlined">
				<Box
					component="form"
					onSubmit={handleSubmit}
					sx={{
						display: "flex",
						flex: 1,
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
							onChange={setStartTime}
							slotProps={{
								textField: {
									fullWidth: true,
									sx: {
										"& .MuiIconButton-edgeEnd": {
											marginRight: 0,
										},
									},
								},
							}}
						/>
						<TimePicker
							label="End Time"
							value={endTime}
							onChange={setEndTime}
							slotProps={{
								textField: {
									fullWidth: true,
									sx: {
										"& .MuiIconButton-edgeEnd": {
											marginRight: 0,
										},
									},
								},
							}}
						/>
					</Stack>

					<Autocomplete
						freeSolo
						options={BUILDINGS}
						value={location}
						onChange={(_, val) => setLocation(val)}
						onInputChange={(_, val, reason) => {
							if (reason !== "reset") setLocation(val || null);
						}}
						renderInput={(params) => (
							<TextField {...params} label="Location" fullWidth />
						)}
					/>

					<div>
						{CAPACITY_PRESETS.map(({ label, min, max }) => (
							<Chip
								key={label}
								variant="outlined"
								color={
									capacityMin === min && capacityMax === max
										? "primary"
										: "default"
								}
								label={label}
								clickable
								onClick={() => {
									setCapacityMin(min);
									setCapacityMax(max);
								}}
							/>
						))}
					</div>
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

					<Button
						type="submit"
						variant="contained"
						fullWidth
						disabled={isLoading}
					>
						{isLoading ? "Searching..." : "Search Rooms"}
					</Button>
				</Box>
			</Paper>
		</Stack>
	);
}
