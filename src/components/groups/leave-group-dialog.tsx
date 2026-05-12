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

type LeaveGroupDialogProps = {
	open: boolean;
	email: string;
	profilePicture?: string | null;
	onClose: () => void;
	onConfirm: () => void;
};

export function LeaveGroupDialog({
	open,
	email,
	profilePicture,
	onClose,
	onConfirm,
}: LeaveGroupDialogProps) {
	return (
		<Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
			<DialogTitle className="flex items-center justify-between">
				Leave Group
				<IconButton onClick={onClose}>
					<Close />
				</IconButton>
			</DialogTitle>

			<DialogContent>
				<div className="flex flex-col gap-6 pt-2">
					<Typography color="text.secondary">
						You will lose access to this group and all of its meetings.
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
						variant="contained"
						color="error"
						onClick={onConfirm}
					>
						Confirm
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
