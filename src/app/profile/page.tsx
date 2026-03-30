"use client";

import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useThemeMode } from "@/components/theme/theme-provider";

export default function ProfilePage() {
	const { mode, setMode } = useThemeMode();

	return (
		<div className="px-8 py-8">
			<h1 className="font-figtree font-medium text-3xl">Profile</h1>
		</div>
	);
}
