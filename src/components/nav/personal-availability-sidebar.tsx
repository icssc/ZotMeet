"use client";

import {
	getImportableMeetings,
	getUserAvailabilityForMeeting,
} from "@actions/availability/copy/action";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import {
	Accordion,
	AccordionDetails,
	AccordionSummary,
	Box,
	Button,
	Checkbox,
	FormControlLabel,
	Stack,
	Switch,
	ToggleButton,
	ToggleButtonGroup,
	Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import { PERSONAL_AVAILABILITY_OPTIONS } from "@/components/nav/personal-availability-options";
import type { PaintMode } from "@/lib/availability/paint-selection";
import { filterTimestampsToMeetingGrid } from "@/lib/availability/utils";
import type { GoogleCalendarInfo } from "@/lib/types/availability";
import { useAvailabilityStore } from "@/store/useAvailabilityStore";

type RespondedMeeting = { id: string; title: string; createdAt: Date };
type ImportedMeetingAvailability = {
	meetingAvailabilities: string[];
	ifNeededAvailabilities: string[];
};

interface CalendarOverlayRowProps {
	calendar: GoogleCalendarInfo;
	hidden: boolean;
	onToggle: (calendarId: string) => void;
}

const CalendarOverlayRow = memo(function CalendarOverlayRow({
	calendar,
	hidden,
	onToggle,
}: CalendarOverlayRowProps) {
	const handleChange = useCallback(
		() => onToggle(calendar.id),
		[onToggle, calendar.id],
	);

	return (
		<FormControlLabel
			label={
				<Stack direction="row" alignItems="center" spacing={1}>
					<Box
						sx={{
							width: 10,
							height: 10,
							borderRadius: "50%",
							bgcolor: calendar.color,
							flexShrink: 0,
						}}
					/>
					<Typography variant="body2">{calendar.name}</Typography>
				</Stack>
			}
			control={<Checkbox checked={!hidden} onChange={handleChange} />}
		/>
	);
});

export interface PersonalAvailabilitySidebarProps {
	meetingId: string;
	userTimezone: string;
	importGridIsoSet: ReadonlySet<string>;
	canImport: boolean;
	onImportSlots: (slots: ImportedMeetingAvailability) => void;
	onClearAvailability: () => void;
	googleCalendars: GoogleCalendarInfo[];
	layout?: string;
}

export function PersonalAvailabilitySidebar({
	meetingId,
	userTimezone,
	importGridIsoSet,
	canImport,
	onImportSlots,
	onClearAvailability,
	googleCalendars,
	layout,
}: PersonalAvailabilitySidebarProps) {
	const [importableMeetings, setImportableMeetings] = useState<
		RespondedMeeting[]
	>([]);
	const availabilityCache = useRef(
		new Map<string, ImportedMeetingAvailability>(),
	);
	const setImportPreview = useAvailabilityStore((s) => s.setImportPreview);
	const paintMode = useAvailabilityStore((s) => s.paintMode);
	const setPaintMode = useAvailabilityStore((s) => s.setPaintMode);
	const hiddenCalendarIds = useAvailabilityStore((s) => s.hiddenCalendarIds);
	const toggleCalendarVisibility = useAvailabilityStore(
		(s) => s.toggleCalendarVisibility,
	);

	// biome-ignore lint/correctness/useExhaustiveDependencies: reset cached rows when switching meetings
	useEffect(() => {
		availabilityCache.current.clear();
	}, [meetingId]);

	useEffect(() => {
		void getImportableMeetings(meetingId, userTimezone).then((result) => {
			if (result.success && result.meetings) {
				setImportableMeetings([...result.meetings]);
			}
		});
	}, [meetingId, userTimezone]);

	const showPreviewForMeeting = useCallback(
		async (sourceMeetingId: string) => {
			let raw = availabilityCache.current.get(sourceMeetingId);
			if (raw === undefined) {
				const result = await getUserAvailabilityForMeeting(sourceMeetingId);
				if (!result.success) {
					setImportPreview(null);
					return;
				}
				raw = {
					meetingAvailabilities: result.meetingAvailabilities ?? [],
					ifNeededAvailabilities: result.ifNeededAvailabilities ?? [],
				};
				availabilityCache.current.set(sourceMeetingId, raw);
			}
			const filtered = filterTimestampsToMeetingGrid(
				[...raw.meetingAvailabilities, ...raw.ifNeededAvailabilities],
				importGridIsoSet,
			);
			if (filtered.length === 0) {
				setImportPreview(null);
				return;
			}
			setImportPreview({
				availableIsoStrings: filterTimestampsToMeetingGrid(
					raw.meetingAvailabilities,
					importGridIsoSet,
				),
				ifNeededIsoStrings: filterTimestampsToMeetingGrid(
					raw.ifNeededAvailabilities,
					importGridIsoSet,
				),
			});
		},
		[importGridIsoSet, setImportPreview],
	);

	const importFromMeeting = useCallback(
		async (sourceMeetingId: string) => {
			if (!canImport) return;
			let raw = availabilityCache.current.get(sourceMeetingId);
			if (raw === undefined) {
				const result = await getUserAvailabilityForMeeting(sourceMeetingId);
				if (!result.success) return;
				raw = {
					meetingAvailabilities: result.meetingAvailabilities ?? [],
					ifNeededAvailabilities: result.ifNeededAvailabilities ?? [],
				};
				availabilityCache.current.set(sourceMeetingId, raw);
			}
			const filteredMeetingAvailabilities = filterTimestampsToMeetingGrid(
				raw.meetingAvailabilities,
				importGridIsoSet,
			);
			const filteredIfNeededAvailabilities = filterTimestampsToMeetingGrid(
				raw.ifNeededAvailabilities,
				importGridIsoSet,
			);
			if (
				filteredMeetingAvailabilities.length === 0 &&
				filteredIfNeededAvailabilities.length === 0
			) {
				return;
			}
			onImportSlots({
				meetingAvailabilities: filteredMeetingAvailabilities,
				ifNeededAvailabilities: filteredIfNeededAvailabilities,
			});
		},
		[canImport, importGridIsoSet, onImportSlots],
	);

	return (
		<div
			className={
				layout === "sheet"
					? "p-4"
					: "fixed h-96 w-full px-4 transition-transform duration-500 ease-in-out sm:right-0 sm:left-auto sm:w-96 lg:relative lg:flex lg:h-full lg:min-h-0 lg:w-full lg:flex-1 lg:shrink-0 lg:flex-col lg:overflow-y-auto lg:px-4"
			}
		>
			<div>
				<Typography variant="h6">Add Availability</Typography>
				<Typography variant="caption" color="textSecondary">
					Drag over the calendar to add your availability
				</Typography>
			</div>

			<div className="mt-6">
				<Typography variant="h6">Availability Settings</Typography>
				<Typography variant="caption" color="textSecondary">
					Click to switch between availability states
				</Typography>
			</div>

			<div className="mt-2 flex w-full flex-col items-stretch gap-2">
				<ToggleButtonGroup
					exclusive
					fullWidth
					value={paintMode}
					onChange={(_, val: PaintMode | null) => val && setPaintMode(val)}
					aria-label="availability"
				>
					{PERSONAL_AVAILABILITY_OPTIONS.map(({ value, label, icon }) => (
						<ToggleButton
							key={value}
							value={value}
							aria-label={label}
							sx={(theme) => ({
								display: "flex",
								flexDirection: "column",
								gap: 1,
								px: 2,
								py: 1.5,
								"&.Mui-selected": {
									backgroundColor: alpha(
										theme.palette.primary.main,
										theme.palette.mode === "dark" ? 0.2 : 0.12,
									),
									borderColor: theme.palette.primary.main,
								},
							})}
						>
							{icon}
							<Typography variant="caption">{label}</Typography>
						</ToggleButton>
					))}
				</ToggleButtonGroup>

				<Button
					variant="outlined"
					color="inherit"
					fullWidth
					disabled={!canImport}
					onClick={onClearAvailability}
				>
					Clear availability
				</Button>

				<Accordion
					defaultExpanded
					elevation={0}
					sx={{
						boxShadow: "none",
						border: "none",
						"&:before": { display: "none" },
					}}
				>
					<AccordionSummary
						expandIcon={<ArrowDropDownIcon />}
						aria-controls="panel1-content"
						id="panel1-header"
					>
						<Typography variant="button">
							Import Previous Availability
						</Typography>
					</AccordionSummary>
					<AccordionDetails
						onMouseLeave={() => setImportPreview(null)}
						sx={{ pt: 0 }}
					>
						{importableMeetings.length === 0 ? (
							<Typography variant="caption" color="textSecondary">
								No past meetings with overlapping slots.
							</Typography>
						) : (
							<Stack spacing={0.25}>
								{importableMeetings.map((meeting) => (
									<Stack
										key={meeting.id}
										direction="row"
										alignItems="center"
										spacing={1}
										onMouseEnter={() => void showPreviewForMeeting(meeting.id)}
										onFocus={() => void showPreviewForMeeting(meeting.id)}
										onBlur={() => setImportPreview(null)}
										tabIndex={-1}
										sx={{
											borderRadius: 1,
											px: 1,
											py: 0.5,
											"&:hover": { bgcolor: "action.hover" },
										}}
									>
										<Typography variant="body2" sx={{ flex: 1, minWidth: 0 }}>
											{meeting.title}
										</Typography>
										<Button
											type="button"
											size="small"
											variant="outlined"
											disabled={!canImport}
											aria-label={`Import availability from ${meeting.title}`}
											onClick={(e) => {
												e.stopPropagation();
												void importFromMeeting(meeting.id);
											}}
										>
											Import
										</Button>
									</Stack>
								))}
							</Stack>
						)}
					</AccordionDetails>
				</Accordion>

				<Accordion
					defaultExpanded
					elevation={0}
					sx={{
						boxShadow: "none",
						border: "none",
						"&:before": { display: "none" },
					}}
				>
					<AccordionSummary
						expandIcon={<ArrowDropDownIcon />}
						aria-controls="calendar-overlays-content"
						id="calendar-overlays-header"
					>
						<Stack>
							<Typography variant="button">Calendar Overlays</Typography>
							<Typography variant="caption" color="textSecondary">
								Selected schedules will overlay their events.
							</Typography>
						</Stack>
					</AccordionSummary>
					<AccordionDetails sx={{ pt: 0 }}>
						{googleCalendars.length === 0 ? (
							<Typography variant="caption" color="textSecondary">
								No Google Calendars connected.
							</Typography>
						) : (
							<Stack spacing={0.25}>
								{googleCalendars.map((cal) => (
									<CalendarOverlayRow
										key={cal.id}
										calendar={cal}
										hidden={hiddenCalendarIds.has(cal.id)}
										onToggle={toggleCalendarVisibility}
									/>
								))}
							</Stack>
						)}
					</AccordionDetails>
				</Accordion>

				<div className="mt-6">
					<div className="flex">
						<Typography variant="h6">Overlay Availabilities</Typography>
						{/* Need to add Switch Functionality */}
						<Switch className="ml-auto" size="medium" />
					</div>

					<Typography variant="caption" color="textSecondary">
						View all availability while inputting your own
					</Typography>
				</div>
			</div>
		</div>
	);
}
