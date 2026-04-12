"use client";

import {
	Button,
	ToggleButton,
	ToggleButtonGroup,
	Typography,
} from "@mui/material";
import React from "react";

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

export function PersonalAvailabilitySidebar() {
	const [availability, setAvailability] =
		React.useState<Availability>("available");

	return (
		<div>
			<div>
				<Typography variant="h6">Add Availability</Typography>
				<Typography variant="caption">
					Drag over the calendar to add your availability
				</Typography>
			</div>
			<div className="mt-6">
				<Typography variant="h6">Availability Settings</Typography>
				<Typography variant="caption">
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
							sx={{
								display: "flex",
								flexDirection: "column",
								gap: 1,
								px: 2,
								py: 1.5,
								"&.Mui-selected": {
									background: "#FBEAF0",
									borderColor: "#ED93B1",
								},
							}}
						>
							{icon}
							<Typography variant="caption">{label}</Typography>
						</ToggleButton>
					))}
				</ToggleButtonGroup>

				<Button variant="outlined" color="inherit" fullWidth>
					Clear availability
				</Button>
			</div>
		</div>
	);
}
