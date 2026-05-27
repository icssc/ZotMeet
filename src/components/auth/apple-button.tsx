"use client";

import AppleIcon from "@mui/icons-material/Apple";
import { Button, useTheme } from "@mui/material";

export function AppleButton() {
	const theme = useTheme();
	const isDark = theme.palette.mode === "dark";

	return (
		<form action="/auth/login/apple" method="GET" className="w-full">
			<Button
				type="submit"
				variant="contained"
				fullWidth
				startIcon={<AppleIcon />}
				sx={{
					boxShadow: "none",
					backgroundColor: isDark ? "#fff" : "#000",
					color: isDark ? "#000" : "#fff",
					"&:hover": {
						backgroundColor: isDark ? "#f5f5f5" : "#1a1a1a",
						transform: "none",
						boxShadow: "none",
					},
					"&:active": {
						transform: "none",
						boxShadow: "none",
					},
				}}
			>
				Sign in with Apple
			</Button>
		</form>
	);
}
