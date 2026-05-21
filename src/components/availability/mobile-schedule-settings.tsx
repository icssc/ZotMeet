"use client";

import { PeopleAltOutlined, Refresh } from "@mui/icons-material";
import { Button, Divider, Stack, Typography } from "@mui/material";
import { useShallow } from "zustand/shallow";
import { MobileIsland } from "@/components/mobile/mobile-island";
import { useAvailabilityStore } from "@/store/useAvailabilityStore";

const actionButtonSx = {
	flex: 1,
	minWidth: 0,
	px: 2,
	py: 1.25,
	borderRadius: 2,
} as const;

interface MobileScheduleSettingsProps {
	respondedMembersCount: number;
	totalMembersCount: number;
	onOpenAttendees: () => void;
}

export function MobileScheduleSettings({
	respondedMembersCount,
	totalMembersCount,
	onOpenAttendees,
}: MobileScheduleSettingsProps) {
	const { replaceEntireSelection } = useAvailabilityStore(
		useShallow((state) => ({
			replaceEntireSelection: state.replaceEntireSelection,
		})),
	);

	return (
		<MobileIsland>
			<div className="flex w-full min-w-0">
				<Button color="inherit" sx={actionButtonSx} onClick={onOpenAttendees}>
					<Stack spacing={0.5} alignItems="center">
						<PeopleAltOutlined fontSize="small" />
						<Typography variant="caption">
							{respondedMembersCount} / {totalMembersCount} Responders
						</Typography>
					</Stack>
				</Button>

				<Divider orientation="vertical" flexItem />

				<Button
					color="inherit"
					sx={actionButtonSx}
					onClick={() => replaceEntireSelection([])}
				>
					<Stack spacing={0.5} alignItems="center">
						<Refresh fontSize="small" />
						<Typography variant="caption">Reset Selection</Typography>
					</Stack>
				</Button>
			</div>
		</MobileIsland>
	);
}
