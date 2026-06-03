"use client";

import CloseIcon from "@mui/icons-material/Close";
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	IconButton,
	Stack,
	TextField,
	Typography,
	useMediaQuery,
	useTheme,
} from "@mui/material";
import { useState, useTransition } from "react";
import { MuiBottomSheet } from "@/components/ui/mui/mui-bottom-sheet";
import { useSnackbar } from "@/components/ui/snackbar-provider";
import { deleteAccountAction } from "@/server/actions/user/delete-account/action";

interface DeleteAccountSectionProps {
	userEmail: string;
}

export function DeleteAccountSection({ userEmail }: DeleteAccountSectionProps) {
	const [showConfirm, setShowConfirm] = useState(false);
	const [confirmEmail, setConfirmEmail] = useState("");
	const [isPending, startTransition] = useTransition();
	const { showError } = useSnackbar();
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("sm"), { noSsr: true });

	const emailMatches =
		confirmEmail.trim().toLowerCase() === userEmail.trim().toLowerCase();

	const closeConfirm = () => {
		setShowConfirm(false);
		setConfirmEmail("");
	};

	const handleDelete = () => {
		if (!emailMatches) {
			showError("Email does not match your account.");
			return;
		}

		startTransition(async () => {
			const result = await deleteAccountAction(confirmEmail);
			if (result?.success === false) {
				showError(result.message);
			}
		});
	};

	const confirmField = (
		<TextField
			label="Account email"
			autoFocus
			fullWidth
			value={confirmEmail}
			onChange={(e) => setConfirmEmail(e.target.value)}
			disabled={isPending}
			helperText="Type your account email to confirm permanent deletion."
		/>
	);

	return (
		<div className="flex flex-col gap-2">
			<div className={isMobile ? "mb-2 flex justify-center" : ""}>
				<Button
					variant="outlined"
					color="error"
					onClick={() => setShowConfirm(true)}
					sx={{ alignSelf: "flex-start" }}
				>
					Delete account
				</Button>
			</div>

			<Typography variant="body2" color="text.secondary">
				Permanently deletes your profile, group memberships, meetings,
				availability responses, notifications, and sessions from ZotMeet. This
				cannot be undone.
			</Typography>

			{!isMobile && (
				<Dialog
					open={showConfirm}
					onClose={closeConfirm}
					maxWidth="sm"
					fullWidth
				>
					<DialogTitle>Permanently Delete Account?</DialogTitle>
					<DialogContent>
						<Stack spacing={2} sx={{ pt: 1 }}>
							{confirmField}
						</Stack>
					</DialogContent>
					<DialogActions sx={{ px: 3, pb: 2 }}>
						<Button onClick={closeConfirm} disabled={isPending}>
							Cancel
						</Button>
						<Button
							variant="contained"
							color="error"
							onClick={handleDelete}
							disabled={isPending || !emailMatches}
						>
							{isPending ? "Deleting..." : "Confirm Delete"}
						</Button>
					</DialogActions>
				</Dialog>
			)}

			{isMobile && (
				<MuiBottomSheet
					open={showConfirm}
					onClose={closeConfirm}
					paperSx={{
						borderTopLeftRadius: 16,
						borderTopRightRadius: 16,
						p: 3,
					}}
				>
					<Stack spacing={3}>
						<Stack
							direction="row"
							alignItems="center"
							justifyContent="space-between"
						>
							<Typography variant="h6">Delete account</Typography>
							<IconButton onClick={closeConfirm} aria-label="Close">
								<CloseIcon />
							</IconButton>
						</Stack>
						{confirmField}
						<Button
							variant="contained"
							color="error"
							fullWidth
							onClick={handleDelete}
							disabled={isPending || !emailMatches}
						>
							{isPending ? "Deleting..." : "Confirm Delete "}
						</Button>
					</Stack>
				</MuiBottomSheet>
			)}
		</div>
	);
}
