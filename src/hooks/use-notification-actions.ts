"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { NotificationItem } from "@/lib/auth/user";
import { NOTIFICATION_TYPES } from "@/lib/notification/types";

export function useNotificationActions(notifications: NotificationItem[]) {
	const router = useRouter();
	const [showGroupInvite, setShowGroupInvite] = useState(false);
	const [activeNotification, setActiveNotification] =
		useState<NotificationItem | null>(null);

	const unread = notifications.filter((n) => !n.readAt);

	async function handleOpen(
		notif: NotificationItem,
		options: {
			onClose: () => void;
			beforeOpen?: () => void | Promise<void>;
		},
	) {
		await options.beforeOpen?.();
		// Group invites need an accept/decline dialog; every other type just follows its link.
		if (notif.type === NOTIFICATION_TYPES.GROUP_INVITE) {
			setActiveNotification(notif);
			setShowGroupInvite(true);
		} else {
			options.onClose();
			router.push(notif.redirect ?? "");
		}
	}

	return {
		unread,
		showGroupInvite,
		setShowGroupInvite,
		activeNotification,
		setActiveNotification,
		handleOpen,
	};
}
