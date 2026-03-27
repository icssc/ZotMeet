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
		<div className="flex h-[170px] w-full flex-col gap-1 overflow-hidden rounded-[10px] border border-gray-200 bg-gray-100 px-[30px] py-[30px] sm:h-[280] sm:w-[500]">
			<Link href={`/groups/${id}`} className="block h-full w-full">
				<div className="flex h-full w-full flex-col gap-[11px] overflow-hidden text-left">
					<div className="flex w-full items-center gap-2">
						<div className="relative size-[45px] shrink-0">
							<Image
								src="/icssc-logo.svg"
								alt="default-pfp"
								fill
								className="object-contain object-bottom"
							/>
						</div>
						<div>
							<p className="w-full truncate text-center font-bold text-md sm:text-xl">
								{name}
							</p>
							<p className="block text-gray-500 sm:hidden">
								{totalMembers} Members
							</p>
						</div>
						<div className="ml-auto sm:hidden">
							<KeyboardArrowRight />
						</div>
					</div>

					<p className="line-clamp-2 w-full text-left text-[#717182] text-[15px] sm:line-clamp-3 sm:text-[20px]">
						{description ?? ""}
					</p>

					<div className="hidden w-full items-center text-gray-600 text-sm sm:flex sm:text-base">
						<div className="flex gap-1">
							<PeopleOutline fontSize="small" />
							<p>{totalMembers}</p>
						</div>

						<p className="ml-auto">Created by {creatorName}</p>

						<div className="ml-2 flex size-[20px] shrink-0 items-center justify-center rounded-full bg-gray-400 text-white">
							{creatorName[0]}
						</div>
					</div>
				</div>
			</Link>
		</div>
	);
}
