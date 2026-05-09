import { Check, Close } from "@mui/icons-material";
import {
	ButtonBase,
	Divider,
	Drawer,
	IconButton,
	Typography,
} from "@mui/material";

import { GroupRole } from "@/db/schema";

interface Props {
	open: boolean;
	selectedRole: GroupRole;
	onClose: () => void;
	onChange: (role: GroupRole) => void;
}

const roles = [
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
];

export function PermissionDrawer({
	open,
	selectedRole,
	onClose,
	onChange,
}: Props) {
	return (
		<Drawer
			anchor="bottom"
			open={open}
			onClose={onClose}
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
			<div className="flex flex-col gap-4">
				<div className="flex items-center justify-between">
					<Typography variant="h6">Permission Settings</Typography>

					<IconButton onClick={onClose}>
						<Close />
					</IconButton>
				</div>

				<div>
					{roles.map((role, index) => (
						<div key={role.value}>
							<ButtonBase
								onClick={() => {
									onChange(role.value);
									onClose();
								}}
								sx={{
									width: "100%",
									p: 2,
									display: "flex",
									justifyContent: "space-between",
									textAlign: "left",
								}}
							>
								<div>
									<Typography fontWeight={600}>{role.label}</Typography>

									<Typography color="text.secondary">
										{role.description}
									</Typography>
								</div>

								{selectedRole === role.value && (
									<Check
										sx={{
											color: "primary.main",
										}}
									/>
								)}
							</ButtonBase>

							{index < roles.length - 1 && <Divider />}
						</div>
					))}
				</div>
			</div>
		</Drawer>
	);
}
