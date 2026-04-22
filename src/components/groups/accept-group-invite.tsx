import { acceptInvite } from "@actions/group/invite/create/action";
import { deleteNotification } from "@actions/user/action";
import {
	Avatar,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
} from "@mui/material";
import type { NotificationItem } from "@/lib/auth/user";

interface AcceptGroupInviteProps {
	open: boolean;
	notification: NotificationItem;
	onOpenChange: (open: boolean) => void;
}

const AcceptGroupInvite = ({
	open,
	notification,
	onOpenChange,
}: AcceptGroupInviteProps) => {
	const handleAccept = async () => {
		await acceptInvite(notification.redirect ?? "");
		await deleteNotification(notification.id);
		onOpenChange(false);
	};

	const handleDecline = async () => {
		await deleteNotification(notification.id);
		onOpenChange(false);
	};

	return (
		<Dialog
			open={open}
			onClose={() => onOpenChange(false)}
			maxWidth="xs"
			fullWidth
		>
			<DialogTitle>Join Group</DialogTitle>

			<DialogContent>
				<div className="flex items-center gap-3">
					<Avatar
						src={notification.groupIcon || "/icssc-logo.svg"}
						alt="group-icon"
						sx={{ width: 50, height: 50 }}
					/>
					<div>
						<p className="font-semibold">{notification?.title}</p>
						<p>{notification?.message}</p>
					</div>
				</div>
			</DialogContent>

			<DialogActions>
				<Button onClick={handleDecline}>Decline</Button>
				<Button onClick={handleAccept}>Accept</Button>
			</DialogActions>
		</Dialog>
	);
};

export { AcceptGroupInvite };
