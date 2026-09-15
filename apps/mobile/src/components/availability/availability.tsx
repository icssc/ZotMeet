import {
	clearPersonalGridSlots,
	deriveInitialAvailability,
	deriveMeetingWindow,
	type MeetingResponse,
	type Member,
	sliceCurrentPageAvailability,
	type ZotDate,
} from "@zotmeet/shared";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ScrollView, View } from "react-native";
import {
	useAnimatedStyle,
	useSharedValue,
	withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AvailabilityActions } from "@/components/availability/availability-actions";
import { GroupAvailability } from "@/components/availability/group-availability";
import { AvailabilityHeader } from "@/components/availability/header/availability-header";
import { PersonalAvailabilityHeader } from "@/components/availability/header/personal-availability-header";
import { PersonalAvailability } from "@/components/availability/personal-availability";
import { PersonalAvailabilityActions } from "@/components/availability/personal-availability-actions";
import { PersonalAvailabilityOptionsSheet } from "@/components/availability/personal-availability-options-sheet";
import {
	MobileIsland,
	MobileIslandContent,
} from "@/components/mobile/mobile-island";
import { Animated } from "@/lib/animated";
import { saveAvailability } from "@/lib/api/meetings";
import { useAvailabilityStore } from "@/store/useAvailabilityStore";

/** Matches the island's cross-fade so the two read as one transition. */
const GROUP_HEADER_FADE_MS = 220;

/**
 * Native counterpart to the web app's
 * `components/availability/availability.tsx` — "[Meetings] New Meeting" in the
 * ZotMeet Hi-Fi Wireframes. Group view shows the heatmap + island actions;
 * Add Availability switches to personal edit (Figma "[Meetings] Add
 * Availability"): curtain header, paint grid, and an island with More Options
 * plus Available / If Needed / Unavailable — mirroring desktop's sidebar tools.
 *
 * Edit state follows the web's `useEditState` / `useAvailabilityActionHandlers`:
 * entering personal mode snapshots the grid, Cancel restores it, Save PUTs the
 * painted slots through the API and keeps the optimistic grid on success.
 */
