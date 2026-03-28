import { KeyboardArrowRight, PeopleOutline } from "@mui/icons-material";
import Image from "next/image";
import Link from "next/link";

interface GroupCardProps {
	id: string;
	name: string;
	description: string | null;
	memberEmails?: string[];
	totalMembers: number;
	creatorName: string;
}

export function GroupCard({
	id,
	name,
	description,
	totalMembers,
	creatorName,
}: GroupCardProps) {
	return (
		<Link
			href={`/groups/${id}`}
			className="flex h-42 w-full flex-col gap-1 overflow-hidden rounded-md border border-gray-200 bg-gray-100 px-8 py-8 sm:h-70"
		>
			<div className="flex h-full flex-col gap-3">
				<div className="flex w-full items-center gap-2">
					<div className="relative size-12 shrink-0">
						<Image
							src="/icssc-logo.svg"
							alt="group-pfp"
							fill
							className="object-contain"
						/>
					</div>

					<div>
						<p className="font-bold text-md sm:text-xl">{name}</p>
						<p className="block text-gray-500 sm:hidden">
							{totalMembers} Members
						</p>
					</div>

					<div className="ml-auto sm:hidden">
						<KeyboardArrowRight />
					</div>
				</div>

				<p className="line-clamp-2 w-full text-left text-gray-500 text-sm sm:line-clamp-3 sm:text-xl">
					{description || "No Description Provided"}
				</p>

				<div className="hidden w-full items-center text-gray-600 text-sm sm:flex sm:text-base">
					<div className="flex gap-1">
						<PeopleOutline fontSize="small" />
						<p>{totalMembers}</p>
					</div>

					<p className="ml-auto">Created by {creatorName}</p>

					<div className="ml-2 flex size-5 shrink-0 items-center justify-center rounded-full bg-gray-400 text-white">
						{creatorName[0]}
					</div>
				</div>
			</div>
		</Link>
	);
}
