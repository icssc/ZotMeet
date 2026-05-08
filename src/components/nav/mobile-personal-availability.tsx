"use client";

import {
	Paper,
	ToggleButton,
	ToggleButtonGroup,
	Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import type { Dispatch, SetStateAction } from "react";
import type { PaintMode } from "@/lib/availability/paint-selection";
import { useAvailabilityStore } from "@/store/useAvailabilityStore";
import { PERSONAL_AVAILABILITY_OPTIONS } from "./personal-availability-options";

export interface MobilePersonalAvailabilitySidebarProps {
	meetingId: string;
	userTimezone: string;
	importGridIsoSet: ReadonlySet<string>;
	canImport: boolean;
	onImportSlots: (slots: {
		meetingAvailabilities: string[];
		ifNeededAvailabilities: string[];
	}) => void;
}

export function MobilePersonalAvailabilitySidebar() {
	const paintMode = useAvailabilityStore((s) => s.paintMode);
	const setPaintMode = useAvailabilityStore((s) => s.setPaintMode);

	return (
		<div className="pointer-events-none fixed inset-x-0 bottom-0 z-[1001] flex justify-center px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
			<Paper
				elevation={3}
				sx={{
					pointerEvents: "auto",
					display: "inline-flex",
					justifyContent: "center",
					borderRadius: 3,
					p: 0.5,
					width: "min(90vw)",
				}}
			>
				<ToggleButtonGroup
					exclusive
					value={paintMode}
					onChange={(_, val) => val && setPaintMode(val)}
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
