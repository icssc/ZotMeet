"use client";

import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useState } from "react";

export default function ProfilePage() {
	const [mode, setMode] = useState("light");

	return (
		<div className="space-y-6 px-8 py-8">
			<h1 className="font-medium font-montserrat text-3xl">Profile</h1>

			<div className="max-w-sm">
				<p className="mb-2 font-medium">Preferred Display Mode</p>

				<FormControl fullWidth>
					<InputLabel id="theme-select-label">Mode</InputLabel>
					<Select
						labelId="theme-select-label"
						value={mode}
						label="Mode"
						onChange={(e) => setMode(e.target.value)}
					>
						<MenuItem value="light">Light</MenuItem>
						<MenuItem value="dark">Dark</MenuItem>
					</Select>
				</FormControl>
			</div>
		</div>
	);
}
