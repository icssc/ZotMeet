import type { GroupListItem } from "@zotmeet/shared";
import { useRouter } from "expo-router";
import { type ComponentRef, useRef, useState } from "react";
import { Image, Pressable, View } from "react-native";
import { GroupCard } from "@/components/groups/group-card";
import { FilterChip } from "@/components/ui/filter-chip";
import { IconButton } from "@/components/ui/icon-button";
import { Input } from "@/components/ui/input";
import { Menu, MenuItem } from "@/components/ui/menu";
import { Screen } from "@/components/ui/screen";
import { Typography } from "@/components/ui/typography";
import { Icon } from "@/lib/icons";

/** Native counterpart to the web app's `GroupsPage` (`src/components/groups/`). */

type GroupsFilter = "all" | "created" | "upcoming";

const FILTERS: { value: GroupsFilter; label: string }[] = [
	{ value: "all", label: "All" },
	{ value: "created", label: "By You" },
	{ value: "upcoming", label: "Upcoming" },
];

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
	const [activeFilter, setActiveFilter] = useState<GroupsFilter>("all");
	const [showAllActionRequired, setShowAllActionRequired] = useState(false);
	const [menuOpen, setMenuOpen] = useState(false);
	const addButtonRef = useRef<ComponentRef<typeof View>>(null);
	const router = useRouter();

	const actionRequired = groups.filter((group) => group.needsAvailability);
	const rest = groups.filter((group) => !group.needsAvailability);

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
					<View ref={addButtonRef} collapsable={false}>
						<IconButton
							variant="contained"
							size="medium"
							accessibilityLabel="Create or join a group"
							onPress={() => setMenuOpen(true)}
						>
							<Icon name="add" size={20} />
						</IconButton>
					</View>
					<Menu
						anchorRef={addButtonRef}
						open={menuOpen}
						onClose={() => setMenuOpen(false)}
					>
						<MenuItem
							label="Create A Group"
							icon="add"
							color="primary"
							onPress={() => {
								setMenuOpen(false);
								router.push("/create-group");
							}}
						/>
					</Menu>
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
					{FILTERS.map((filter) => (
						<FilterChip
							key={filter.value}
							label={filter.label}
							active={activeFilter === filter.value}
							onPress={() => setActiveFilter(filter.value)}
						/>
					))}
				</View>
			</View>

			{groups.length === 0 ? (
				<EmptyState />
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

function EmptyState() {
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
				Create your first group to start scheduling meetings.
			</Typography>
		</View>
	);
}
