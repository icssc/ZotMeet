import { acceptInvite } from "@actions/group/invite/create/action";
import { deleteNotification } from "@actions/user/action";
import { Avatar, Button } from "@mui/material";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import type { NotificationItem } from "@/lib/auth/user";

interface AcceptGroupInviteProps {
	open: boolean;
	notification: NotificationItem | null;
	onOpenChange: (open: boolean) => void;
}

const AcceptGroupInvite = ({
	open,
	notification,
	onOpenChange,
}: AcceptGroupInviteProps) => {
	const handleAccept = async () => {
		await acceptInvite(notification?.redirect ?? "");
		await deleteNotification(notification?.id ?? "");
		onOpenChange(false);
	};

	const handleDecline = async () => {
		await deleteNotification(notification?.id ?? "");
		onOpenChange(false);
	};

	return (
		<div>
			<Dialog open={open} onOpenChange={onOpenChange}>
				<DialogContent className="sm:max-w-50">
					<DialogHeader>
						<DialogTitle>Join Group</DialogTitle>
					</DialogHeader>

					<div className="mt-8 flex items-center">
						<div className="flex items-center gap-3">
							<Avatar
								src={"/icssc-logo.svg"}
								alt="group-icon"
								sx={{ width: 50, height: 50 }}
							/>

							<div>
								<p className="font-semibold">{notification?.title}</p>
								<p>{notification?.message}</p>
							</div>
						</div>

						<div className="ml-auto flex">
							<Button onClick={handleAccept}>Accept</Button>

							<Button onClick={handleDecline}>Decline</Button>
						</div>
					</div>
				</DialogContent>
			</Dialog>
		</div>
	);
};

export default AcceptGroupInvite;
