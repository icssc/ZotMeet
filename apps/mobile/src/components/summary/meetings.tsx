import {
	buildScheduledLabel,
	filterMeetingsByQuery,
	getMeetingSortTime,
	getMeetingUpcomingPriority,
	getStartOfTodayMs,
	getUpcomingMeetingIds,
	isMeetingPast,
	type MeetingListItem,
	toMeetingCardData,
} from "@zotmeet/shared";
import { useRouter } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { Image, View } from "react-native";
import { DeleteModal } from "@/components/meetings/delete-modal";
import { FilterChip } from "@/components/ui/filter-chip";
import { IconButton } from "@/components/ui/icon-button";
import { Input } from "@/components/ui/input";
import { MeetingCard } from "@/components/ui/meeting-card";
import { Screen } from "@/components/ui/screen";
import { Typography } from "@/components/ui/typography";
import { Icon } from "@/lib/icons";

type FilterType = "upcoming" | "past" | "by-you";

interface MeetingsProps {
	meetings: MeetingListItem[];
	memberId: string;
	/** Refetches the list after a card is deleted or left. */
	onChanged: () => void;
	/** Pull-to-refresh. */
	onRefresh: () => void;
	refreshing: boolean;
}

type DeleteTarget = {
	meeting: MeetingListItem;
	isOwner: boolean;
};

const FILTER_LABELS: Record<FilterType, string> = {
	upcoming: "Upcoming",
	past: "Past",
	"by-you": "By You",
};

/**
 * Native counterpart to the web app's `Meetings` (`src/components/summary/`):
 * the mobile header, the search field, the three filter chips, and the
 * sorted cards — same filters, same sort order, same empty state, through
 * the same helpers from `@zotmeet/shared`.
 *
 * The web page pre-computes the scheduled labels, dates and the "upcoming"
 * set on the server from the scheduled-block rows; `GET /api/meetings`
 * returns those rows flattened onto each meeting (`scheduledAt`), and the
 * same derivation runs here, on the device's clock. Not carried over: the
 * notifications drawer behind the bell, which is its own feature (the bell
 * is drawn, unwired), and the wide-screen "Create A Meeting" button, which
 * a phone never shows.
 */
