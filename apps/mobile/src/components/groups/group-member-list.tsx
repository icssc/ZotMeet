import {
	buildGroupMeetingsModel,
	GROUP_MEETINGS_FILTER_LABELS,
	GROUP_MEETINGS_FILTERS,
	type GroupDetailResponse,
	type GroupMeetingItem,
	type GroupMeetingsFilter,
	getStartOfTodayMs,
} from "@zotmeet/shared";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { Pressable, RefreshControl, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { GroupIcon } from "@/components/groups/group-card";
import { GroupMeetingCard } from "@/components/groups/group-meeting-card";
import { FilterChip } from "@/components/ui/filter-chip";
import { IconButton } from "@/components/ui/icon-button";
import { Input } from "@/components/ui/input";
import { Typography } from "@/components/ui/typography";
import { Icon } from "@/lib/icons";

/** Native counterpart to the web app's `GroupMemberList` (`src/components/groups/`). */
export function GroupMemberList({
	detail,
	onRefresh,
	refreshing,
}: {
	detail: GroupDetailResponse;
	onRefresh: () => void;
	refreshing: boolean;
}) {
	const router = useRouter();
	const insets = useSafeAreaInsets();
	const [search, setSearch] = useState("");
	const [activeFilter, setActiveFilter] = useState<GroupMeetingsFilter>("all");
	const { group, isAdmin, memberId, meetings } = detail;

	const todayMs = getStartOfTodayMs();
	const { actionRequired, upcoming, rest } = useMemo(
		() =>
			buildGroupMeetingsModel({
				meetings,
				memberId,
				filter: activeFilter,
				search,
				todayMs,
			}),
		[meetings, memberId, activeFilter, search, todayMs],
	);

	const goBack = () => {
		if (router.canGoBack()) router.back();
		else router.replace("/groups");
	};

	return (
		<View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
			<ScrollView
				contentContainerClassName="grow gap-4 px-4 pt-2 pb-10"
				showsVerticalScrollIndicator={false}
				keyboardShouldPersistTaps="handled"
				refreshControl={
					<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
				}
			>
				<View className="flex-row items-center justify-between">
					<Pressable
						accessibilityRole="button"
						accessibilityLabel="Back to Groups"
						className="flex-row items-center gap-1 py-2 active:opacity-60"
						onPress={goBack}
					>
						<Icon name="chevron-left" size={24} />
						<Typography variant="body2">Groups</Typography>
					</Pressable>
					<View className="flex-row items-center">
						<IconButton accessibilityLabel="Members">
							<Icon name="people" />
						</IconButton>
						{isAdmin ? (
							<IconButton accessibilityLabel="Group settings">
								<Icon name="settings" />
							</IconButton>
						) : null}
					</View>
				</View>

				<View className="items-center gap-2">
					<GroupIcon icon={group.icon} name={group.name} size={72} />
					<Typography variant="h5" align="center">
						{group.name}
					</Typography>
					{group.description ? (
						<Typography variant="caption" align="center" className="px-4">
							{group.description}
						</Typography>
					) : null}
				</View>

				<View className="flex-row items-center justify-between pt-2">
					<Typography variant="h6">Meetings</Typography>
					<IconButton
						variant="contained"
						size="medium"
						accessibilityLabel="Create meeting in this group"
						onPress={() =>
							router.push({
								pathname: "/create-meeting",
								params: { groupId: group.id },
							})
						}
					>
						<Icon name="add" size={20} />
					</IconButton>
				</View>

				<View className="gap-3">
					<Input
						accessibilityLabel="Search meetings"
						placeholder="Search"
						size="small"
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
						{GROUP_MEETINGS_FILTERS.map((filter) => (
							<FilterChip
								key={filter}
								label={GROUP_MEETINGS_FILTER_LABELS[filter]}
								active={activeFilter === filter}
								onPress={() => setActiveFilter(filter)}
							/>
						))}
					</View>
				</View>

				{meetings.length === 0 ? (
					<View className="items-center py-24">
						<Typography
							variant="h6"
							color="textSecondary"
							className="font-figtree-italic"
						>
							No meetings yet!
						</Typography>
					</View>
				) : (
					<>
						<MeetingSection title="Action Required" meetings={actionRequired} />
						<MeetingSection title="Upcoming" meetings={upcoming} />
						<MeetingSection title="All" meetings={rest} />
					</>
				)}
			</ScrollView>
		</View>
	);
}

function MeetingSection({
	title,
	meetings,
}: {
	title: string;
	meetings: GroupMeetingItem[];
}) {
	if (meetings.length === 0) return null;

	return (
		<View className="gap-3">
			<Typography variant="overline" color="textDisabled">
				{title} ({meetings.length})
			</Typography>
			{meetings.map((meeting) => (
				<GroupMeetingCard key={meeting.id} meeting={meeting} />
			))}
		</View>
	);
}
