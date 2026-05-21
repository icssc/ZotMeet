import { PersonRemoveOutlined } from "@mui/icons-material";
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
} from "@mui/material";

import type { Member } from "@/lib/types/availability";

interface RemoveMeetingMemberDialogProps {
	member: Member | null;
	isRemoving: boolean;
	onClose: () => void;
	onConfirm: () => void;
}

export function RemoveMeetingMemberDialog({
	member,
	isRemoving,
	onClose,
	onConfirm,
}: RemoveMeetingMemberDialogProps) {
	return (
		<Dialog
			open={member !== null}
			onClose={() => {
				if (!isRemoving) onClose();
			}}
			fullWidth
		>
			<DialogTitle>Remove Member</DialogTitle>
			<DialogContent>
				<DialogContentText>
					Are you sure you want to remove <strong>{member?.displayName}</strong>{" "}
					from this meeting?
				</DialogContentText>
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose} disabled={isRemoving}>
					Cancel
				</Button>
				<Button
					onClick={onConfirm}
					color="error"
					variant="contained"
					disabled={isRemoving}
					startIcon={<PersonRemoveOutlined />}
				>
					Remove
				</Button>
			</DialogActions>
		</Dialog>
	);
}
