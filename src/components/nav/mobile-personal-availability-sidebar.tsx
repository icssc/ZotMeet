"use client";

import {
	Paper,
	ToggleButton,
	ToggleButtonGroup,
	Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import type React from "react";
import type { Dispatch, SetStateAction } from "react";
import type { Availability } from "@/components/availability/availability";

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

export interface MobilePersonalAvailabilitySidebarProps {
	meetingId: string;
	userTimezone: string;
	availability: Availability;
	setAvailability: Dispatch<SetStateAction<Availability>>;
	importGridIsoSet: ReadonlySet<string>;
	canImport: boolean;
	onImportSlots: (slotIsoStrings: string[]) => void;
}

export function MobilePersonalAvailabilitySidebar({
	availability,
	setAvailability,
}: MobilePersonalAvailabilitySidebarProps) {
	return (
		<div className="pointer-events-none fixed inset-x-0 bottom-0 z-[1001] flex justify-center px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
			<Paper
				elevation={3}
				sx={{
					pointerEvents: "auto",
					display: "inline-flex",
					alignItems: "stretch",
					borderRadius: 3,
					p: 0.5,
					boxShadow: 3,
					bgcolor: "background.paper",
					width: "min(100vw - 1rem, 28rem)",
				}}
			>
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
								px: 1.5,
								py: 1.25,
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
			</Paper>
		</div>
	);
}
