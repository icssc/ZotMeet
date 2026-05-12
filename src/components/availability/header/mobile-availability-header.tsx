"use client";

import { Check, Close } from "@mui/icons-material";
import { Button, Drawer, Typography } from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import { useAvailabilityStore } from "@/store/useAvailabilityStore";

export interface MobileAvailabilityHeaderProps {
	revertPersonalDraft: () => void;
	exitToGroupView: () => void;
	runPersonalSave: () => Promise<boolean>;
	isPersonalSaveDisabled: boolean;
	handleScheduleCancel: () => void;
	runScheduleSave: () => Promise<boolean>;
	isScheduleSaveDisabled: boolean;
}

type ExitKind = "cancel" | "save";

export function MobileAvailabilityHeader({
	revertPersonalDraft,
	exitToGroupView,
	runPersonalSave,
	isPersonalSaveDisabled,
	handleScheduleCancel,
	runScheduleSave,
	isScheduleSaveDisabled,
}: MobileAvailabilityHeaderProps) {
	const availabilityView = useAvailabilityStore((s) => s.availabilityView);
	const isPersonal = availabilityView === "personal";
	const isSchedule = availabilityView === "schedule";

	// Mount with open={false} then flip to true so MUI plays the slide-in
	// transition instead of snapping into place.
	const [drawerOpen, setDrawerOpen] = useState(false);
	useEffect(() => {
		const id = requestAnimationFrame(() => setDrawerOpen(true));
		return () => cancelAnimationFrame(id);
	}, []);

	const exitKindRef = useRef<ExitKind | null>(null);
	const suppressOnCloseRef = useRef(false);

	const handleTransitionExited = useCallback(() => {
		suppressOnCloseRef.current = false;
		const kind = exitKindRef.current;
		exitKindRef.current = null;
		const exitingView = useAvailabilityStore.getState().availabilityView;

		if (kind === "cancel") {
			if (exitingView === "personal") {
				revertPersonalDraft();
				exitToGroupView();
			} else if (exitingView === "schedule") {
				handleScheduleCancel();
			}
		} else if (kind === "save") {
			exitToGroupView();
		}
	}, [revertPersonalDraft, exitToGroupView, handleScheduleCancel]);

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
		if (isPersonal) {
			if (isPersonalSaveDisabled) return;
			const ok = await runPersonalSave();
			if (ok) startClose("save");
			return;
		}
		if (isSchedule) {
			if (isScheduleSaveDisabled) return;
			const ok = await runScheduleSave();
			if (ok) startClose("save");
		}
	}, [
		isPersonal,
		isSchedule,
		runPersonalSave,
		runScheduleSave,
		isPersonalSaveDisabled,
		isScheduleSaveDisabled,
		startClose,
	]);

	const saveDisabled = isPersonal
		? isPersonalSaveDisabled
		: isSchedule
			? isScheduleSaveDisabled
			: true;

	return (
		<div className="sm:hidden">
			<Drawer
				anchor="top"
				open={drawerOpen}
				onClose={handleDrawerClose}
				hideBackdrop
				ModalProps={{
					disableEnforceFocus: true,
					disableAutoFocus: true,
					disableRestoreFocus: true,
					disableScrollLock: true,
					disablePortal: true,
				}}
				slotProps={{
					transition: {
						onExited: handleTransitionExited,
					},
					paper: {
						sx: {
							minHeight: "20vh",
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
							size="square"
							onClick={handleCancelClick}
							aria-label="Cancel"
						>
							<Close />
						</Button>

						<div>
							<Typography>
								{isSchedule ? "Schedule meeting" : "Add availability"}
							</Typography>
							<Typography variant="caption" color="textSecondary">
								{isSchedule ? "Drag to Schedule" : "Drag to add availability"}
							</Typography>
						</div>
					</div>

					<div className="ml-auto">
						<Button
							variant="contained"
							size="square"
							disabled={saveDisabled}
							onClick={() => void handleSaveClick()}
							aria-label="Save"
						>
							<Check />
						</Button>
					</div>
				</div>
			</Drawer>
		</div>
	);
}
