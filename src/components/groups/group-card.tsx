import Link from "next/link";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface GroupCardProps {
	id: string;
	name: string;
	description: string | null;
	memberEmails: string[];
	totalMembers: number;
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
}: GroupCardProps) {
	const overflow = totalMembers - memberEmails.length;

	return (
		<div className="flex w-full max-w-[650px] flex-col items-center gap-4 overflow-hidden rounded-[10px] border border-gray-200 bg-gray-100 px-[30px] py-[26px]">
			<div className="flex w-full flex-col items-center gap-[11px] overflow-hidden">
				<div className="size-[100px] rounded-full bg-gray-300" />

				<p className="text-center font-medium text-[#0a0a0a] text-base">
					{name}
				</p>

				<div className="flex items-center -space-x-2">
					{memberEmails.map((email) => (
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

				<p className="w-full truncate text-center text-[#717182] text-base">
					{description || "No description"}
				</p>
			</div>

			<Link href={`/groups/${id}`} className="w-full">
				<button
					type="button"
					className={cn(
						"w-full rounded px-[22px] py-2",
						"bg-black font-medium text-[15px] text-white uppercase tracking-[0.46px]",
						"shadow-[0px_1px_5px_0px_rgba(0,0,0,0.12),0px_2px_2px_0px_rgba(0,0,0,0.14),0px_3px_1px_-2px_rgba(0,0,0,0.2)]",
						"transition-colors hover:bg-gray-800",
					)}
				>
					View Group
				</button>
			</Link>
		</div>
	);
}
