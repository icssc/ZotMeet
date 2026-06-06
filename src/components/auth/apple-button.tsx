"use client";

import AppleIcon from "@mui/icons-material/Apple";
import { Button, useTheme } from "@mui/material";
import { oauthLoginPath } from "@/lib/auth/return-to";

type AppleButtonProps = {
	returnTo?: string | null;
};

export function AppleButton({ returnTo }: AppleButtonProps = {}) {
	const theme = useTheme();
	const isDark = theme.palette.mode === "dark";

	return (
		<Button
			component="a"
			href={oauthLoginPath("apple", returnTo)}
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
			Continue with Apple
		</Button>
	);
}
