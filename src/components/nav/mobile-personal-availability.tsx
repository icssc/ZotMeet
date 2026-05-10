"use client";

import { ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { MobileAvailabilityHeader } from "@/components/availability/header/mobile-availability-header";
import { useAvailabilityStore } from "@/store/useAvailabilityStore";
import { MobileIsland } from "../mobile/mobile-island";
import { PERSONAL_AVAILABILITY_OPTIONS } from "./personal-availability-options";

export interface MobilePersonalAvailabilitySidebarProps {
	revertPersonalDraft: () => void;
	exitPersonalView: () => void;
	runPersonalSave: () => Promise<boolean>;
	isPersonalSaveDisabled: boolean;
	handleScheduleCancel: () => void;
	runScheduleSave: () => Promise<boolean>;
	isScheduleSaveDisabled: boolean;
}

export function MobilePersonalAvailabilitySidebar({
	revertPersonalDraft,
	exitPersonalView,
	runPersonalSave,
	isPersonalSaveDisabled,
	handleScheduleCancel,
	runScheduleSave,
	isScheduleSaveDisabled,
}: MobilePersonalAvailabilitySidebarProps) {
	const availabilityView = useAvailabilityStore((s) => s.availabilityView);
	const paintMode = useAvailabilityStore((s) => s.paintMode);
	const setPaintMode = useAvailabilityStore((s) => s.setPaintMode);

	return (
		<div>
			<MobileAvailabilityHeader
				revertPersonalDraft={revertPersonalDraft}
				exitPersonalView={exitPersonalView}
				runPersonalSave={runPersonalSave}
				isPersonalSaveDisabled={isPersonalSaveDisabled}
				handleScheduleCancel={handleScheduleCancel}
				runScheduleSave={runScheduleSave}
				isScheduleSaveDisabled={isScheduleSaveDisabled}
			/>

			{availabilityView === "personal" ? (
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
			) : null}
		</div>
	);
}
