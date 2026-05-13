"use client";

import { KeyboardArrowDown } from "@mui/icons-material";
import { Button, Typography } from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";
import { useCallback, useEffect, useState } from "react";
import { MobileAvailabilityHeader } from "@/components/availability/header/mobile-availability-header";
import { PersonalPaintModeToggle } from "@/components/nav/personal-paint-mode-toggle";
import { MuiBottomSheet } from "@/components/ui/mui/mui-bottom-sheet";
import { useAvailabilityStore } from "@/store/useAvailabilityStore";
import { MobileIsland } from "../mobile/mobile-island";
import {
	PersonalAvailabilitySidebar,
	type PersonalAvailabilitySidebarProps,
} from "./personal-availability-sidebar";

const MOBILE_TOOLS_SHEET_PAPER_SX: SxProps<Theme> = {
	height: "85dvh",
	maxHeight: "85dvh",
	overflow: "hidden",
	display: "flex",
	flexDirection: "column",
};

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
	const [toolsOpen, setToolsOpen] = useState(false);

	useEffect(() => {
		if (availabilityView !== "personal") {
			setToolsOpen(false);
		}
	}, [availabilityView]);

	const handleOpenTools = useCallback(() => setToolsOpen(true), []);
	const handleCloseTools = useCallback(() => setToolsOpen(false), []);

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
							<Button
								color="inherit"
								aria-label="More availability options"
								onClick={handleOpenTools}
							>
								<div className="flex flex-col items-center">
									<KeyboardArrowDown />
									<Typography variant="caption">More Options</Typography>
								</div>
							</Button>
							<PersonalPaintModeToggle density="compact" />
						</div>
					</MobileIsland>

					<MuiBottomSheet
						open={toolsOpen}
						onClose={handleCloseTools}
						paperSx={MOBILE_TOOLS_SHEET_PAPER_SX}
					>
						<div
							data-availability-sidebar=""
							className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden"
						>
							{toolsOpen ? (
								<PersonalAvailabilitySidebar
									{...personalSidebarProps}
									layout="sheet"
									onRequestClose={handleCloseTools}
								/>
							) : null}
						</div>
					</MuiBottomSheet>
				</>
			) : null}
		</div>
	);
}
