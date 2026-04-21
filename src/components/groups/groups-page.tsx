"use client";

import { Add, ExpandMore, People } from "@mui/icons-material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { Box, Button, Divider, Stack, Typography } from "@mui/material";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { CreateGroupDialog } from "@/components/groups/create-group-dialog";
import { GroupCard } from "@/components/groups/group-card";
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

	const filteredGroups = useMemo(() => {
		let result = groups;

		if (search) {
			const query = search.toLowerCase();
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
	}, [groups, search, activeFilter]);

	const counts = useMemo(
		() => ({
			all: groups.length,
			created: groups.filter((g) => g.isCreator).length,
			availability: groups.filter((g) => g.upcomingMeetingName).length,
		}),
		[groups],
	);

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

	const [showJoinGroup, setShowJoinGroup] = useState(false);

	return (
		<Box sx={{ width: "100%" }}>
			<Box
				sx={{
					mt: 3,
					mb: 4,
					display: { xs: "flex", sm: "none" },
					alignItems: "center",
				}}
			>
				<Typography variant="h3">Groups</Typography>
				<Button
					type="button"
					variant="contained"
					onClick={() => setCreateDialogOpen(true)}
					sx={{
						fontSize: "2rem",
						padding: 0,
						ml: "auto",
						minWidth: 0,
						width: "3rem",
						height: "3rem",
					}}
				>
					+
				</Button>
			</Box>

			<Box sx={{ display: { xs: "block", sm: "flex" } }}>
				<Box
					sx={{
						display: "flex",
						alignItems: "center",
						gap: 1.25,
						borderRadius: 99,
						bgcolor: "grey.100",
						px: 2,
						py: 1,
					}}
				>
					<Search size={20} color="var(--mui-palette-text-disabled, #9e9e9e)" />
					<input
						type="text"
						placeholder="Search"
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						className="bg-transparent text-base outline-none placeholder:text-gray-400"
					/>
				</Box>

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
						startIcon={<People sx={{ color: "secondary.contrastText" }} />}
						onClick={() => setShowJoinGroup(true)}
						sx={{
							bgcolor: "secondary.main",
							color: "secondary.contrastText",
							borderColor: "secondary.main",

							"&:hover": {
								bgcolor: "secondary.main",
								color: "secondary.contrastText",
								borderColor: "secondary.main",
							},
						}}
					>
						Join Group
					</Button>

					<Button
						type="button"
						variant="outlined"
						startIcon={<Add sx={{ color: "primary.contrastText" }} />}
						onClick={() => setCreateDialogOpen(true)}
						sx={{
							bgcolor: "primary.main",
							color: "primary.contrastText",
							borderColor: "primary.main",

							"&:hover": {
								bgcolor: "primary.main",
								color: "primary.contrastText",
								borderColor: "primary.main",
							},
						}}
					>
						Create Group
					</Button>
				</Box>
			</Box>

			<Divider sx={{ mt: 2 }} />

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
									description={group.description}
									memberEmails={group.memberEmails}
									totalMembers={group.totalMembers}
									creatorName={group.creatorName}
									actionRequired={true}
									pendingMeetingName={group.pendingMeetingName}
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

				<Box>
					<Typography
						variant="overline"
						color="text.disabled"
						sx={{ display: "block", mb: 2 }}
					>
						All (
						{
							filteredGroups.filter(
								(g) => g.ownerEmail !== null && !g.needsAvailability,
							).length
						}
						)
					</Typography>
					{filteredGroups.filter(
						(g) => g.ownerEmail !== null && !g.needsAvailability,
					).length > 0 ? (
						<Stack spacing={1.5}>
							{filteredGroups
								.filter((g) => g.ownerEmail !== null && !g.needsAvailability)
								.map((group) => (
									<GroupCard
										key={group.id}
										id={group.id}
										name={group.name}
										description={group.description}
										memberEmails={group.memberEmails}
										totalMembers={group.totalMembers}
										creatorName={group.creatorName}
										actionRequired={false}
										upcomingMeetingName={
											group.needsAvailability ? null : group.upcomingMeetingName
										}
									/>
								))}
						</Stack>
					) : (
						<Box
							sx={{
								display: "flex",
								flexDirection: "column",
								alignItems: "center",
								justifyContent: "center",
								py: 10,
							}}
						>
							<Typography
								variant="body1"
								color="text.secondary"
								fontWeight={500}
							>
								No groups found
							</Typography>
						</Box>
					)}
				</Box>
			</Box>

			<Box sx={{ mt: 4, display: { xs: "none", sm: "block" } }}>
				<Typography color="text.disabled" sx={{ p: 0.5 }}>
					All ({counts.all})
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
									memberEmails={group.memberEmails}
									totalMembers={group.totalMembers}
									creatorName={group.creatorName}
									actionRequired={group.needsAvailability}
									upcomingMeetingName={group.upcomingMeetingName}
								/>
							))}
					</Box>
				) : (
					<div className="flex min-h-[500px] flex-col items-center justify-center py-20 text-gray-400">
						<div
							className="mb-6 flex h-24 w-24 items-center justify-center rounded-full"
							style={{ backgroundColor: "rgba(0,0,0,0.04)" }}
						>
							<People sx={{ fontSize: "3.75rem", color: "divider" }} />
						</div>

						<p className="max-w-sm text-center text-gray-400 text-lg italic leading-relaxed">
							Create your first group to start <br />
							scheduling meetings.
						</p>
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

export function FilterChip({
	label,
	count,
	active,
	onClick,
}: {
	label: string;
	count: number;
	active: boolean;
	onClick: () => void;
}) {
	return (
		<Button
			onClick={onClick}
			disableElevation
			sx={{
				bgcolor: active ? "secondary.main" : "action.hover",
				color: active ? "secondary.contrastText" : "text.primary",
				"&:hover": {
					bgcolor: active ? "secondary.dark" : "action.selected",
				},
				boxShadow: "none",
				borderRadius: 1,
				fontWeight: 600,
				fontSize: "1rem",
			}}
		>
			{label} {count}
		</Button>
	);
}
