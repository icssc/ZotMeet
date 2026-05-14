"use client";

import {
	acceptInvite,
	declineInvite,
} from "@actions/group/invite/create/action";
import { deleteNotification } from "@actions/user/action";
import {
	Avatar,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { NotificationItem } from "@/lib/auth/user";

export type AcceptGroupInviteProps =
	| {
			source: "notification";
			open: boolean;
			onOpenChange: (open: boolean) => void;
			notification: NotificationItem;
	  }
	| {
			source: "invite_link";
			inviteToken: string;
			groupId: string;
			groupName: string;
			groupIcon: string | null;
	  };

const AcceptGroupInvite = (props: AcceptGroupInviteProps) => {
	const router = useRouter();
	const [linkOpen, setLinkOpen] = useState(true);
	const [busy, setBusy] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const isLink = props.source === "invite_link";
	const open = isLink ? linkOpen : props.open;

	const closeNotification = () => {
		if (props.source === "notification") {
			props.onOpenChange(false);
		}
	};

	const dismissLink = () => {
		setLinkOpen(false);
		router.push("/groups");
	};

	const handleDialogClose = () => {
		if (busy) return;
		if (isLink) {
			dismissLink();
		} else {
			closeNotification();
		}
	};

	const inviteToken =
		props.source === "notification"
			? (props.notification.redirect ?? "")
			: props.inviteToken;

	const avatarSrc =
		props.source === "notification"
			? props.notification.groupIcon || "/icssc-logo.svg"
			: props.groupIcon || "/icssc-logo.svg";

	const primaryText =
		props.source === "notification"
			? props.notification.title
			: props.groupName;

	const secondaryText =
		props.source === "notification"
			? (props.notification.message ?? "")
			: "You've been invited to join this group.";

	const handleAccept = async () => {
		setError(null);
		setBusy(true);
		try {
			const result = await acceptInvite(inviteToken);
			if (!result.success) {
				setError(result.message);
				return;
			}
			if (props.source === "notification") {
				await deleteNotification(props.notification.id);
				props.onOpenChange(false);
			} else {
				setLinkOpen(false);
				router.push(`/groups/${result.groupId ?? props.groupId}`);
				router.refresh();
			}
		} finally {
			setBusy(false);
		}
	};

	const handleDecline = async () => {
		setError(null);
		setBusy(true);
		try {
			if (props.source === "notification") {
				await deleteNotification(props.notification.id);
				props.onOpenChange(false);
			} else {
				const result = await declineInvite(props.inviteToken);
				if (!result.success) {
					setError(result.message);
					return;
				}
				setLinkOpen(false);
				router.push("/groups");
				router.refresh();
			}
		} finally {
			setBusy(false);
		}
	};

	return (
		<Dialog open={open} onClose={handleDialogClose} maxWidth="xs" fullWidth>
			<DialogTitle>Join group</DialogTitle>
			<DialogContent>
				<div className="flex items-center gap-3">
					<Avatar
						src={avatarSrc}
						alt=""
						slotProps={{ img: { referrerPolicy: "no-referrer" } }}
						sx={{ width: 50, height: 50 }}
					/>
					<div>
						<p className="font-semibold">{primaryText}</p>
						{secondaryText ? (
							<Typography variant="body2" color="text.secondary">
								{secondaryText}
							</Typography>
						) : null}
					</div>
				</div>
				{error ? (
					<Typography color="error" variant="body2" sx={{ mt: 2 }}>
						{error}
					</Typography>
				) : null}
			</DialogContent>
			<DialogActions>
				<Button onClick={handleDecline} disabled={busy} color="inherit">
					Decline
				</Button>
				<Button onClick={handleAccept} disabled={busy} variant="contained">
					{busy ? "Accepting…" : "Accept"}
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export { AcceptGroupInvite };
