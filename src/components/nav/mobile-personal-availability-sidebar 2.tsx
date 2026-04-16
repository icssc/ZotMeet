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
import { ExpandMore, KeyboardDoubleArrowDown } from "@mui/icons-material";

const options: { value: Availability; label: string; icon: React.ReactNode }[] =
	[
        {
			value: "available",
			label: "More Options",
			icon: (

				<ExpandMore/>
			),
		},
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

interface MobilePersonalAvailabilitySidebar {
	meetingId: string;
	userTimezone: string;
	availability: Availability;
	setAvailability: Dispatch<SetStateAction<Availability>>;
	importGridIsoSet: ReadonlySet<string>;
	canImport: boolean;
	onImportSlots: (slotIsoStrings: string[]) => void;
}

export function MobilePersonalAvailabilitySidebar({
	meetingId,
	userTimezone,
	importGridIsoSet,
	canImport,
	onImportSlots,
	availability,
	setAvailability,
}: MobilePersonalAvailabilitySidebar) {
	return (
		<div className="fixed bottom-0 left-1/2 -translate-x-1/2">
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
		</div>
	);
}
