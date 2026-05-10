"use client";

import { Check, Close } from "@mui/icons-material";
import { Button, Drawer, Typography } from "@mui/material";
import { useCallback, useRef, useState } from "react";
import { useShallow } from "zustand/shallow";
import { useAvailabilityStore } from "@/store/useAvailabilityStore";

export interface MobileAvailabilityHeaderProps {
	revertPersonalDraft: () => void;
	exitPersonalView: () => void;
	runPersonalSave: () => Promise<boolean>;
	isPersonalSaveDisabled: boolean;
}

type ExitKind = "cancel" | "save";

export function MobileAvailabilityHeader({
	revertPersonalDraft,
	exitPersonalView,
	runPersonalSave,
	isPersonalSaveDisabled,
}: MobileAvailabilityHeaderProps) {
	const isPersonal = useAvailabilityStore(
		useShallow((s) => s.availabilityView === "personal"),
	);

	const [drawerOpen, setDrawerOpen] = useState(true);
	const exitKindRef = useRef<ExitKind | null>(null);
	const suppressOnCloseRef = useRef(false);

	const handleTransitionExited = useCallback(() => {
		suppressOnCloseRef.current = false;
		const kind = exitKindRef.current;
		exitKindRef.current = null;
		if (kind === "cancel") {
			revertPersonalDraft();
			exitPersonalView();
		} else if (kind === "save") {
			exitPersonalView();
		}
	}, [revertPersonalDraft, exitPersonalView]);

	const startClose = useCallback((kind: ExitKind) => {
		exitKindRef.current = kind;
		suppressOnCloseRef.current = true;
		setDrawerOpen(false);
	}, []);

	const handleDrawerClose = useCallback(() => {
		if (suppressOnCloseRef.current) {
			suppressOnCloseRef.current = false;
			return;
		}
		startClose("cancel");
	}, [startClose]);

	const handleCancelClick = useCallback(() => {
		startClose("cancel");
	}, [startClose]);

	const handleSaveClick = useCallback(async () => {
		if (isPersonalSaveDisabled) return;
		const ok = await runPersonalSave();
		if (ok) {
			startClose("save");
		}
	}, [runPersonalSave, isPersonalSaveDisabled, startClose]);

	return (
		<div className="">
			<Drawer
				anchor="top"
				open={isPersonal && drawerOpen}
				onClose={handleDrawerClose}
				hideBackdrop
				ModalProps={{
					disableEnforceFocus: true,
					disableAutoFocus: true,
					disableRestoreFocus: true,
				}}
				slotProps={{
					transition: {
						onExited: handleTransitionExited,
					},
					paper: {
						sx: {
							minHeight: "18vh",
							borderBottomLeftRadius: 12,
							borderBottomRightRadius: 12,
							padding: 2,
							paddingTop: 4,
						},
					},
				}}
				sx={{
					pointerEvents: "none", // lets clicks pass through the modal root
					"& .MuiDrawer-paper": {
						pointerEvents: "auto", // drawer itself still clickable
					},
				}}
			>
				<div className="flex justify-center">
					<div className="mr-auto flex items-center gap-5">
						<Button
							variant="outlined"
							size="medium"
							onClick={handleCancelClick}
							aria-label="Cancel"
							sx={{ minWidth: 48, minHeight: 48, p: 1 }}
						>
							<Close />
						</Button>

						<div>
							<Typography>Add Availability</Typography>
							<Typography variant="caption" color="text.secondary">
								Drag to add availability
							</Typography>
						</div>
					</div>

					<div className="ml-auto">
						<Button
							variant="contained"
							size="medium"
							disabled={isPersonalSaveDisabled}
							onClick={() => void handleSaveClick()}
							aria-label="Save"
							sx={{ minWidth: 48, minHeight: 48, p: 1 }}
						>
							<Check />
						</Button>
					</div>
				</div>
			</Drawer>
		</div>
	);
}