export function Availability({
	meetingData,
}: {
	meetingData: MeetingResponse;
}) {
	const insets = useSafeAreaInsets();
	const router = useRouter();
	const {
		currentPage,
		itemsPerPage,
		isFirstPage,
		nextPage,
		prevPage,
		availabilityView,
		setAvailabilityView,
	} = useAvailabilityStore();
	const setCurrentPage = useAvailabilityStore((s) => s.setCurrentPage);

	const [toolsOpen, setToolsOpen] = useState(false);
	const [isSaving, setIsSaving] = useState(false);
	const [saveError, setSaveError] = useState<string | null>(null);
	const isPersonal = availabilityView === "personal";

	// The web's `hasAvailability`: flips the island label to "Edit Availability".
	// "Responded" is the server's definition too (`getResponderCountsByMeetingIds`):
	// a row with at least one slot.
	const viewerRow = meetingData.availabilities.find(
		(a) => a.memberId === meetingData.viewerMemberId,
	);
	const viewerResponded =
		viewerRow !== undefined &&
		(viewerRow.meetingAvailabilities.length > 0 ||
			viewerRow.ifNeededAvailabilities.length > 0);
	const [hasAvailability, setHasAvailability] = useState(viewerResponded);
	useEffect(() => setHasAvailability(viewerResponded), [viewerResponded]);
	// The island's "n/m Attendees" is from the fetch; once the viewer saves,
	// the heatmap includes them, so the count does too — as on the web, where
	// a viewer with no row joins `members` the moment they paint.
	const attendees = useMemo(() => {
		if (!hasAvailability || viewerResponded) return meetingData.attendees;
		const { responded, total } = meetingData.attendees;
		return {
			responded: responded + 1,
			total: viewerRow === undefined ? total + 1 : total,
		};
	}, [hasAvailability, meetingData.attendees, viewerResponded, viewerRow]);

	// Every meeting starts on its first page in group view — the route keys
	// this component by meeting id, so a different meeting mounts afresh.
	useEffect(() => {
		setCurrentPage(0);
		setAvailabilityView("group");
	}, [setCurrentPage, setAvailabilityView]);

	const viewerTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

	const derived = useMemo(() => {
		// The grid's time axis in the viewer's zone — the same derivation the
		// web runs, from `@zotmeet/shared`.
		const { fromTimeMinutes, availabilityTimeBlocks } = deriveMeetingWindow(
			{
				dates: meetingData.dates,
				fromTime: meetingData.fromTime,
				toTime: meetingData.toTime,
			},
			viewerTimezone,
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

	const [availabilityDates, setAvailabilityDates] = useState(
		derived.availabilityDates,
	);
	const [ifNeededDates, setIfNeededDates] = useState(derived.ifNeededDates);
	const draftSnapshotRef = useRef<{
		availabilityDates: ZotDate[];
		ifNeededDates: ZotDate[];
	} | null>(null);

	useEffect(() => {
		setAvailabilityDates(derived.availabilityDates);
		setIfNeededDates(derived.ifNeededDates);
		draftSnapshotRef.current = null;
	}, [derived]);

	const { availabilityTimeBlocks, fromTimeMinutes, members } = derived;

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

	const datePageNav = useMemo(
		() => ({
			onPrev: prevPage,
			onNext: () => nextPage(availabilityDates.length),
			isFirstPage,
			isLastPage,
		}),
		[prevPage, nextPage, availabilityDates.length, isFirstPage, isLastPage],
	);

	const handleAddAvailability = useCallback(() => {
		// Signed out, the web sends the visitor to log in and back; the sign-in
		// screen lives on the Profile tab here.
		if (!meetingData.viewerMemberId) {
			router.push("/profile");
			return;
		}
		setSaveError(null);
		draftSnapshotRef.current = {
			availabilityDates: availabilityDates.map((d) => d.clone()),
			ifNeededDates: ifNeededDates.map((d) => d.clone()),
		};
		setAvailabilityView("personal");
	}, [
		availabilityDates,
		ifNeededDates,
		meetingData.viewerMemberId,
		router,
		setAvailabilityView,
	]);

	const handlePersonalCancel = useCallback(() => {
		const snapshot = draftSnapshotRef.current;
		if (snapshot) {
			setAvailabilityDates(snapshot.availabilityDates);
			setIfNeededDates(snapshot.ifNeededDates);
		}
		draftSnapshotRef.current = null;
		setToolsOpen(false);
		setAvailabilityView("group");
	}, [setAvailabilityView]);

	const handlePersonalSave = useCallback(async () => {
		if (isSaving) return;
		setIsSaving(true);
		setSaveError(null);
		try {
			await saveAvailability(meetingData.id, {
				meetingAvailabilityTimes: availabilityDates.flatMap(
					(date) => date.availability,
				),
				ifNeededAvailabilityTimes: ifNeededDates.flatMap(
					(date) => date.availability,
				),
			});
		} catch (error) {
			setSaveError(
				error instanceof Error ? error.message : "Failed to save availability.",
			);
			return;
		} finally {
			setIsSaving(false);
		}
		// Saved: the painted grid is now the truth, as the web's `confirmSave`.
		draftSnapshotRef.current = null;
		setHasAvailability(true);
		setToolsOpen(false);
		setAvailabilityView("group");
	}, [
		availabilityDates,
		ifNeededDates,
		isSaving,
		meetingData.id,
		setAvailabilityView,
	]);

	const handlePaint = useCallback(
		(next: { availabilityDates: ZotDate[]; ifNeededDates: ZotDate[] }) => {
			setAvailabilityDates(next.availabilityDates);
			setIfNeededDates(next.ifNeededDates);
		},
		[],
	);

	const handleClearAvailability = useCallback(() => {
		const memberId = meetingData.viewerMemberId;
		if (!memberId) return;
		const cleared = clearPersonalGridSlots(
			availabilityDates,
			ifNeededDates,
			memberId,
		);
		setAvailabilityDates(cleared.availabilityDates);
		setIfNeededDates(cleared.ifNeededDates);
	}, [availabilityDates, ifNeededDates, meetingData.viewerMemberId]);

	const hasPaintedSlots = useMemo(
		() =>
			availabilityDates.some((d) => d.availability.length > 0) ||
			ifNeededDates.some((d) => d.availability.length > 0),
		[availabilityDates, ifNeededDates],
	);

	// The group header stays in the layout while editing and only fades, so
	// the heatmap card keeps its exact position under the sliding curtain
	// header instead of jumping when the mode flips.
	const groupHeaderOpacity = useSharedValue(1);
	useEffect(() => {
		groupHeaderOpacity.value = withTiming(isPersonal ? 0 : 1, {
			duration: GROUP_HEADER_FADE_MS,
		});
	}, [groupHeaderOpacity, isPersonal]);
	const groupHeaderStyle = useAnimatedStyle(() => ({
		opacity: groupHeaderOpacity.value,
	}));

	return (
		<View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
			{isPersonal ? (
				<PersonalAvailabilityHeader
					error={saveError}
					onCancel={handlePersonalCancel}
					onSave={handlePersonalSave}
					saving={isSaving}
				/>
			) : null}

			<ScrollView
				className="flex-1"
				contentContainerClassName="px-3 pt-3 pb-[100px]"
				showsVerticalScrollIndicator={false}
			>
				<Animated.View
					aria-hidden={isPersonal}
					pointerEvents={isPersonal ? "none" : "auto"}
					style={groupHeaderStyle}
				>
					<AvailabilityHeader meetingData={meetingData} />
				</Animated.View>

				<View className="w-full rounded-lg border border-border bg-paper px-3 pt-3 pb-5">
					{isPersonal && meetingData.viewerMemberId ? (
						<PersonalAvailability
							availabilityDates={availabilityDates}
							availabilityTimeBlocks={availabilityTimeBlocks}
							currentPageAvailability={currentPageAvailability}
							datePageNav={datePageNav}
							fromTime={fromTimeMinutes}
							ifNeededDates={ifNeededDates}
							meetingType={meetingData.meetingType}
							memberId={meetingData.viewerMemberId}
							onPaint={handlePaint}
							timeZone={viewerTimezone}
						/>
					) : (
						<GroupAvailability
							availabilityDates={availabilityDates}
							availabilityTimeBlocks={availabilityTimeBlocks}
							datePageNav={datePageNav}
							fromTime={fromTimeMinutes}
							ifNeededDates={ifNeededDates}
							meetingType={meetingData.meetingType}
							members={members}
							timeZone={viewerTimezone}
						/>
					)}
				</View>
			</ScrollView>

			<MobileIsland>
				{isPersonal ? (
					<MobileIslandContent key="personal">
						<PersonalAvailabilityActions
							onMoreOptions={() => setToolsOpen(true)}
						/>
					</MobileIslandContent>
				) : (
					<MobileIslandContent key="group">
						<AvailabilityActions
							attendees={attendees}
							hasAvailability={hasAvailability}
							onAddAvailability={handleAddAvailability}
						/>
					</MobileIslandContent>
				)}
			</MobileIsland>

			{isPersonal ? (
				<PersonalAvailabilityOptionsSheet
					canClear={hasPaintedSlots}
					onClearAvailability={handleClearAvailability}
					onClose={() => setToolsOpen(false)}
					open={toolsOpen}
				/>
			) : null}
		</View>
	);
}
