"use client";

import {
	CalendarMonthOutlined,
	EditCalendarOutlined,
	PeopleAltOutlined,
} from "@mui/icons-material";
import { ButtonBase, Divider, Paper, Stack, Typography } from "@mui/material";

export interface MobileGroupResponsesProps {
	isOwner: boolean;
	onAddAvailability: () => void;
	onOpenAttendees: () => void;
	onSchedule: () => void;
}

export function MobileGroupResponses({
	isOwner,
	onAddAvailability,
	onOpenAttendees,
	onSchedule,
}: MobileGroupResponsesProps) {
	return (
		<div className="pointer-events-none fixed inset-x-0 bottom-0 z-[1001] flex justify-center px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
			<Paper
				elevation={3}
				sx={{
					pointerEvents: "auto",
					display: "inline-flex",
					alignItems: "stretch",
					borderRadius: 3,
					p: 0.5,
					boxShadow: 3,
					bgcolor: "background.paper",
					maxWidth: "min(100vw - 1rem, 28rem)",
				}}
			>
				<ButtonBase
					sx={{ px: 2, py: 1.25, borderRadius: 2 }}
					onClick={onOpenAttendees}
				>
					<Stack spacing={0.5} alignItems="center">
						<PeopleAltOutlined fontSize="small" />
						<Typography variant="caption">20/25 Attendees</Typography>
					</Stack>
				</ButtonBase>

				<Divider orientation="vertical" flexItem />

				<ButtonBase
					sx={{
						px: 2,
						py: 1.25,
						borderRadius: 2,
						border: "1px solid",
						borderColor: "primary.main",
					}}
					onClick={onAddAvailability}
				>
					<Stack spacing={0.5} alignItems="center">
						<EditCalendarOutlined fontSize="small" />
						<Typography variant="caption">Add Availability</Typography>
					</Stack>
				</ButtonBase>

				{isOwner && (
					<>
						<Divider orientation="vertical" flexItem />
						<ButtonBase
							sx={{ px: 2, py: 1.25, borderRadius: 2 }}
							onClick={onSchedule}
						>
							<Stack spacing={0.5} alignItems="center">
								<CalendarMonthOutlined fontSize="small" />
								<Typography variant="caption">Schedule Meeting</Typography>
							</Stack>
						</ButtonBase>
					</>
				)}
			</Paper>
		</div>
	);
}
