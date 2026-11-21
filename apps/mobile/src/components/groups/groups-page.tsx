import {
	buildGroupsListModel,
	GROUPS_LIST_FILTER_LABELS,
	GROUPS_LIST_FILTERS,
	type GroupListItem,
	type GroupsListFilter,
} from "@zotmeet/shared";
import { useMemo, useState } from "react";
import { Image, Pressable, View } from "react-native";
import { GroupCard } from "@/components/groups/group-card";
import { FilterChip } from "@/components/ui/filter-chip";
import { IconButton } from "@/components/ui/icon-button";
import { Input } from "@/components/ui/input";
import { Screen } from "@/components/ui/screen";
import { Typography } from "@/components/ui/typography";
import { Icon } from "@/lib/icons";

/** Native counterpart to the web app's `GroupsPage` (`src/components/groups/`). */

const INITIAL_ACTION_REQUIRED_COUNT = 2;

export function GroupsPage({
	groups,
	onRefresh,
	refreshing,
}: {
	groups: GroupListItem[];
	onRefresh?: () => void;
	refreshing?: boolean;
}) {
	const [search, setSearch] = useState("");
	const [activeFilter, setActiveFilter] = useState<GroupsListFilter>("all");
	const [showAllActionRequired, setShowAllActionRequired] = useState(false);

	const { actionRequired, rest, isEmpty, isFilteredEmpty } = useMemo(
		() => buildGroupsListModel({ groups, search, filter: activeFilter }),
		[groups, search, activeFilter],
	);

	const visibleActionRequired = showAllActionRequired
		? actionRequired
		: actionRequired.slice(0, INITIAL_ACTION_REQUIRED_COUNT);

	return (
		<Screen
			title="Groups"
			onRefresh={onRefresh}
			refreshing={refreshing}
			actions={
				<View className="flex-row gap-4">
					<IconButton
						variant="outlined"
						size="medium"
						accessibilityLabel="Notifications"
					>
						<Icon name="notifications" />
					</IconButton>
					<IconButton
						variant="contained"
						size="medium"
						accessibilityLabel="Create or join a group"
					>
						<Icon name="add" size={20} />
					</IconButton>
				</View>
			}
		>
			<View className="gap-3">
				<Input
					accessibilityLabel="Search groups"
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
					{GROUPS_LIST_FILTERS.map((filter) => (
						<FilterChip
							key={filter}
							label={GROUPS_LIST_FILTER_LABELS[filter]}
							active={activeFilter === filter}
							onPress={() => setActiveFilter(filter)}
						/>
					))}
				</View>
			</View>

			{isEmpty || isFilteredEmpty ? (
				<EmptyState
					message={
						isEmpty
							? "Create your first group to start scheduling meetings."
							: "No groups found!"
					}
				/>
			) : (
				<>
					{actionRequired.length > 0 ? (
						<View className="gap-3">
							<SectionHeading>
								Action Required ({actionRequired.length})
							</SectionHeading>
							{visibleActionRequired.map((group) => (
								<GroupCard key={group.id} group={group} actionRequired />
							))}
							{actionRequired.length > INITIAL_ACTION_REQUIRED_COUNT ? (
								<Pressable
									accessibilityRole="button"
									className="flex-row items-center justify-center gap-1 py-1 active:opacity-60"
									onPress={() => setShowAllActionRequired((shown) => !shown)}
								>
									<Typography
										variant="caption"
										color="textDisabled"
										className="font-figtree-bold"
									>
										{showAllActionRequired ? "Show Less" : "Show More"}
									</Typography>
									<Icon
										name={showAllActionRequired ? "expand-less" : "expand-more"}
										size={18}
										className="text-text-disabled"
									/>
								</Pressable>
							) : null}
						</View>
					) : null}

					<View className="gap-3">
						<SectionHeading>All ({rest.length})</SectionHeading>
						{rest.map((group) => (
							<GroupCard key={group.id} group={group} />
						))}
					</View>
				</>
			)}
		</Screen>
	);
}

function SectionHeading({ children }: { children: React.ReactNode }) {
	return (
		<Typography variant="overline" color="textDisabled">
			{children}
		</Typography>
	);
}

function EmptyState({ message }: { message: string }) {
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
				{message}
			</Typography>
		</View>
	);
}
