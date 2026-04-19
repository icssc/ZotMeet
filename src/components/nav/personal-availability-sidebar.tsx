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
	Button,
	Stack,
	Switch,
	ToggleButton,
	ToggleButtonGroup,
	Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import type React from "react";
import type { Dispatch, SetStateAction } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { filterTimestampsToMeetingGrid } from "@/lib/availability/utils";
import { useAvailabilityStore } from "@/store/useAvailabilityStore";
import type { Availability } from "../availability/availability";

type RespondedMeeting = { id: string; title: string; createdAt: Date };

const options: { value: Availability; label: string; icon: React.ReactNode }[] =
	[
		{
			value: "available",
			label: "Available",
			icon: (
				<div
					style={{
						width: 20,
						height: 20,
						borderRadius: "50%",
						background: "#D4537E",
					}}
				/>
			),
		},
		{
			value: "if-needed",
			label: "If Needed",
			icon: (
				<div
					style={{
						width: 20,
						height: 20,
						borderRadius: "50%",
						border: "2px solid #ED93B1",
						background:
							"repeating-linear-gradient(45deg, #ED93B1 0px, #ED93B1 1.5px, transparent 1.5px, transparent 4px)",
						boxSizing: "border-box",
					}}
				/>
			),
		},
		{
			value: "unavailable",
			label: "Unavailable",
			icon: (
				<div
					style={{
						width: 20,
						height: 20,
						borderRadius: "50%",
						border: "2px solid #D3D1C7",
						boxSizing: "border-box",
					}}
				/>
			),
		},
	];

interface PersonalAvailabilitySidebarProps {
	meetingId: string;
	userTimezone: string;
	availability: Availability;
	setAvailability: Dispatch<SetStateAction<Availability>>;
	importGridIsoSet: ReadonlySet<string>;
	canImport: boolean;
	onImportSlots: (slotIsoStrings: string[]) => void;
}

export function PersonalAvailabilitySidebar({
	meetingId,
	userTimezone,
	importGridIsoSet,
	canImport,
	onImportSlots,
	availability,
	setAvailability,
}: PersonalAvailabilitySidebarProps) {
	const [importableMeetings, setImportableMeetings] = useState<
		RespondedMeeting[]
	>([]);
	const availabilityCache = useRef(new Map<string, string[]>());
	const setImportPreview = useAvailabilityStore((s) => s.setImportPreview);

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
				if (!result.success || !result.meetingAvailabilities?.length) {
					setImportPreview(null);
					return;
				}
				raw = result.meetingAvailabilities;
				availabilityCache.current.set(sourceMeetingId, raw);
			}
			const filtered = filterTimestampsToMeetingGrid(raw, importGridIsoSet);
			setImportPreview(filtered.length ? filtered : null);
		},
		[importGridIsoSet, setImportPreview],
	);

	const importFromMeeting = useCallback(
		async (sourceMeetingId: string) => {
			if (!canImport) return;
			let raw = availabilityCache.current.get(sourceMeetingId);
			if (raw === undefined) {
				const result = await getUserAvailabilityForMeeting(sourceMeetingId);
				if (!result.success || !result.meetingAvailabilities?.length) return;
				raw = result.meetingAvailabilities;
				availabilityCache.current.set(sourceMeetingId, raw);
			}
			const filtered = filterTimestampsToMeetingGrid(raw, importGridIsoSet);
			if (filtered.length === 0) return;
			onImportSlots(filtered);
		},
		[canImport, importGridIsoSet, onImportSlots],
	);

	return (
		<div className="fixed h-96 w-full px-4 transition-transform duration-500 ease-in-out sm:right-0 sm:left-auto sm:w-96 lg:relative lg:h-auto lg:w-96 lg:shrink-0">
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
					value={availability}
					onChange={(_, val) => val && setAvailability(val)}
					aria-label="availability"
				>
					{options.map(({ value, label, icon }) => (
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

				<Button variant="outlined" color="inherit" fullWidth>
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
						aria-controls="panel1-content"
						id="panel1-header"
					>
						<Typography variant="button">Calendar Overlays</Typography>
					</AccordionSummary>
					<AccordionDetails></AccordionDetails>
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
