"use client";

import { saveEmailPreferences } from "@actions/user/action";
import { Paper, Switch } from "@mui/material";
import { useEffect, useState, useTransition } from "react";
import { useSnackbar } from "@/components/ui/snackbar-provider";

interface NotificationPreferencesProps {
	emailNotifications: boolean;
}

export function NotificationPreferences({
	emailNotifications,
}: NotificationPreferencesProps) {
	const [checked, setChecked] = useState(emailNotifications);
	const [isPending, startTransition] = useTransition();

	useEffect(() => {
		setChecked(emailNotifications);
	}, [emailNotifications]);
	const { showError } = useSnackbar();

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const next = event.target.checked;
		const previous = checked;
		setChecked(next);
		startTransition(async () => {
			try {
				await saveEmailPreferences(next);
			} catch {
				setChecked(previous);
				showError("Could not update email preferences");
			}
		});
	};

	return (
		<div>
			<div className="w-80">
				<Paper className="flex w-full items-center justify-between gap-2 p-8">
					<p>Opt into emails</p>
					<Switch
						checked={checked}
						onChange={handleChange}
						disabled={isPending}
					/>
				</Paper>
			</div>
		</div>
	);
}
