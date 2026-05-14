"use client";

import { archiveMeeting } from "@actions/meeting/archive/action";
import { leaveMeeting } from "@actions/meeting/leave/action";
import { DeleteForever, ExitToApp } from "@mui/icons-material";
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	Divider,
	Drawer,
	Typography,
	useMediaQuery,
	useTheme,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useSnackbar } from "@/components/ui/snackbar-provider";
import type { SelectMeeting } from "@/db/schema";

interface DeleteModalProps {
	meetingData: SelectMeeting;
	isOpen: boolean;
	handleOpenChange: (open: boolean) => void;
	isOwner: boolean;
	isDeletionPending: boolean;
	onDeletionPendingChange: (pending: boolean) => void;
}

export const DeleteModal = ({
	meetingData,
	isOpen,
	handleOpenChange,
	isOwner,
	isDeletionPending,
	onDeletionPendingChange,
}: DeleteModalProps) => {
	const router = useRouter();
	const { showSuccess, showError } = useSnackbar();
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

	const actionLabel = isOwner ? "Delete Meeting" : "Leave Meeting";
	const actionIcon = isOwner ? <DeleteForever /> : <ExitToApp />;
	const confirmColor = isOwner ? "error" : "warning";

	const bodyText = isOwner
		? "This action is irreversible. All members will be removed from this meeting. "
		: "You will be removed from this meeting and your availability will be cleared.";

	const handleConfirm = async () => {
		onDeletionPendingChange(true);
		try {
			const { success, error } = isOwner
				? await archiveMeeting(meetingData)
				: await leaveMeeting(meetingData);

			if (success) {
				showSuccess(
					isOwner
						? `You successfully deleted "${meetingData.title}".`
						: `You left "${meetingData.title}".`,
				);
				router.push("/summary");
				handleOpenChange(false);
			} else {
				showError(error ?? "Something went wrong.");
			}
		} finally {
			onDeletionPendingChange(false);
		}
	};

	const ConfirmContent = (
		<>
			<div className="mb-0.5 flex items-center gap-1">
				{actionIcon}
				<Typography variant="h6" className="font-semibold">
					{actionLabel}
				</Typography>
			</div>
			<Typography variant="body2" color="text.secondary" className="mt-1">
				{bodyText}
			</Typography>
		</>
	);

	const ActionButtons = (
		<>
			<Button
				fullWidth={isMobile}
				variant="outlined"
				onClick={() => handleOpenChange(false)}
				disabled={isDeletionPending}
			>
				Cancel
			</Button>
			<Button
				fullWidth={isMobile}
				variant="contained"
				color={confirmColor}
				onClick={handleConfirm}
				disabled={isDeletionPending}
				startIcon={actionIcon}
			>
				{actionLabel}
			</Button>
		</>
	);

	if (isMobile) {
		return (
			<Drawer
				anchor="bottom"
				open={isOpen}
				onClose={() => {
					if (!isDeletionPending) handleOpenChange(false);
				}}
				slotProps={{
					paper: {
						className: "rounded-t-2xl px-2 pt-8 pb-4",
					},
				}}
			>
				<div className="flex flex-col gap-3">
					{ConfirmContent}

					<div className="flex flex-col gap-2">{ActionButtons}</div>
				</div>
			</Drawer>
		);
	}

	return (
		<Dialog
			open={isOpen}
			onClose={() => {
				if (!isDeletionPending) handleOpenChange(false);
			}}
			fullWidth
		>
			<DialogTitle className="pb-4">
				<div className="flex items-center gap-1">
					{actionIcon}
					{actionLabel}
				</div>
			</DialogTitle>

			<DialogContent className="mt-1">
				<DialogContentText>{bodyText}</DialogContentText>
			</DialogContent>

			<DialogActions className="px-4 pb-5">
				<Button
					onClick={() => handleOpenChange(false)}
					disabled={isDeletionPending}
				>
					Cancel
				</Button>
				<Button
					onClick={handleConfirm}
					color={confirmColor}
					variant="outlined"
					disabled={isDeletionPending}
					startIcon={actionIcon}
				>
					{actionLabel}
				</Button>
			</DialogActions>
		</Dialog>
	);
};
