/**
 * PostHog event names and their properties. Both apps (and the server that
 * captures on their behalf) import these, so a funnel built on
 * `meeting_created` never silently splits into `meeting_created` and
 * `meetingCreated`. Properties are ids and enums only — never names, emails
 * or meeting titles.
 */

export const ANALYTICS_EVENTS = {
	signedIn: "signed_in",
	signedUp: "signed_up",
	meetingCreated: "meeting_created",
	availabilitySaved: "availability_saved",
	groupCreated: "group_created",
} as const;

export type AnalyticsEvent =
	(typeof ANALYTICS_EVENTS)[keyof typeof ANALYTICS_EVENTS];

/** The properties each event carries. */
export type AnalyticsEventProperties = {
	signed_in: { provider: string };
	signed_up: { provider: string };
	meeting_created: {
		meeting_id: string;
		meeting_type: "dates" | "days";
		date_count: number;
		has_group: boolean;
	};
	availability_saved: {
		meeting_id: string;
		slot_count: number;
		if_needed_slot_count: number;
	};
	group_created: { group_id: string; invited_member_count: number };
};
