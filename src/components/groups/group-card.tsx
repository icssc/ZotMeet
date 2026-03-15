import { PeopleOutline } from "@mui/icons-material";
import Link from "next/link";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface GroupCardProps {
	id: string;
	name: string;
	description: string | null;
	memberEmails: string[];
	totalMembers: number;
	creatorName: string;
}

function getInitials(email: string): string {
	const name = email.split("@")[0] ?? "";
	return name.slice(0, 2).toUpperCase();
}

export function GroupCard({
	id,
	name,
	description,
	memberEmails,
	totalMembers,
	creatorName,
}: GroupCardProps) {
	return (
		<div className="flex h-full w-full max-w-[650px] flex-col items-center gap-4 overflow-hidden rounded-[10px] border border-gray-200 bg-gray-100 px-[30px] py-[60px]">
			<Link href={`/groups/${id}`} className="block h-full w-full">
				<div className="flex h-full w-full flex-col items-center gap-[11px] overflow-hidden">
					<div className="mr-auto flex items-center gap-2">
						{/* place holder for group pfp */}
						<div className="flex size-[30px] shrink-0 items-center justify-center rounded-full bg-gray-300 text-gray-500">
							{name.split("")[0]}
						</div>

						<p className="w-full truncate text-center font-bold text-[#0a0a0a] text-base">
							{name}
						</p>
					</div>

					{/*
				<div className="flex items-center -space-x-2">
					{displayEmails.map((email) => (
						<Avatar key={email} className="size-6 border-2 border-white">
							<AvatarFallback className="text-[10px]">
								{getInitials(email)}
							</AvatarFallback>
						</Avatar>
					))}
					{overflow > 0 && (
						<Avatar className="size-6 border-2 border-white">
							<AvatarFallback className="text-[10px]">
								+{overflow}
							</AvatarFallback>
						</Avatar>
					)}
				</div>
*/}

					<p className="line-clamp-3 w-full flex-1 text-center text-[#717182] text-base">
						{description ?? ""}
					</p>

					<div className="flex w-full items-center text-gray-500 text-sm">
						<div className="flex gap-1">
							<PeopleOutline fontSize="small" />
							<p className="">{totalMembers}</p>
						</div>

						<p className="ml-auto">Created by {creatorName}</p>

						{/* place holder for group pfp */}
						<div className="ml-2 flex size-[20px] shrink-0 items-center justify-center rounded-full bg-gray-300">
							{creatorName.split("")[0]}
						</div>
					</div>
				</div>
			</Link>
		</div>
	);
}
