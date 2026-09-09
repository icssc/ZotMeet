import { Calendar, ChevronDown, Pencil, Users } from "lucide-react-native";
import { useState } from "react";
import { type LayoutChangeEvent, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AddAvailabilityHeader } from "@/components/availability/add-availability-header";
import { AvailabilityGrid } from "@/components/availability/availability-grid";
import {
	FloatingActionBar,
	type FloatingBarOption,
} from "@/components/availability/floating-action-bar";
import { StatusSwatch } from "@/components/availability/stripes";
import { MeetingHeader } from "@/components/meetings/meeting-header";
import {
	type AvailabilityStatus,
	daysFrom,
	paintSlots,
	type SlotKey,
	shiftDays,
} from "@/lib/availability";
import { startOfDay } from "@/lib/date";

/** The wireframes show two columns at a time; paging moves by that much. */
const VISIBLE_DAYS = 2;

/**
 * Route: `/availability`. The two states the wireframes connect with the note
 * "Floating control bar switches out" — browsing a meeting's grid
 * ("[Meetings] Availability after filter", Figma 716:11437) and painting your
 * own response over it ("[Meetings] Add Availability", 211:12549).
 *
 * The meeting itself is still hard-coded: there is no API client in this
 * prototype, so the header copy and the attendee count stand in for what a
 * loaded meeting would supply.
 */
export default function AvailabilityScreen() {
	const insets = useSafeAreaInsets();

	const [startDay, setStartDay] = useState(() => startOfDay(new Date()));
	const days = daysFrom(startDay, VISIBLE_DAYS);

	const [editing, setEditing] = useState(false);
	const [activeStatus, setActiveStatus] =
		useState<AvailabilityStatus>("available");

	/** What has been saved, and the copy the sweeps edit until you confirm. */
	const [saved, setSaved] = useState<Record<SlotKey, AvailabilityStatus>>({});
	const [draft, setDraft] = useState<Record<SlotKey, AvailabilityStatus>>({});

	/**
	 * The curtain covers the meeting header rather than replacing it, so the
	 * grid must not move when it comes down — the header's own height is
	 * measured and held open behind it.
	 */
	const [headerHeight, setHeaderHeight] = useState(0);
	const measureHeader = (e: LayoutChangeEvent) => {
		setHeaderHeight(e.nativeEvent.layout.height);
	};

	const beginEditing = () => {
		setDraft(saved);
		setActiveStatus("available");
		setEditing(true);
	};

	const browsingOptions: FloatingBarOption[] = [
		{
			key: "attendees",
			label: "20/25 Attendees",
			icon: <Users className="text-foreground" size={18} />,
		},
		{
			key: "add",
			label: "Add Availability",
			icon: <Pencil className="text-primary" size={18} />,
			selected: true,
			onPress: beginEditing,
		},
		{
			key: "schedule",
			label: "Schedule Meeting",
			icon: <Calendar className="text-foreground" size={18} />,
		},
	];

	const paintingOptions: FloatingBarOption[] = [
		{
			key: "more",
			label: "More Options",
			icon: <ChevronDown className="text-foreground" size={18} />,
		},
		...(
			[
				["available", "Available"],
				["if-needed", "If Needed"],
				["unavailable", "Unavailable"],
			] as const
		).map(([status, label]) => ({
			key: status,
			label,
			icon: <StatusSwatch status={status} />,
			selected: activeStatus === status,
			onPress: () => setActiveStatus(status),
		})),
	];

	return (
		<View className="flex-1 bg-background">
			<ScrollView
				// A sweep runs down the grid, the same axis this view scrolls, and
				// no offset threshold can tell the two apart. Painting is a mode in
				// the design, so the scroll simply yields to it.
				contentContainerClassName="px-3 pb-44"
				scrollEnabled={!editing}
				showsVerticalScrollIndicator={false}
				style={{ paddingTop: insets.top }}
			>
				{editing ? (
					<View style={{ height: headerHeight }} />
				) : (
					<View onLayout={measureHeader}>
						<MeetingHeader
							dateRange="2/16-2/20"
							location="NAME OF PLACE"
							timeRange="9 AM - 5 PM"
							title="UI/UX Social"
						/>
					</View>
				)}

				<AvailabilityGrid
					activeStatus={editing ? activeStatus : undefined}
					days={days}
					editable={editing}
					onNextDays={() => setStartDay(shiftDays(startDay, VISIBLE_DAYS))}
					onPaint={(keys, status) =>
						setDraft((current) => paintSlots(current, keys, status))
					}
					onPreviousDays={() => setStartDay(shiftDays(startDay, -VISIBLE_DAYS))}
					statuses={editing ? draft : saved}
				/>
			</ScrollView>

			{editing ? (
				<View className="absolute inset-x-0 top-0">
					<AddAvailabilityHeader
						onCancel={() => setEditing(false)}
						onConfirm={() => {
							setSaved(draft);
							setEditing(false);
						}}
					/>
				</View>
			) : null}

			<View
				className="absolute inset-x-0 items-center"
				pointerEvents="box-none"
				style={{ bottom: insets.bottom + 12 }}
			>
				<FloatingActionBar
					dividerAfter={0}
					elevation={editing ? "raised" : "elevated"}
					options={editing ? paintingOptions : browsingOptions}
				/>
			</View>
		</View>
	);
}
