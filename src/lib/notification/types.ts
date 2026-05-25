/** In-app notification type strings stored on `notifications.type`. */
export const NOTIFICATION_TYPES = {
	MEETING_INVITE: "Meeting Invite",
	GROUP_INVITE: "Group Invite",
	NUDGE: "Nudge",
	MEETING_SCHEDULED: "Meeting Scheduled",
} as const;

export type PreferenceGatedNotificationType =
	(typeof NOTIFICATION_TYPES)[keyof typeof NOTIFICATION_TYPES];

export type NotificationPrefs = {
	meetingInvites: boolean;
	groupInvites: boolean;
	nudges: boolean;
	meetingScheduled: boolean;
};

export type NotificationPrefKey = keyof NotificationPrefs;

export const DEFAULT_NOTIFICATION_PREFS: NotificationPrefs = {
	meetingInvites: true,
	groupInvites: true,
	nudges: true,
	meetingScheduled: true,
};

export const NOTIFICATION_TYPE_TO_PREF_KEY: Record<
	PreferenceGatedNotificationType,
	NotificationPrefKey
> = {
	[NOTIFICATION_TYPES.MEETING_INVITE]: "meetingInvites",
	[NOTIFICATION_TYPES.GROUP_INVITE]: "groupInvites",
	[NOTIFICATION_TYPES.NUDGE]: "nudges",
	[NOTIFICATION_TYPES.MEETING_SCHEDULED]: "meetingScheduled",
};

export function getNotificationPrefKey(
	type: string,
): NotificationPrefKey | undefined {
	if (type in NOTIFICATION_TYPE_TO_PREF_KEY) {
		return NOTIFICATION_TYPE_TO_PREF_KEY[
			type as PreferenceGatedNotificationType
		];
	}
	return undefined;
}

export function toNotificationPrefs(
	row: Partial<NotificationPrefs> | null | undefined,
): NotificationPrefs {
	if (!row) return DEFAULT_NOTIFICATION_PREFS;
	return {
		meetingInvites: row.meetingInvites ?? true,
		groupInvites: row.groupInvites ?? true,
		nudges: row.nudges ?? true,
		meetingScheduled: row.meetingScheduled ?? true,
	};
}

export const NOTIFICATION_PREF_OPTIONS: {
	key: NotificationPrefKey;
	label: string;
	description: string;
}[] = [
	{
		key: "meetingInvites",
		label: "Meeting Invites",
		description:
			"Receive in-app and email notifications when you're invited to a meeting.",
	},
	{
		key: "groupInvites",
		label: "Group Invites",
		description:
			"Receive in-app and email notifications when you're invited to a group.",
	},
	{
		key: "nudges",
		label: "Nudges",
		description: "Receive in-app and email reminders to add your availability.",
	},
	{
		key: "meetingScheduled",
		label: "Meeting Scheduled",
		description:
			"Receive in-app and email notifications when a meeting you responded to is scheduled.",
	},
];
