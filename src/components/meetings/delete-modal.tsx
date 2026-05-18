"use client";

import { archiveMeeting } from "@actions/meeting/archive/action";
import { leaveMeeting } from "@actions/meeting/leave/action";
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	Drawer,
	Typography,
	useMediaQuery,
	useTheme,
} from "@mui/material";
import { usePathname, useRouter } from "next/navigation";
import { useSnackbar } from "@/components/ui/snackbar-provider";
import type { SelectMeeting } from "@/db/schema";
import { getDeleteLeaveAction } from "@/lib/meetings/delete-leave-action";

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
	const pathname = usePathname();
	const { showSuccess, showError } = useSnackbar();
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("sm"), {
		noSsr: true,
	});

	const {
		label: actionLabel,
		Icon,
		confirmColor,
	} = getDeleteLeaveAction(isOwner);

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
				handleOpenChange(false);
				if (pathname === "/summary") {
					router.refresh();
				} else {
					router.push("/summary");
				}
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
				<Icon />
				<Typography variant="h6" className="font-semibold">
					{actionLabel}
				</Typography>
			</div>
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
				startIcon={<Icon />}
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
			<DialogTitle className="pb-4">{actionLabel}</DialogTitle>
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
					variant="contained"
					disabled={isDeletionPending}
					startIcon={<Icon />}
				>
					{actionLabel}
				</Button>
			</DialogActions>
		</Dialog>
	);
};
