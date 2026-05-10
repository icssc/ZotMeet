import { ArrowForward, Close } from "@mui/icons-material";
import {
	Button,
	Dialog,
	DialogContent,
	DialogTitle,
	IconButton,
	Typography,
} from "@mui/material";
import { GroupRole } from "@/db/schema";
import { MemberAvatar } from "./member-avatar";

type ChangeRoleDialogProps = {
	open: boolean;
	email: string;
	currentRole: GroupRole;
	nextRole: GroupRole;
	onClose: () => void;
	onConfirm: () => void;
};

export function ChangeRoleDialog({
	open,
	email,
	currentRole,
	nextRole,
	onClose,
	onConfirm,
}: ChangeRoleDialogProps) {
	const isPromoting =
		currentRole === GroupRole.MEMBER && nextRole === GroupRole.ADMIN;

	const message = isPromoting
		? "Changing a user's role will give them access to manage members of this group."
		: "Changing a user's role will revoke their access to manage members of this group.";

	return (
		<Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
			<DialogTitle className="flex items-center justify-between">
				Change Permissions
				<IconButton onClick={onClose}>
					<Close />
				</IconButton>
			</DialogTitle>

			<DialogContent>
				<div className="flex flex-col gap-6 pt-2">
					<Typography color="text.secondary">{message}</Typography>

					<div className="flex items-center gap-4">
						<MemberAvatar email={email} />

						<div>
							<Typography fontWeight={600}>{email.split("@")[0]}</Typography>
							<Typography color="text.secondary">{email}</Typography>
						</div>
					</div>

					<div className="flex items-center justify-center gap-3">
						<Typography
							sx={{
								textDecoration: "line-through",
								color: "text.secondary",
								fontWeight: 600,
							}}
						>
							{currentRole === GroupRole.ADMIN ? "Admin" : "Member"}
						</Typography>
						<ArrowForward
							sx={{
								color: "primary.main",
								fontSize: 20,
							}}
						/>
						<Typography fontWeight={600}>
							{nextRole === GroupRole.ADMIN ? "Admin" : "Member"}
						</Typography>
					</div>

					<Button
						fullWidth
						variant="outlined"
						color="secondary"
						onClick={onConfirm}
					>
						Confirm
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
