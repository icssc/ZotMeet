"use client";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";
import Typography from "@mui/material/Typography";
import { useState } from "react";

const NOTIFICATION_OPTIONS = [
	{ id: "meeting-invites", label: "Meeting Invites", description: "Receive" },
	{ id: "group-invites", label: "Group Invites", description: "Receive" },
	{ id: "nudges", label: "Nudges", description: "Receive" },
];

export function NotificationsPanel() {
	const [toggles, setToggles] = useState<Record<string, boolean>>(
		Object.fromEntries(NOTIFICATION_OPTIONS.map((opt) => [opt.id, true])),
	);

	const handleToggle = (id: string) => {
		setToggles((prev) => ({ ...prev, [id]: !prev[id] }));
	};

	return (
		<Stack spacing={3}>
			<Typography variant="h5">Notifications</Typography>

			<Stack spacing={0}>
				{NOTIFICATION_OPTIONS.map((option) => (
					<Box
						key={option.id}
						sx={{
							display: "flex",
							alignItems: "center",
							justifyContent: "space-between",
							py: 2,
							borderBottom: 1,
							borderColor: "divider",
						}}
					>
						<Box>
							<Typography variant="body1" fontWeight={500}>
								{option.label}
							</Typography>
							<Typography variant="body2" color="text.secondary">
								{option.description}
							</Typography>
						</Box>
						<Switch
							checked={toggles[option.id] ?? true}
							onChange={() => handleToggle(option.id)}
							color="primary"
						/>
					</Box>
				))}
			</Stack>

			<Stack
				direction="row"
				justifyContent="flex-end"
				spacing={2}
				sx={{ pt: 2 }}
			>
				<Button
					variant="text"
					color="primary"
					onClick={() =>
						setToggles(
							Object.fromEntries(
								NOTIFICATION_OPTIONS.map((opt) => [opt.id, true]),
							),
						)
					}
				>
					Discard
				</Button>
				<Button variant="contained" color="primary">
					Save Changes
				</Button>
			</Stack>
		</Stack>
	);
}
