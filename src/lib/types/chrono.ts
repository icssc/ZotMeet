/**
 * Calendar and clock vocabulary. The definitions live in `@zotmeet/shared`
 * so the Expo app can use them too; this module keeps the web app's import
 * path stable.
 */

export type { HourMinuteString } from "@zotmeet/shared";
export {
	ANCHOR_DATES,
	CalendarConstants,
	convertAnchorDatesToCurrentWeek,
	getCurrentWeekDateForAnchor,
	isAnchorDateMeeting,
	isAnchorDateString,
	MONTHS,
	Months,
	TimeConstants,
	WEEKDAYS,
	Weekday,
} from "@zotmeet/shared";
