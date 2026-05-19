import { Close } from "@mui/icons-material";
import {
	Button,
	Dialog,
	DialogContent,
	DialogTitle,
	IconButton,
	Typography,
} from "@mui/material";

import { MemberAvatar } from "./member-avatar";

interface RemoveMemberDialogProps {
	open: boolean;
	email: string;
	profilePicture?: string | null;
	onClose: () => void;
	onConfirm: () => void;
}

export function RemoveMemberDialog({
	open,
	email,
	profilePicture,
	onClose,
	onConfirm,
}: RemoveMemberDialogProps) {
	return (
		<Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
			<DialogTitle className="flex items-center justify-between">
				Remove Member
				<IconButton onClick={onClose}>
					<Close />
				</IconButton>
			</DialogTitle>

			<DialogContent>
				<div className="flex flex-col gap-6 pt-2">
					<Typography color="text.secondary">
						This member will be removed from the group and will no longer have
						access to meetings.
					</Typography>

					<div className="flex items-center gap-4">
						<MemberAvatar email={email} profilePicture={profilePicture} />

						<div>
							<Typography fontWeight={600}>{email.split("@")[0]}</Typography>

							<Typography color="text.secondary">{email}</Typography>
						</div>
					</div>

					<Button
						fullWidth
						color="error"
						variant="contained"
						onClick={onConfirm}
					>
						Remove Member
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
