"use client";

import { Add, ExpandMore, People } from "@mui/icons-material";
import SearchIcon from "@mui/icons-material/Search";
import {
	Box,
	Button,
	Divider,
	IconButton,
	Stack,
	TextField,
	Typography,
} from "@mui/material";
import { useMemo, useState } from "react";
import { CreateGroupDialog } from "@/components/groups/create-group-dialog";
import { GroupCard } from "@/components/groups/group-card";
import { FilterChip } from "@/components/ui/filter-chip";
import type { GroupWithDetails } from "@/server/data/groups/queries";
import { InviteDecision } from "./invite-decisions";

type FilterTab = "all" | "created" | "availability";

interface GroupsPageProps {
	groups: GroupWithDetails[];
}

const INITIAL_ACTION_REQUIRED_COUNT = 2;

export function GroupsPage({ groups }: GroupsPageProps) {
	const [search, setSearch] = useState("");
	const [activeFilter, setActiveFilter] = useState<FilterTab>("all");
	const [createDialogOpen, setCreateDialogOpen] = useState(false);
	const [showAllActionRequired, setShowAllActionRequired] = useState(false);

	const searchTrimmed = search.trim();

	const filteredGroups = useMemo(() => {
		let result = groups;

		if (searchTrimmed) {
			const query = searchTrimmed.toLowerCase();
			result = result.filter((g) => g.name.toLowerCase().includes(query));
		}

		switch (activeFilter) {
			case "created":
				result = result.filter((g) => g.isCreator);
				break;
			case "availability":
				result = result.filter((g) => g.upcomingMeetingName);
				break;
		}

		return result;
	}, [groups, searchTrimmed, activeFilter]);

	const counts = useMemo(() => {
		const baseGroups = searchTrimmed
			? groups.filter((g) =>
					g.name.toLowerCase().includes(searchTrimmed.toLowerCase()),
				)
			: groups;

		return {
			all: baseGroups.length,
			created: baseGroups.filter((g) => g.isCreator).length,
			availability: baseGroups.filter((g) => g.upcomingMeetingName).length,
		};
	}, [groups, searchTrimmed]);

	const actionRequiredGroups = useMemo(
		() =>
			filteredGroups.filter(
				(g) => g.needsAvailability && g.ownerEmail !== null,
			),
		[filteredGroups],
	);

	const visibleActionGroups = showAllActionRequired
		? actionRequiredGroups
		: actionRequiredGroups.slice(0, INITIAL_ACTION_REQUIRED_COUNT);

	const showNoGroupsFound =
		filteredGroups.length === 0 &&
		(searchTrimmed.length > 0 || activeFilter !== "all");

	const [showJoinGroup, setShowJoinGroup] = useState(false);

	return (
		<Box sx={{ width: "100%" }}>
			<Box
				sx={{
					mb: 4,
					display: { xs: "flex", sm: "none" },
					alignItems: "center",
				}}
			>
				<Typography variant="h4">Groups</Typography>
				<div className="ml-auto">
					<Button
						type="button"
						variant="contained"
						size="square"
						onClick={() => setCreateDialogOpen(true)}
					>
						<Add />
					</Button>
				</div>
			</Box>

			<Box sx={{ display: { xs: "block", sm: "flex" }, gap: { xs: 0, sm: 2 } }}>
				<TextField
					aria-label="Search groups"
					placeholder="Search"
					size="small"
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					slotProps={{
						input: {
							startAdornment: (
								<SearchIcon
									sx={{ fontSize: 20, color: "text.disabled", mr: 0.5 }}
								/>
							),
						},
					}}
					sx={{
						width: { xs: "100%", sm: "auto" },
						flex: { xs: "none", sm: "1 1 0%" },
						minWidth: { sm: 0 },
						maxWidth: { sm: 460 },
					}}
				/>

				<Box
					sx={{
						ml: "auto",
						display: { xs: "none", sm: "flex" },
						alignItems: "center",
						gap: 1,
					}}
				>
					<Button
						type="button"
						variant="outlined"
						color="secondary"
						startIcon={<People sx={{ color: "secondary.contrastText" }} />}
						onClick={() => setShowJoinGroup(true)}
					>
						Join Group
					</Button>

					<Button
						type="button"
						variant="contained"
						startIcon={<Add />}
						onClick={() => setCreateDialogOpen(true)}
					>
						Create Group
					</Button>
				</Box>
			</Box>

			<Box sx={{ mt: 2, display: "flex", gap: 0.5 }}>
				<FilterChip
					label="All"
					count={counts.all}
					active={activeFilter === "all"}
					onClick={() => setActiveFilter("all")}
				/>
				<FilterChip
					label="By You"
					count={counts.created}
					active={activeFilter === "created"}
					onClick={() => setActiveFilter("created")}
				/>
				<FilterChip
					label="Upcoming"
					count={counts.availability}
					active={activeFilter === "availability"}
					onClick={() => setActiveFilter("availability")}
				/>
			</Box>

			<Box sx={{ mt: 3, display: { sm: "none" } }}>
				{actionRequiredGroups.length > 0 && (
					<Box sx={{ mb: 3 }}>
						<Typography
							variant="overline"
							color="text.disabled"
							sx={{ display: "block", mb: 2 }}
						>
							Action Required ({actionRequiredGroups.length})
						</Typography>
						<Stack spacing={1.5}>
							{visibleActionGroups.map((group) => (
								<GroupCard
									key={group.id}
									id={group.id}
									name={group.name}
									members={group.members}
									totalMeetings={group.totalMeetings}
									totalMembers={group.memberCount}
									creatorName={group.creatorName}
									creatorAvatar={group.creatorAvatar}
									actionRequired={true}
									pendingMeetingName={group.pendingMeetingName}
									icon={group.icon}
								/>
							))}
						</Stack>
						{actionRequiredGroups.length > INITIAL_ACTION_REQUIRED_COUNT && (
							<Button
								type="button"
								onClick={() => setShowAllActionRequired((v) => !v)}
								endIcon={
									<ExpandMore
										sx={{
											fontSize: 14,
											transform: showAllActionRequired
												? "rotate(180deg)"
												: "none",
											transition: "transform 0.2s",
										}}
									/>
								}
								sx={{
									mt: 1.5,
									width: "100%",
									color: "text.disabled",
									fontSize: "0.75rem",
									fontWeight: 700,
									letterSpacing: "0.4px",
								}}
							>
								{showAllActionRequired ? "Show Less" : "Show More"}
							</Button>
						)}
					</Box>
				)}
			</Box>

			<Box sx={{ mt: 4 }}>
				<Typography color="text.disabled" sx={{ p: 0.5 }}>
					All ({searchTrimmed.length > 0 ? filteredGroups.length : counts.all})
				</Typography>
				{filteredGroups.length > 0 ? (
					<Box
						sx={{
							display: "grid",
							gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" },
							gap: { xs: 0.5, sm: 4 },
						}}
					>
						{filteredGroups
							.filter((group) => group.ownerEmail !== null)
							.toSorted((a, b) => {
								const priority = (g: typeof a) =>
									g.needsAvailability ? 0 : g.upcomingMeetingName ? 1 : 2;
								return priority(a) - priority(b);
							})
							.map((group) => (
								<GroupCard
									key={group.id}
									id={group.id}
									name={group.name}
									description={group.description}
									members={group.members}
									totalMeetings={group.totalMeetings}
									totalMembers={group.memberCount}
									creatorName={group.creatorName}
									creatorAvatar={group.creatorAvatar}
									actionRequired={group.needsAvailability}
									upcomingMeetingName={group.upcomingMeetingName}
									icon={group.icon}
								/>
							))}
					</Box>
				) : (
					<div className="flex min-h-[500px] flex-col items-center justify-center py-20 text-gray-400">
						{showNoGroupsFound ? (
							<Typography variant="h6" className="text-center text-gray-500">
								No groups found!
							</Typography>
						) : (
							<>
								<div className="mb-6">
									<People sx={{ fontSize: "3.75rem", color: "divider" }} />
								</div>

								<Typography
									variant="h6"
									className="text-center italic leading-relaxed"
								>
									Create your first group to start <br />
									scheduling meetings.
								</Typography>
							</>
						)}
					</div>
				)}
			</Box>

			<CreateGroupDialog
				open={createDialogOpen}
				onOpenChange={setCreateDialogOpen}
			/>

			<InviteDecision open={showJoinGroup} onOpenChange={setShowJoinGroup} />
		</Box>
	);
}
