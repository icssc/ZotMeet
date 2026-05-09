export function MemberAvatar({ email }: { email: string }) {
	const initials = email.split("@")[0]?.slice(0, 2).toUpperCase() ?? "??";
	return (
		<div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-slate-200 font-medium text-slate-600 text-sm">
			{initials}
		</div>
	);
}
