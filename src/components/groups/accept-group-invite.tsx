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
import type { AvatarProps } from "@mui/material/Avatar";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { NotificationItem } from "@/lib/auth/user";

const AVATAR_IMG_SLOT_PROPS = {
	img: { referrerPolicy: "no-referrer" as const },
} satisfies NonNullable<AvatarProps["slotProps"]>;

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

type PendingAction = "accept" | "decline" | null;

const AcceptGroupInvite = (props: AcceptGroupInviteProps) => {
	const router = useRouter();
	const [linkOpen, setLinkOpen] = useState(true);
	const [pending, setPending] = useState<PendingAction>(null);
	const [error, setError] = useState<string | null>(null);

	const isLink = props.source === "invite_link";
	const open = isLink ? linkOpen : props.open;

	const closeNotification = () => {
		if (props.source === "notification") {
			props.onOpenChange(false);
		}
	};

	const finalizeInviteLinkDecline = async () => {
		if (props.source !== "invite_link") return;
		setError(null);
		setPending("decline");
		try {
			const result = await declineInvite(props.inviteToken);
			if (!result.success) {
				setError(result.message);
				return;
			}
			setLinkOpen(false);
			router.push("/groups");
			router.refresh();
		} finally {
			setPending(null);
		}
	};

	const handleDialogClose = () => {
		if (pending) return;
		if (isLink) {
			void finalizeInviteLinkDecline();
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
		setPending("accept");
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
			setPending(null);
		}
	};

	const handleDecline = async () => {
		if (props.source === "invite_link") {
			await finalizeInviteLinkDecline();
			return;
		}

		setError(null);
		setPending("decline");
		try {
			if (inviteToken) {
				const result = await declineInvite(inviteToken);
				if (!result.success) {
					setError(result.message);
					return;
				}
			}
			await deleteNotification(props.notification.id);
			props.onOpenChange(false);
		} finally {
			setPending(null);
		}
	};

	return (
		<Dialog open={open} onClose={handleDialogClose} maxWidth="xs" fullWidth>
			<DialogTitle>Join group</DialogTitle>
			<DialogContent>
				<div className="flex items-center gap-3">
					<Avatar
						src={avatarSrc}
						alt={primaryText}
						slotProps={AVATAR_IMG_SLOT_PROPS}
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
				<Button
					onClick={handleDecline}
					disabled={pending !== null}
					color="inherit"
				>
					{pending === "decline" ? "Declining…" : "Decline"}
				</Button>
				<Button
					onClick={handleAccept}
					disabled={pending !== null}
					variant="contained"
				>
					{pending === "accept" ? "Accepting…" : "Accept"}
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export { AcceptGroupInvite };
