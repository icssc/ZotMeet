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
import {
	DELETE_ACCOUNT_CONFIRM_PHRASE,
	isApplePrivateRelayEmail,
} from "@/lib/auth/delete-account-confirm";
import { deleteAccountAction } from "@/server/actions/user/delete-account/action";

interface DeleteAccountSectionProps {
	userEmail: string;
}

export function DeleteAccountSection({ userEmail }: DeleteAccountSectionProps) {
	const [showConfirm, setShowConfirm] = useState(false);
	const [confirmPhrase, setConfirmPhrase] = useState("");
	const [isPending, startTransition] = useTransition();
	const { showError } = useSnackbar();
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("sm"), { noSsr: true });
	const usesAppleRelay = isApplePrivateRelayEmail(userEmail);

	const phraseMatches = confirmPhrase.trim() === DELETE_ACCOUNT_CONFIRM_PHRASE;

	const closeConfirm = () => {
		setShowConfirm(false);
		setConfirmPhrase("");
	};

	const handleDelete = () => {
		if (!phraseMatches) {
			showError(`Type "${DELETE_ACCOUNT_CONFIRM_PHRASE}" to confirm.`);
			return;
		}

		startTransition(async () => {
			const result = await deleteAccountAction(confirmPhrase);
			if (result?.success === false) {
				showError(result.message);
			}
		});
	};

	const accountContext = (
		<Stack spacing={1}>
			<Typography variant="body2" color="text.secondary">
				This will permanently delete the account linked to:
			</Typography>
			<Typography variant="body2" fontWeight={600}>
				{userEmail}
			</Typography>
			{usesAppleRelay && (
				<Typography variant="caption" color="text.secondary">
					Enter DELETE below to confirm.
				</Typography>
			)}
		</Stack>
	);

	const confirmField = (
		<TextField
			label={`Type ${DELETE_ACCOUNT_CONFIRM_PHRASE} to confirm`}
			autoFocus
			fullWidth
			value={confirmPhrase}
			onChange={(e) => setConfirmPhrase(e.target.value)}
			disabled={isPending}
			helperText={`Type ${DELETE_ACCOUNT_CONFIRM_PHRASE} to permanently delete this account.`}
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
							{accountContext}
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
							disabled={isPending || !phraseMatches}
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
						{accountContext}
						{confirmField}
						<Button
							variant="contained"
							color="error"
							fullWidth
							onClick={handleDelete}
							disabled={isPending || !phraseMatches}
						>
							{isPending ? "Deleting..." : "Confirm Delete "}
						</Button>
					</Stack>
				</MuiBottomSheet>
			)}
		</div>
	);
}