export function Meetings({
	meetings,
	memberId,
	onChanged,
	onRefresh,
	refreshing,
}: MeetingsProps) {
	const router = useRouter();
	const [search, setSearch] = useState("");
	const [activeFilter, setActiveFilter] = useState<FilterType>("upcoming");
	const [deleteTarget, setDeleteTarget] = useState<DeleteTarget | null>(null);
	const [isDeletionPending, setIsDeletionPending] = useState(false);

	// What `app/summary/page.tsx` derives from `getScheduledMeetingsByMeetingIds`.
	const { scheduledLabels, scheduledDates, upcomingSet } = useMemo(() => {
		const scheduledMap: Record<string, { scheduledDate: Date }> = {};
		const labels: Record<string, string> = {};
		const dates: Record<string, number> = {};
		for (const m of meetings) {
			if (!m.scheduledAt) continue;
			const scheduledDate = new Date(m.scheduledAt.date);
			scheduledMap[m.id] = { scheduledDate };
			labels[m.id] = buildScheduledLabel(
				scheduledDate,
				m.scheduledAt.fromTime,
				m.scheduledAt.toTime,
			);
			dates[m.id] = scheduledDate.getTime();
		}
		return {
			scheduledLabels: labels,
			scheduledDates: dates,
			upcomingSet: new Set(getUpcomingMeetingIds(scheduledMap)),
		};
	}, [meetings]);

	const todayTimestamp = getStartOfTodayMs();

	const isPastMeeting = useCallback(
		(m: MeetingListItem): boolean =>
			isMeetingPast(m, scheduledDates, todayTimestamp),
		[scheduledDates, todayTimestamp],
	);

	const counts = useMemo(
		() => ({
			upcoming: meetings.filter((m) => !isPastMeeting(m)).length,
			past: meetings.filter(isPastMeeting).length,
			"by-you": meetings.filter((m) => m.hostId === memberId).length,
		}),
		[meetings, memberId, isPastMeeting],
	);

	const filteredMeetings = useMemo(() => {
		switch (activeFilter) {
			case "by-you":
				return meetings.filter((m) => m.hostId === memberId);
			case "past":
				return meetings.filter(isPastMeeting);
			default:
				return meetings.filter((m) => !isPastMeeting(m));
		}
	}, [meetings, memberId, activeFilter, isPastMeeting]);

	const displayMeetings = useMemo(
		() => filterMeetingsByQuery(filteredMeetings, search),
		[filteredMeetings, search],
	);

	const sortedMeetings = useMemo(() => {
		if (activeFilter === "past") {
			return [...displayMeetings].sort(
				(a, b) =>
					getMeetingSortTime(b, scheduledDates) -
					getMeetingSortTime(a, scheduledDates),
			);
		}
		return [...displayMeetings].sort(
			(a, b) =>
				getMeetingUpcomingPriority(a, memberId, upcomingSet) -
				getMeetingUpcomingPriority(b, memberId, upcomingSet),
		);
	}, [displayMeetings, activeFilter, scheduledDates, memberId, upcomingSet]);

	const renderMeetings = () => {
		if (displayMeetings.length === 0) {
			return (
				<View className="items-center gap-3 py-24">
					<Image
						source={require("@/assets/images/mascot.png")}
						accessibilityLabel="mascot"
						style={{ width: 111, height: 111 }}
						resizeMode="contain"
					/>
					<Typography
						variant="h6"
						color="textSecondary"
						align="center"
						className="max-w-xs pt-2 font-figtree-italic"
					>
						{search.trim()
							? "No meetings match your search."
							: "Create your first meeting to start collaborating with your team."}
					</Typography>
				</View>
			);
		}

		return (
			<View className="gap-3">
				{sortedMeetings.map((meeting) => {
					const { meeting: _meeting, ...cardProps } = toMeetingCardData(
						meeting,
						memberId,
						{
							responderCount: meeting.responderCount,
							scheduledLabel: scheduledLabels[meeting.id],
						},
					);
					return (
						<MeetingCard
							key={meeting.id}
							{...cardProps}
							needsAvailability={meeting.needsAvailability}
							allAvailabilityFilled={meeting.allAvailabilityFilled}
							isUpcoming={upcomingSet.has(meeting.id)}
							isPast={activeFilter === "past"}
							onDeleteLeave={() =>
								setDeleteTarget({ meeting, isOwner: cardProps.isOwner })
							}
						/>
					);
				})}
			</View>
		);
	};

	return (
		<Screen
			title="Meetings"
			onRefresh={onRefresh}
			refreshing={refreshing}
			actions={
				<View className="flex-row gap-4">
					<IconButton
						variant="outlined"
						size="medium"
						accessibilityLabel="Notifications"
					>
						<Icon name="notifications-none" />
					</IconButton>
					<IconButton
						variant="contained"
						size="medium"
						onPress={() => router.push("/create-meeting")}
						accessibilityLabel="Create meeting"
					>
						<Icon name="add" size={20} />
					</IconButton>
				</View>
			}
		>
			<View className="gap-3">
				<Input
					accessibilityLabel="Search meetings"
					placeholder="Search"
					value={search}
					onChangeText={setSearch}
					autoCapitalize="none"
					autoCorrect={false}
					returnKeyType="search"
					startAdornment={
						<Icon name="search" size={20} className="text-text-disabled" />
					}
				/>
				<View className="flex-row gap-1.5">
					{(["upcoming", "past", "by-you"] as const).map((f) => (
						<FilterChip
							key={f}
							label={FILTER_LABELS[f]}
							count={counts[f]}
							active={activeFilter === f}
							onPress={() => setActiveFilter(f)}
						/>
					))}
				</View>
			</View>

			{renderMeetings()}

			{deleteTarget ? (
				<DeleteModal
					meetingData={deleteTarget.meeting}
					isOpen
					handleOpenChange={(open) => {
						if (!open) setDeleteTarget(null);
					}}
					isOwner={deleteTarget.isOwner}
					isDeletionPending={isDeletionPending}
					onDeletionPendingChange={setIsDeletionPending}
					onDone={onChanged}
				/>
			) : null}
		</Screen>
	);
}
