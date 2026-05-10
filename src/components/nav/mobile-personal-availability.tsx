"use client";

import { ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useAvailabilityStore } from "@/store/useAvailabilityStore";
import { MobileAvailabilityHeader } from "../availability/header/mobile-availability-header";
import { MobileIsland } from "../mobile/mobile-island";
import { PERSONAL_AVAILABILITY_OPTIONS } from "./personal-availability-options";

export interface MobilePersonalAvailabilitySidebarProps {
	revertPersonalDraft: () => void;
	exitPersonalView: () => void;
	runPersonalSave: () => Promise<boolean>;
	isPersonalSaveDisabled: boolean;
}

export function MobilePersonalAvailabilitySidebar({
	revertPersonalDraft,
	exitPersonalView,
	runPersonalSave,
	isPersonalSaveDisabled,
}: MobilePersonalAvailabilitySidebarProps) {
	const paintMode = useAvailabilityStore((s) => s.paintMode);
	const setPaintMode = useAvailabilityStore((s) => s.setPaintMode);

	return (
		<div>
			<MobileAvailabilityHeader
				revertPersonalDraft={revertPersonalDraft}
				exitPersonalView={exitPersonalView}
				runPersonalSave={runPersonalSave}
				isPersonalSaveDisabled={isPersonalSaveDisabled}
			/>

			<MobileIsland>
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
			</MobileIsland>
		</div>
	);
}
