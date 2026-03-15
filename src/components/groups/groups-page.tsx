"use client";

import { Add } from "@mui/icons-material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { Button } from "@mui/material";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { CreateGroupDialog } from "@/components/groups/create-group-dialog";
import { GroupCard } from "@/components/groups/group-card";
import { cn } from "@/lib/utils";
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
			<div className="flex">
				<div className="flex items-center gap-2.5 rounded-full bg-gray-200 px-4 py-2">
					<Search className="size-5 text-gray-600" />
					<input
						type="text"
						placeholder="Search"
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						className="bg-transparent font-semibold text-base outline-none placeholder:text-gray-500"
					/>
				</div>

				<div className="ml-auto flex">
					<Button
						type="button"
						onClick={() => setShowJoinGroup(true)}
						className="flex items-center"
					>
						<div className="flex gap-2 text-black">
							<PersonAddIcon className="size-5" />
							<p>Join Group</p>
						</div>
					</Button>

					<Button
						type="button"
						onClick={() => setCreateDialogOpen(true)}
						className="flex items-center"
					>
						<div className="flex gap-2 text-black">
							<Add className="size-5" />
							<p>Create Group</p>
						</div>
					</Button>

					<InviteDecision
						open={showJoinGroup}
						onOpenChange={setShowJoinGroup}
					/>
				</div>
			</div>

			<div className="mt-4 border-gray-200 border-b" />

			<div className="mt-4 flex flex-col flex-wrap gap-3">
				<div className="flex">
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
						label="Invited"
						count={counts.availability}
						active={activeFilter === "availability"}
						onClick={() => setActiveFilter("availability")}
					/>
				</div>
			</div>

			<div className="mt-8">
				{filteredGroups.length > 0 ? (
					<div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
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
		<button
			type="button"
			onClick={onClick}
			className={cn(
				"flex items-center gap-2.5 rounded-full px-4 py-2 transition-colors",
				active
					? "bg-blue-950/80 text-white"
					: "bg-black/[0.04] text-black hover:bg-black/[0.08]",
			)}
		>
			<span className="font-semibold text-base">{label}</span>
			<span
				className={cn(
					"font-bold text-xs uppercase",
					active ? "text-white" : "text-[#918d89]",
				)}
			>
				{count}
			</span>
		</button>
	);
}
