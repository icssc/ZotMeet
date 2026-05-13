"use client";

import { KeyboardArrowDown } from "@mui/icons-material";
import {
	Button,
	ToggleButton,
	ToggleButtonGroup,
	Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useEffect, useState } from "react";
import { MobileAvailabilityHeader } from "@/components/availability/header/mobile-availability-header";
import { MuiBottomSheet } from "@/components/ui/mui/mui-bottom-sheet";
import { useAvailabilityStore } from "@/store/useAvailabilityStore";
import { MobileIsland } from "../mobile/mobile-island";
import { PERSONAL_AVAILABILITY_OPTIONS } from "./personal-availability-options";
import {
	PersonalAvailabilitySidebar,
	type PersonalAvailabilitySidebarProps,
} from "./personal-availability-sidebar";

export interface MobilePersonalAvailabilitySidebarProps {
	revertPersonalDraft: () => void;
	exitToGroupView: () => void;
	runPersonalSave: () => Promise<boolean>;
	isPersonalSaveDisabled: boolean;
	handleScheduleCancel: () => void;
	runScheduleSave: () => Promise<boolean>;
	isScheduleSaveDisabled: boolean;
	personalSidebarProps: PersonalAvailabilitySidebarProps;
}

export function MobilePersonalAvailabilitySidebar({
	revertPersonalDraft,
	exitToGroupView,
	runPersonalSave,
	isPersonalSaveDisabled,
	handleScheduleCancel,
	runScheduleSave,
	isScheduleSaveDisabled,
	personalSidebarProps,
}: MobilePersonalAvailabilitySidebarProps) {
	const availabilityView = useAvailabilityStore((s) => s.availabilityView);
	const paintMode = useAvailabilityStore((s) => s.paintMode);
	const setPaintMode = useAvailabilityStore((s) => s.setPaintMode);
	const [toolsOpen, setToolsOpen] = useState(false);

	useEffect(() => {
		if (availabilityView !== "personal") {
			setToolsOpen(false);
		}
	}, [availabilityView]);

	const handleCloseTools = () => {
		setToolsOpen(false);
	};

	return (
		<div>
			<MobileAvailabilityHeader
				revertPersonalDraft={revertPersonalDraft}
				exitToGroupView={exitToGroupView}
				runPersonalSave={runPersonalSave}
				isPersonalSaveDisabled={isPersonalSaveDisabled}
				handleScheduleCancel={handleScheduleCancel}
				runScheduleSave={runScheduleSave}
				isScheduleSaveDisabled={isScheduleSaveDisabled}
			/>

			{availabilityView === "personal" ? (
				<>
					<MobileIsland>
						<div className="flex">
							<Button color="inherit" onClick={() => setToolsOpen(true)}>
								<div className="flex flex-col items-center">
									<KeyboardArrowDown />
									<Typography variant="caption">More Options</Typography>
								</div>
							</Button>
							<ToggleButtonGroup
								exclusive
								fullWidth
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
											flex: 1,
											minWidth: 0,
											minHeight: 0,
											textTransform: "none",
											display: "flex",
											flexDirection: "column",
											alignItems: "center",
											justifyContent: "center",
											gap: theme.spacing(0.5),
											paddingBlock: theme.spacing(2),
											paddingInline: theme.spacing(2),
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
										<Typography
											variant="caption"
											sx={{ display: "block", textAlign: "center" }}
										>
											{label}
										</Typography>
									</ToggleButton>
								))}
							</ToggleButtonGroup>
						</div>
					</MobileIsland>

					<MuiBottomSheet
						open={toolsOpen}
						onClose={handleCloseTools}
						paperSx={{
							height: "85dvh",
							maxHeight: "85dvh",
							overflow: "hidden",
							display: "flex",
							flexDirection: "column",
						}}
					>
						<div
							data-availability-sidebar=""
							className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden"
						>
							<PersonalAvailabilitySidebar
								{...personalSidebarProps}
								layout="sheet"
								onRequestClose={handleCloseTools}
							/>
						</div>
					</MuiBottomSheet>
				</>
			) : null}
		</div>
	);
}
