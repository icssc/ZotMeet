"use client";

import { getRespondedMeetings } from "@actions/availability/copy/action";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import {
	Accordion,
	AccordionDetails,
	AccordionSummary,
	Button,
	Checkbox,
	FormControlLabel,
	FormGroup,
	Switch,
	ToggleButton,
	ToggleButtonGroup,
	Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import React, { useEffect, useState } from "react";

type RespondedMeeting = { id: string; title: string; createdAt: Date };
type Availability = "available" | "if-needed" | "unavailable";

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
}

export function PersonalAvailabilitySidebar({
	meetingId,
}: PersonalAvailabilitySidebarProps) {
	const [availability, setAvailability] =
		React.useState<Availability>("available");
	const [respondedMeetings, setRespondedMeetings] = useState<
		RespondedMeeting[]
	>([]);

	useEffect(() => {
		getRespondedMeetings(meetingId).then((result) => {
			if (result.success && result.meetings) {
				setRespondedMeetings(result.meetings);
			}
		});
	}, [meetingId]);

	return (
		<div className="fixed h-96 w-full px-4 transition-transform duration-500 ease-in-out sm:right-0 sm:left-auto sm:w-96 lg:relative lg:h-auto lg:w-96 lg:shrink-0">
			<div>
				<Typography variant="h6">Add Availability</Typography>
				<Typography variant="caption" color="textSecondary">
					Drag over the calendar to add your availability
				</Typography>
			</div>

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
					<Typography variant="button">Import Previous Availability</Typography>
				</AccordionSummary>
				<AccordionDetails>
					<FormGroup>
						{respondedMeetings.map((meeting) => (
							<FormControlLabel
								control={<Checkbox defaultChecked />}
								label={meeting.title}
								key={meeting.id}
							/>
						))}
					</FormGroup>
				</AccordionDetails>
			</Accordion>

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
