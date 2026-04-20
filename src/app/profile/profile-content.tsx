"use client";

import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useThemeMode } from "@/components/theme/theme-provider";

export function ProfileContent() {
	const { mode, setMode } = useThemeMode();

	return (
		<div className="px-8 py-8">
			<h1 className="font-figtree font-medium text-3xl">Profile</h1>
			<div className="max-w-sm">
				<p className="mb-2 font-medium">Preferred Display Mode</p>

				<FormControl fullWidth>
					<InputLabel id="theme-select-label">Mode</InputLabel>
					<Select
						labelId="theme-select-label"
						value={mode}
						label="Mode"
						onChange={(e) =>
							setMode(e.target.value as "light" | "dark" | "system")
						}
					>
						<MenuItem value="light">Light</MenuItem>
						<MenuItem value="dark">Dark</MenuItem>
						<MenuItem value="system">System</MenuItem>
					</Select>
				</FormControl>
			</div>
		</div>
	);
}
