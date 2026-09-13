/**
 * The card view model and mapper live in `@zotmeet/shared` so the Expo app's
 * `MeetingCard` reads exactly the same dates, times and organizer; this
 * module keeps the web app's import path stable.
 */
export {
	type MeetingCardData,
	type MeetingCardViewModel,
	type MeetingForCard,
	toMeetingCardData,
	toMeetingCardProps,
} from "@zotmeet/shared";
