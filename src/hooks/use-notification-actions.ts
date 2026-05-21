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
		if (
			notif.type === NOTIFICATION_TYPES.MEETING_INVITE ||
			notif.type === NOTIFICATION_TYPES.NUDGE
		) {
			options.onClose();
			router.push(notif.redirect ?? "");
		} else {
			setActiveNotification(notif);
			setShowGroupInvite(true);
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
