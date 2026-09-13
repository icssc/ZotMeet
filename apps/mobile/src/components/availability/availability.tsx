import {
	convertTimeFromUTC,
	deriveInitialAvailability,
	generateTimeBlocks,
	getTimeFromHourMinuteString,
	type HourMinuteString,
	type MeetingResponse,
	type Member,
	sliceCurrentPageAvailability,
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
 * `use-availability-data.ts` derive theirs, through the same shared helpers:
 * the stored UTC times are brought into the viewer's timezone and cut into
 * 15-minute rows, every member's response becomes one `ZotDate` per meeting
 * day, and the days are paged through `useAvailabilityStore`, two at a time.
 *
 * Read-only for now: the grid shows the group heatmap, and the actions do
 * nothing yet.
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

	const {
		availabilityDates,
		ifNeededDates,
		availabilityTimeBlocks,
		fromTimeMinutes,
		members,
	} = useMemo(() => {
		const sortedDates = sortMeetingIsoDatesAsc(meetingData.dates);
		const referenceDate = sortedDates[0] ?? meetingData.dates[0];

		// `convertTimeFromUTC` returns "HH:mm:ss" but is typed as `string`; the
		// web casts at the same point.
		const fromTimeMinutes = getTimeFromHourMinuteString(
			convertTimeFromUTC(
				meetingData.fromTime,
				viewerTimezone,
				referenceDate,
			) as HourMinuteString,
		);
		const toTimeMinutes = getTimeFromHourMinuteString(
			convertTimeFromUTC(
				meetingData.toTime,
				viewerTimezone,
				referenceDate,
			) as HourMinuteString,
		);
		const availabilityTimeBlocks = generateTimeBlocks(
			fromTimeMinutes,
			toTimeMinutes,
		);

		const derive = (mode: "availabilities" | "if-needed") =>
			deriveInitialAvailability({
				timezone: viewerTimezone,
				meetingDates: meetingData.dates,
				userId: meetingData.viewerMemberId,
				allAvailabilities: meetingData.availabilities,
				availabilityTimeBlocks,
				mode,
			});

		const members: Member[] = meetingData.availabilities.map(
			({ memberId, displayName, profilePicture }) => ({
				memberId,
				displayName,
				profilePicture,
			}),
		);

		return {
			availabilityDates: derive("availabilities"),
			ifNeededDates: derive("if-needed"),
			availabilityTimeBlocks,
			fromTimeMinutes,
			members,
		};
	}, [
		meetingData.dates,
		meetingData.fromTime,
		meetingData.toTime,
		meetingData.availabilities,
		meetingData.viewerMemberId,
		viewerTimezone,
	]);

	const currentPageAvailability = useMemo(
		() =>
			sliceCurrentPageAvailability(
				availabilityDates,
				ifNeededDates,
				currentPage,
				itemsPerPage,
			),
		[availabilityDates, ifNeededDates, currentPage, itemsPerPage],
	);
	const isLastPage =
		(currentPage + 1) * itemsPerPage >= availabilityDates.length;

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
						availabilityDates={availabilityDates}
						availabilityTimeBlocks={availabilityTimeBlocks}
						currentPageAvailability={currentPageAvailability}
						datePageNav={{
							onPrev: prevPage,
							onNext: () => nextPage(availabilityDates.length),
							isFirstPage,
							isLastPage,
						}}
						fromTime={fromTimeMinutes}
						meetingType={meetingData.meetingType}
						members={members}
						timeZone={viewerTimezone}
					/>
				</View>
			</ScrollView>

			<MobileIsland>
				<AvailabilityActions attendees={meetingData.attendees} />
			</MobileIsland>
		</View>
	);
}
