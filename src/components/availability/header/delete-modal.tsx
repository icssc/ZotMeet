"use client";
import { archiveMeeting } from "@actions/meeting/archive/action";
import { leaveMeeting } from "@actions/meeting/leave/action"; // add this server action for member leave
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
<<<<<<< HEAD
	isDeletionPending: boolean;
	onDeletionPendingChange: (pending: boolean) => void;
=======
	isOwner: boolean;
>>>>>>> df46f82a3 (feat: ✨ implementing delete meeting capabilities)
}

const DeleteModal = ({
	meetingData,
	isOpen,
	handleOpenChange,
<<<<<<< HEAD
	isDeletionPending,
	onDeletionPendingChange,
=======
	isOwner,
>>>>>>> df46f82a3 (feat: ✨ implementing delete meeting capabilities)
}: DeleteModalProps) => {
	const router = useRouter();
	const { showSuccess, showError } = useSnackbar();
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

<<<<<<< HEAD
	const handleDeleteClick = async () => {
		onDeletionPendingChange(true);
		try {
			const { success, error } = await archiveMeeting(meetingData);

			if (success) {
				showSuccess("Meeting deleted successfully!");
				router.push("/summary");
			} else {
				showError(error ?? "Something went wrong.");
			}
		} finally {
			onDeletionPendingChange(false);
			handleOpenChange(false);
=======
	const actionLabel = isOwner ? "Delete Meeting" : "Leave Meeting";
	const actionIcon = isOwner ? <DeleteForever /> : <ExitToApp />;
	const confirmColor = isOwner ? "error" : "warning";

	const bodyText = isOwner
		? "If you delete this meeting, it'll be gone for good and those who have responded to it won't be able to view it."
		: "You will be removed from this meeting and your availability responses will be cleared.";

	const handleConfirm = async () => {
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
		} else {
			showError(error ?? "Something went wrong.");
>>>>>>> df46f82a3 (feat: ✨ implementing delete meeting capabilities)
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
			>
				Cancel
			</Button>
			<Button
				fullWidth={isMobile}
				variant="contained"
				color={confirmColor}
				onClick={handleConfirm}
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
				onClose={() => handleOpenChange(false)}
				slotProps={{
					paper: {
						className: "rounded-t-2xl px-2 pt-2 pb-4",
					},
				}}
			>
				<div className="mx-auto mb-2 h-1 w-9 rounded bg-divider" />

				{ConfirmContent}
				<Divider className="my-2" />
				<div className="flex flex-col gap-1">{ActionButtons}</div>
			</Drawer>
		);
	}

	return (
		<Dialog
			open={isOpen}
<<<<<<< HEAD
			onClose={() => {
				if (!isDeletionPending) handleOpenChange(false);
			}}
		>
			<DialogTitle>Delete Meeting</DialogTitle>
=======
			onClose={() => handleOpenChange(false)}
			maxWidth="xs"
			fullWidth
		>
			<DialogTitle className="pb-0">
				<div className="flex items-center gap-1">
					{actionIcon}
					{actionLabel}
				</div>
			</DialogTitle>
>>>>>>> df46f82a3 (feat: ✨ implementing delete meeting capabilities)

			<DialogContent>
				<DialogContentText className="mt-1">{bodyText}</DialogContentText>
			</DialogContent>

<<<<<<< HEAD
			<DialogActions>
				<Button
					onClick={() => handleOpenChange(false)}
					disabled={isDeletionPending}
				>
					Cancel
				</Button>
				<Button
					onClick={handleDeleteClick}
					color="error"
					disabled={isDeletionPending}
				>
					Delete
=======
			<DialogActions className="px-3 pb-2">
				<Button onClick={() => handleOpenChange(false)}>Cancel</Button>
				<Button
					onClick={handleConfirm}
					color={confirmColor}
					variant="contained"
					startIcon={actionIcon}
				>
					{actionLabel}
>>>>>>> df46f82a3 (feat: ✨ implementing delete meeting capabilities)
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export { DeleteModal };
