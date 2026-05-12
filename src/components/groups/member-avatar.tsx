import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export function MemberAvatar({
	email,
	profilePicture,
	className,
}: {
	email: string;
	profilePicture?: string | null;
	className?: string;
}) {
	const initials = email.split("@")[0]?.slice(0, 2).toUpperCase() ?? "??";

	return (
		<Avatar className={cn("size-12 shrink-0 font-medium text-sm", className)}>
			{profilePicture ? (
				<AvatarImage
					src={profilePicture}
					alt=""
					referrerPolicy="no-referrer"
					className="object-cover"
				/>
			) : null}
			<AvatarFallback className="rounded-full bg-slate-200 text-slate-600">
				{initials}
			</AvatarFallback>
		</Avatar>
	);
}
