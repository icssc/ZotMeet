"use client";

import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useThemeMode } from "@/components/theme/theme-provider";

export function ProfileContent() {
	const { mode, setMode } = useThemeMode();

	return (
		<Box>
			<Typography variant="body1" sx={{ fontWeight: 500, mb: 1 }}>
				Preferred Display Mode
			</Typography>
			<Box sx={{ maxWidth: "24rem" }}>
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
			</Box>
		</Box>
	);
}
