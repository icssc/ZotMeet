"use client";

import { Add } from "@mui/icons-material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { Button } from "@mui/material";
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

export function GroupsPage({ groups }: GroupsPageProps) {
	const [search, setSearch] = useState("");
	const [activeFilter, setActiveFilter] = useState<FilterTab>("all");
	const [createDialogOpen, setCreateDialogOpen] = useState(false);

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
				result = result.filter((g) => g.needsAvailability);
				break;
		}

		return result;
	}, [groups, search, activeFilter]);

	const counts = useMemo(
		() => ({
			all: groups.length,
			created: groups.filter((g) => g.isCreator).length,
			availability: groups.filter((g) => g.needsAvailability).length,
		}),
		[groups],
	);

	const [showJoinGroup, setShowJoinGroup] = useState(false);

	return (
		<div className="w-full">
			<div className="mt-6 mb-8 flex items-center sm:hidden">
				<h1 className="text-5xl">Groups</h1>

				<Button
					type="button"
					variant="contained"
					onClick={() => setCreateDialogOpen(true)}
					sx={{
						fontSize: "2rem",
						padding: 0,
						marginLeft: "auto",
						minWidth: 0,
						width: "3rem",
						height: "3rem",
					}}
				>
					+
				</Button>
			</div>

			<div className="block sm:flex">
				<div className="flex items-center gap-2.5 rounded-full bg-gray-100 px-4 py-2">
					<Search className="size-5 text-gray-400" />
					<input
						type="text"
						placeholder="Search"
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						className="bg-transparent text-base outline-none placeholder:text-gray-400"
					/>
				</div>

				<div className="ml-auto hidden items-center gap-2 sm:flex">
					<Button
						type="button"
						variant="outlined"
						startIcon={<PersonAddIcon />}
						onClick={() => setShowJoinGroup(true)}
					>
						Join Group
					</Button>

					<Button
						type="button"
						variant="outlined"
						startIcon={<Add />}
						onClick={() => setCreateDialogOpen(true)}
					>
						Create Group
					</Button>
				</div>
			</div>

			<div className="mt-4 border-gray-200 border-b" />

			<div className="mt-4 flex flex-col flex-wrap gap-3">
				<div className="flex gap-1">
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
						label="Availability Needed"
						count={counts.availability}
						active={activeFilter === "availability"}
						onClick={() => setActiveFilter("availability")}
					/>
				</div>
			</div>

			<div className="mt-8">
				<p className="p-1 text-gray-400">All ({counts.all})</p>
				{filteredGroups.length > 0 ? (
					<div className="grid grid-cols-1 gap-y-2 sm:grid-cols-3 sm:gap-x-8 sm:gap-y-8">
						{filteredGroups
							.filter((group) => group.ownerEmail !== null)
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
								/>
							))}
					</div>
				) : (
					<div className="flex flex-col items-center justify-center py-20 text-gray-500">
						<p className="font-medium text-lg">No groups found</p>
					</div>
				)}
			</div>

			<CreateGroupDialog
				open={createDialogOpen}
				onOpenChange={setCreateDialogOpen}
			/>

			<InviteDecision open={showJoinGroup} onOpenChange={setShowJoinGroup} />
		</div>
	);
}

function FilterChip({
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
				bgcolor: active ? "secondary.main" : "rgba(0,0,0,0.04)",
				color: active ? "secondary.contrastText" : "text.primary",
				"&:hover": {
					bgcolor: active ? "secondary.dark" : "rgba(0,0,0,0.08)",
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
