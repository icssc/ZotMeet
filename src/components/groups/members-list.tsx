import { removeGroupMember } from "@actions/group/remove-member/action";
import { Logout } from "@mui/icons-material";
import { Button, IconButton, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSnackbar } from "@/components/ui/snackbar-provider";
import { GroupRole } from "@/db/schema";
import { AdminMemberRow } from "./admin-member-row";
import { LeaveGroupDialog } from "./leave-group-dialog";
import { MemberAvatar } from "./member-avatar";
import type { GroupMember } from "./types";

export function MembersList({
	members,
	isAdmin,
	groupId,
	currentUserId,
}: {
	members: GroupMember[];
	isAdmin: boolean;
	groupId: string;
	currentUserId: string;
}) {
	const theme = useTheme();
	const adminCount = members.filter(
		(member) => member.role === GroupRole.ADMIN,
	).length;
	const [showLeaveDialog, setShowLeaveDialog] = useState(false);
	const { showSuccess, showError } = useSnackbar();
	const router = useRouter();
	const isMobile = useMediaQuery(theme.breakpoints.down("md"));

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

							<div className="flex items-center gap-4">
								{member.userId === currentUserId &&
									(isMobile ? (
										<IconButton
											onClick={() => setShowLeaveDialog(true)}
											sx={{
												color: "error.main",
												padding: 0,
											}}
										>
											<Logout
												sx={{
													color: "error.main",
												}}
											/>
										</IconButton>
									) : (
										<Button
											color="error"
											variant="text"
											startIcon={
												<Logout
													sx={{
														color: "error.main",
													}}
												/>
											}
											onClick={() => setShowLeaveDialog(true)}
											sx={{
												textTransform: "none",
												fontWeight: 600,
											}}
										>
											Leave
										</Button>
									))}
								<span
									style={{ color: theme.palette.text.secondary }}
									className="font-medium text-sm italic"
								>
									{member.role === GroupRole.ADMIN ? "Admin" : "Member"}
								</span>
							</div>

							{member.userId === currentUserId && (
								<LeaveGroupDialog
									open={showLeaveDialog}
									email={member.email}
									onClose={() => setShowLeaveDialog(false)}
									onConfirm={async () => {
										const result = await removeGroupMember(
											groupId,
											member.userId,
											true,
										);

										if (result?.success) {
											showSuccess(result.message);
											router.push("/groups");
										} else {
											showError(result?.message);
										}

										setShowLeaveDialog(false);
									}}
								/>
							)}
						</div>
					),
				)}
			</div>
		</div>
	);
}
