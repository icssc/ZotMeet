import { removeGroupMember } from "@actions/group/remove-member/action";
import { updateMemberRole } from "@actions/group/update-member-role/action";
import { Check, Close } from "@mui/icons-material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import {
	Button,
	ButtonBase,
	Drawer,
	IconButton,
	Typography,
	useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
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
import { MemberAvatar } from "./member-avatar";
import { RemoveMemberDialog } from "./remove-member-dialog";

type Member = {
	userId: string;
	memberId: string;
	email: string;
	role: GroupRole;
};

export function AdminMemberRow({
	member,
	groupId,
	isSelf,
}: {
	member: Member;
	groupId: string;
	isSelf: boolean;
}) {
	const [isPending, startTransition] = useTransition();
	const [showRemoveDialog, setShowRemoveDialog] = useState(false);
	const [showPermissionsSheet, setShowPermissionsSheet] = useState(false);
	const [showRoleDialog, setShowRoleDialog] = useState(false);
	const [pendingRole, setPendingRole] = useState<GroupRole | null>(null);

	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("md"));

	const { showSuccess, showError } = useSnackbar();

	function handleRoleSelection(value: string) {
		const nextRole = value as GroupRole;

		if (nextRole === member.role) return;

		setPendingRole(nextRole);
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
		const result = await removeGroupMember(groupId, member.userId);

		if (result?.success) {
			showSuccess(result.message);
			setShowRemoveDialog(false);
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
					<MemberAvatar email={member.email} />
					<span
						style={{
							color: theme.palette.text.primary,
						}}
						className="font-medium text-base"
					>
						{member.email.split("@")[0]}

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
					<Button
						disabled={isPending}
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
								opacity: 0.5,
							},
						}}
						endIcon={
							<KeyboardArrowDownIcon
								sx={{
									fontSize: 16,
									color: "text.secondary",
								}}
							/>
						}
					>
						{member.role === GroupRole.ADMIN ? "Admin" : "Member"}
					</Button>
				) : (
					<div className="flex items-center gap-2">
						<Select
							value={member.role ?? GroupRole.MEMBER}
							onValueChange={handleRoleSelection}
							disabled={isSelf || isPending}
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

						{!isSelf && (
							<IconButton
								color="error"
								onClick={() => setShowRemoveDialog(true)}
							>
								<PersonRemoveIcon />
							</IconButton>
						)}
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
						<MemberAvatar email={member.email} />

						<div className="flex flex-col">
							<Typography fontWeight={600}>
								{member.email.split("@")[0]}
							</Typography>

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
							sx={{
								display: "flex",
								flexDirection: "column",
								alignItems: "flex-start",
								justifyContent: "flex-start",
								textAlign: "left",
								width: "100%",
								borderRadius: 2,
								p: 1.5,
								gap: 0.5,
							}}
						>
							<Typography color="error" fontWeight={600}>
								Remove Account
							</Typography>

							<Typography
								variant="body2"
								color="text.secondary"
								sx={{ maxWidth: "100%" }}
							>
								This account will be permanently removed from the group & no
								longer have access to meetings.
							</Typography>
						</ButtonBase>
					)}
				</div>
			</Drawer>

			{/* role change confrimation */}
			<ChangeRoleDialog
				open={showRoleDialog}
				email={member.email}
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
				onClose={() => setShowRemoveDialog(false)}
				onConfirm={handleRemoveMember}
			/>
		</>
	);
}
