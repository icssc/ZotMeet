import { useTheme } from "@mui/material/styles";
import { GroupRole } from "@/db/schema";
import { AdminMemberRow } from "./admin-member-row";
import { MemberAvatar } from "./member-avatar";

type Member = {
	userId: string;
	memberId: string;
	email: string;
	role: GroupRole;
};

export function MembersList({
	members,
	isAdmin,
	groupId,
	currentUserId,
}: {
	members: Member[];
	isAdmin: boolean;
	groupId: string;
	currentUserId: string;
}) {
	const theme = useTheme();
	const adminCount = members.filter(
		(member) => member.role === GroupRole.ADMIN,
	).length;

	return (
		<div className="mt-4">
			<p className="mb-2 px-4 font-bold text-[#969696] text-xs uppercase tracking-wide">
				All Members ({members.length})
			</p>

			<div className="flex flex-col">
				{members.map((member) =>
					isAdmin ? (
						<AdminMemberRow
							key={member.userId}
							member={member}
							groupId={groupId}
							isSelf={member.userId === currentUserId}
							isLastAdmin={member.role === GroupRole.ADMIN && adminCount === 1}
						/>
					) : (
						<div
							key={member.userId}
							style={{ borderBottom: `1px solid ${theme.palette.divider}` }}
							className="flex h-[83px] items-center justify-between px-4 transition-colors hover:bg-gray-50/50"
						>
							<div className="flex items-center gap-4">
								<MemberAvatar email={member.email} />
								<span
									style={{ color: theme.palette.text.primary }}
									className="font-medium text-base"
								>
									{member.email.split("@")[0]}
									{member.userId === currentUserId && (
										<span
											style={{ color: theme.palette.text.secondary }}
											className="ml-2 text-xs"
										>
											(you)
										</span>
									)}
								</span>
							</div>
							<span
								style={{ color: theme.palette.text.secondary }}
								className="font-medium text-sm italic"
							>
								{member.role === GroupRole.ADMIN ? "Admin" : "Member"}
							</span>
						</div>
					),
				)}
			</div>
		</div>
	);
}
