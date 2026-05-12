import { removeGroupMember } from "@actions/group/remove-member/action";
import { updateMemberRole } from "@actions/group/update-member-role/action";
import { Check, Close, Logout } from "@mui/icons-material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import {
	Button,
	ButtonBase,
	Drawer,
	IconButton,
	Tooltip,
	Typography,
	useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useSnackbar } from "@/components/ui/snackbar-provider";
import { GroupRole } from "@/db/schema";
import { ChangeRoleDialog } from "./change-role-dialog";
import { LeaveGroupDialog } from "./leave-group-dialog";
import { MemberAvatar } from "./member-avatar";
import { RemoveMemberDialog } from "./remove-member-dialog";
import type { GroupMember } from "./types";

function isGroupRole(value: string): value is GroupRole {
	return value === GroupRole.ADMIN || value === GroupRole.MEMBER;
}

export function AdminMemberRow({
	member,
	groupId,
	isSelf,
	isLastAdmin,
}: {
	member: GroupMember;
	groupId: string;
	isSelf: boolean;
	isLastAdmin: boolean;
}) {
	const [isPending, startTransition] = useTransition();
	const [showRemoveDialog, setShowRemoveDialog] = useState(false);
	const [showPermissionsSheet, setShowPermissionsSheet] = useState(false);
	const [showRoleDialog, setShowRoleDialog] = useState(false);
	const [pendingRole, setPendingRole] = useState<GroupRole | null>(null);
	const [showLeaveDialog, setShowLeaveDialog] = useState(false);

	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("md"));
	const cannotLeave = isSelf && isLastAdmin;

	const { showSuccess, showError } = useSnackbar();

	const router = useRouter();

	function handleRoleSelection(value: string) {
		if (!isGroupRole(value) || value === member.role) return;

		setPendingRole(value);
		setShowRoleDialog(true);
	}

	function confirmRoleChange() {
		if (!pendingRole) return;

		startTransition(async () => {
			const result = await updateMemberRole({
				groupId,
				targetUserId: member.userId,
				role: pendingRole,
			});

			if (result?.success) {
				showSuccess(result.message);
				setShowRoleDialog(false);
				setPendingRole(null);
			} else if (result?.message) {
				showError(result.message);
			}
		});
	}

	async function handleRemoveMember() {
		if (cannotLeave) {
			showError("You must assign another admin before leaving this group.");
			return;
		}

		const result = await removeGroupMember(groupId, member.userId, isSelf);

		if (result?.success) {
			showSuccess(result.message);
			setShowRemoveDialog(false);

			if (isSelf) {
				router.push("/groups");
				return;
			}
		} else {
			showError(result?.message);
		}
	}

	return (
		<>
			<div
				style={{
					borderBottom: `1px solid ${theme.palette.divider}`,
				}}
				className="flex h-[83px] items-center justify-between px-4 transition-colors hover:bg-gray-50/50"
			>
				<div className="flex items-center gap-4">
					<MemberAvatar
						email={member.email}
						profilePicture={member.profilePicture}
					/>
					<span
						style={{
							color: theme.palette.text.primary,
						}}
						className="font-medium text-base"
					>
						{member.displayName}

						{isSelf && (
							<span
								style={{
									color: theme.palette.text.secondary,
								}}
								className="ml-2 text-xs"
							>
								(you)
							</span>
						)}
					</span>
				</div>

				{isMobile ? (
					<div className="flex items-center gap-3">
						{isSelf && (
							<IconButton
								onClick={() => {
									if (cannotLeave) {
										showError(
											"You must assign another admin before leaving this group.",
										);
										return;
									}

									setShowLeaveDialog(true);
								}}
								sx={{
									color: "error.main",
									padding: 0,
									opacity: cannotLeave ? 0.4 : 1,
								}}
							>
								<Logout
									sx={{
										color: "error.main",
									}}
								/>
							</IconButton>
						)}
						{!isSelf && (
							<ButtonBase
								onClick={() => setShowRemoveDialog(true)}
								sx={{
									padding: 0,
								}}
							>
								<PersonRemoveIcon />
							</ButtonBase>
						)}

						<Button
							disabled={isPending || isSelf}
							onClick={() => setShowPermissionsSheet(true)}
							disableRipple
							sx={{
								textTransform: "none",
								minWidth: "auto",
								padding: 0,
								color: "text.primary",
								fontSize: "0.875rem",
								fontWeight: 500,
								gap: 0.5,
								"&.Mui-disabled": {
									opacity: 1,
								},
							}}
							endIcon={
								!isSelf ? (
									<KeyboardArrowDownIcon
										sx={{
											fontSize: 16,
											color: "text.secondary",
										}}
									/>
								) : undefined
							}
						>
							{member.role === GroupRole.ADMIN ? "Admin" : "Member"}
						</Button>
					</div>
				) : (
					<div className="flex items-center gap-3">
						{isSelf && (
							<Tooltip
								title={
									cannotLeave
										? "You must assign another admin before leaving this group."
										: ""
								}
								arrow
							>
								<span>
									<ButtonBase
										disabled={cannotLeave}
										onClick={() => setShowLeaveDialog(true)}
										sx={{
											display: "flex",
											alignItems: "center",
											gap: 0.75,
											color: "error.main",
											fontWeight: 600,
											borderRadius: 2,
											px: 1,
											py: 0.75,
											opacity: cannotLeave ? 0.4 : 1,
										}}
									>
										<Logout
											fontSize="small"
											sx={{
												color: "error.main",
											}}
										/>

										<Typography
											fontSize="0.875rem"
											fontWeight={600}
											color="error"
										>
											Leave
										</Typography>
									</ButtonBase>
								</span>
							</Tooltip>
						)}
						{!isSelf && (
							<ButtonBase
								onClick={() => setShowRemoveDialog(true)}
								sx={{
									display: "flex",
									alignItems: "center",
									gap: 0.75,
									fontWeight: 600,
									borderRadius: 2,
									px: 1,
									py: 0.75,
								}}
							>
								<PersonRemoveIcon fontSize="small" />
								<Typography fontSize="0.875rem" fontWeight={600}>
									Remove
								</Typography>
							</ButtonBase>
						)}
						<Select
							value={member.role ?? GroupRole.MEMBER}
							onValueChange={handleRoleSelection}
							disabled={isPending || isSelf}
						>
							<SelectTrigger
								style={{
									backgroundColor: theme.palette.background.default,
									color: theme.palette.text.primary,
									border: `1px solid ${theme.palette.divider}`,
								}}
								className="h-9 w-[140px] rounded-lg text-sm"
							>
								<SelectValue />
							</SelectTrigger>

							<SelectContent>
								<SelectItem value={GroupRole.ADMIN}>Admin</SelectItem>
								<SelectItem value={GroupRole.MEMBER}>Member</SelectItem>
							</SelectContent>
						</Select>
					</div>
				)}
			</div>

			{/* Mobile member permissions settings */}
			<Drawer
				anchor="bottom"
				open={showPermissionsSheet}
				onClose={() => setShowPermissionsSheet(false)}
				slotProps={{
					paper: {
						sx: {
							borderTopLeftRadius: 20,
							borderTopRightRadius: 20,
							p: 3,
						},
					},
				}}
			>
				<div className="flex flex-col gap-6">
					<div className="flex items-center justify-between">
						<Typography variant="h6" fontWeight={700}>
							Permission Settings
						</Typography>

						<IconButton onClick={() => setShowPermissionsSheet(false)}>
							<Close />
						</IconButton>
					</div>

					<div className="flex items-center gap-4">
						<MemberAvatar
							email={member.email}
							profilePicture={member.profilePicture}
						/>

						<div className="flex flex-col">
							<Typography fontWeight={600}>{member.displayName}</Typography>

							<Typography variant="body2" color="text.secondary">
								{member.email}
							</Typography>
						</div>
					</div>

					<div className="flex flex-col">
						{[
							{
								label: "Member",
								description: "Can view and comment on content",
								value: GroupRole.MEMBER,
							},
							{
								label: "Admin",
								description: "Full access to all features",
								value: GroupRole.ADMIN,
							},
						].map((role) => {
							const isSelected = member.role === role.value;

							return (
								<ButtonBase
									key={role.value}
									onClick={() => {
										handleRoleSelection(role.value);
										setShowPermissionsSheet(false);
									}}
									disableRipple
									sx={{
										width: "100%",
										display: "flex",
										alignItems: "flex-start",
										justifyContent: "space-between",
										textAlign: "left",
										borderRadius: 2,
										p: 1.5,
										"&:hover": {
											backgroundColor: "transparent",
										},
									}}
								>
									<div>
										<Typography fontWeight={600}>{role.label}</Typography>

										<Typography
											variant="body2"
											color="text.secondary"
											sx={{ mt: 0.25 }}
										>
											{role.description}
										</Typography>
									</div>

									{isSelected && (
										<Check
											sx={{
												color: "primary.main",
												fontSize: 20,
												mt: 0.25,
											}}
										/>
									)}
								</ButtonBase>
							);
						})}
					</div>

					{/* Remove member */}
					{!isSelf && (
						<ButtonBase
							onClick={() => {
								setShowPermissionsSheet(false);
								setShowRemoveDialog(true);
							}}
							disableRipple
							sx={{
								display: "flex",
								alignItems: "center",
								justifyContent: "flex-start",
								gap: 1,
								width: "100%",
								borderRadius: 2,
								p: 1.5,
								color: "error.main",
								"&:hover": { backgroundColor: "transparent" },
							}}
						>
							<PersonRemoveIcon fontSize="small" sx={{ color: "error.main" }} />
							<Typography fontWeight={600} color="error">
								Remove from Group
							</Typography>
						</ButtonBase>
					)}
				</div>
			</Drawer>

			{/* role change confrimation */}
			<ChangeRoleDialog
				open={showRoleDialog}
				email={member.email}
				profilePicture={member.profilePicture}
				currentRole={member.role}
				nextRole={pendingRole ?? member.role}
				onClose={() => {
					setShowRoleDialog(false);
					setPendingRole(null);
				}}
				onConfirm={confirmRoleChange}
			/>

			{/* Remove confirmation */}
			<RemoveMemberDialog
				open={showRemoveDialog}
				email={member.email}
				profilePicture={member.profilePicture}
				onClose={() => setShowRemoveDialog(false)}
				onConfirm={async () => {
					await handleRemoveMember();
				}}
			/>

			{/* leave group confirmation */}
			<LeaveGroupDialog
				open={showLeaveDialog}
				email={member.email}
				profilePicture={member.profilePicture}
				onClose={() => setShowLeaveDialog(false)}
				onConfirm={async () => {
					await handleRemoveMember();
				}}
			/>
		</>
	);
}
