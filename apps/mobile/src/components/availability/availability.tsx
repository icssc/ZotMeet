import {
	convertTimeFromUTC,
	getTimeFromHourMinuteString,
	type HourMinuteString,
	localMidnightFromIsoDate,
	type MeetingResponse,
	sortMeetingIsoDatesAsc,
} from "@zotmeet/shared";
import { useEffect, useMemo } from "react";
import { ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AvailabilityActions } from "@/components/availability/availability-actions";
import { GroupAvailability } from "@/components/availability/group-availability";
import { AvailabilityHeader } from "@/components/availability/header/availability-header";
import { MobileIsland } from "@/components/mobile/mobile-island";
import { useAvailabilityStore } from "@/store/useAvailabilityStore";

/**
 * Native counterpart to the web app's
 * `components/availability/availability.tsx` — "[Meetings] New Meeting" in the
 * ZotMeet Hi-Fi Wireframes, the screen a meeting lands on once created. Same
 * composition as the web's mobile layout: `AvailabilityHeader`, the outlined
 * Paper holding the table, and `AvailabilityActions` in the `MobileIsland`.
 *
 * The grid is derived the way the web's `availability.tsx` and
 * `use-availability-data.ts` derive theirs: the stored UTC times are brought
 * into the viewer's timezone, and the sorted meeting dates are paged through
 * `useAvailabilityStore`, two at a time.
 *
 * Front end only beyond that: the actions do nothing yet, and no availability
 * is painted into the cells.
 */
export function Availability({
	meetingData,
}: {
	meetingData: MeetingResponse;
}) {
	const insets = useSafeAreaInsets();
	const { currentPage, itemsPerPage, isFirstPage, nextPage, prevPage } =
		useAvailabilityStore();
	const setCurrentPage = useAvailabilityStore((s) => s.setCurrentPage);

	// Every meeting starts on its first page — the route keys this component
	// by meeting id, so a different meeting mounts afresh and lands here.
	useEffect(() => {
		setCurrentPage(0);
	}, [setCurrentPage]);

	const viewerTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

	const { days, startHour, endHour } = useMemo(() => {
		const sortedDates = sortMeetingIsoDatesAsc(meetingData.dates);
		const referenceDate = sortedDates[0] ?? meetingData.dates[0];

		// `convertTimeFromUTC` returns "HH:mm:ss" but is typed as `string`; the
		// web casts at the same point.
		const fromMinutes = getTimeFromHourMinuteString(
			convertTimeFromUTC(
				meetingData.fromTime,
				viewerTimezone,
				referenceDate,
			) as HourMinuteString,
		);
		const toMinutes = getTimeFromHourMinuteString(
			convertTimeFromUTC(
				meetingData.toTime,
				viewerTimezone,
				referenceDate,
			) as HourMinuteString,
		);

		// The mobile grid is hour-granular where the web's is 15-minute rows, so
		// the range is widened to whole hours. A range that ends at or before it
		// starts wraps past midnight, as `generateTimeBlocks` treats it on the web.
		const startHour = Math.floor(fromMinutes / 60);
		let endHour = Math.ceil(toMinutes / 60);
		if (endHour <= startHour) endHour += 24;

		return {
			days: sortedDates.map(localMidnightFromIsoDate),
			startHour,
			endHour,
		};
	}, [
		meetingData.dates,
		meetingData.fromTime,
		meetingData.toTime,
		viewerTimezone,
	]);

	const pageStart = currentPage * itemsPerPage;
	const pageDays = days.slice(pageStart, pageStart + itemsPerPage);
	const isLastPage = pageStart + itemsPerPage >= days.length;

	return (
		<View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
			<ScrollView
				className="flex-1"
				// Room for the island to sit over empty space rather than the last
				// hour of the table.
				contentContainerClassName="px-3 pt-3 pb-[100px]"
				showsVerticalScrollIndicator={false}
			>
				<AvailabilityHeader meetingData={meetingData} />

				{/* MUI `<Paper variant="outlined">`, the "calendar with controls" frame. */}
				<View className="w-full rounded-lg border border-border bg-paper px-3 pt-3 pb-5">
					<GroupAvailability
						currentPageAvailability={pageDays}
						datePageNav={{
							onPrev: prevPage,
							onNext: () => nextPage(days.length),
							isFirstPage,
							isLastPage,
						}}
						endHour={endHour}
						meetingType={meetingData.meetingType}
						startHour={startHour}
					/>
				</View>
			</ScrollView>

			<MobileIsland>
				<AvailabilityActions attendees={meetingData.attendees} />
			</MobileIsland>
		</View>
	);
}
