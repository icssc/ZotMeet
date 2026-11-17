"use client";

import { AutorenewRounded } from "@mui/icons-material";
import { Button, Divider, Paper, Typography } from "@mui/material";
import { useShallow } from "zustand/shallow";
import { useAvailabilityStore } from "@/store/useAvailabilityStore";

interface ScheduleMeetingSettingsProps {
	handleScheduleCancel: () => void;
	handleScheduleSave: () => Promise<boolean>;
	isMeetingDeletionPending?: boolean;
}

export function ScheduleMeetingSettings({
	handleScheduleCancel,
	handleScheduleSave,
	isMeetingDeletionPending = false,
}: ScheduleMeetingSettingsProps) {
	const { replaceEntireSelection } = useAvailabilityStore(
		useShallow((state) => ({
			replaceEntireSelection: state.replaceEntireSelection,
		})),
	);

	return (
		<Paper
			variant="outlined"
			className="flex flex-col gap-6 overflow-hidden py-6"
		>
			<div className="flex flex-col gap-3 px-6">
				<div className="flex flex-col gap-2">
					<Typography variant="h6">Schedule Meeting</Typography>
					<Typography variant="caption" color="text.secondary">
						Drag over the calendar to schedule your meeting.
					</Typography>
				</div>
				<Divider />
			</div>
			<div className="flex flex-col gap-12 px-6">
				<Button
					variant="outlined"
					fullWidth
					startIcon={<AutorenewRounded sx={{ fontSize: 18 }} />}
					onClick={() => replaceEntireSelection([])}
				>
					Reset Meeting Selection
				</Button>
				<div className="flex justify-end gap-2">
					<Button
						variant="outlined"
						size="small"
						onClick={handleScheduleCancel}
					>
						Cancel
					</Button>
					<Button
						variant="contained"
						size="small"
						disabled={isMeetingDeletionPending}
						onClick={() => {
							handleScheduleSave().catch(console.error);
						}}
					>
						Save
					</Button>
				</div>
			</div>
		</Paper>
	);
}
