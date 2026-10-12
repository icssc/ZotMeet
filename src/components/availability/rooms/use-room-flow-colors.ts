"use client";

import { alpha, darken, lighten, useTheme } from "@mui/material/styles";
import { useMemo } from "react";

export function useRoomFlowColors() {
	const theme = useTheme();
	const isDark = theme.palette.mode === "dark";
	const pink = theme.palette.primary.main;
	const navy = theme.palette.secondary.main;
	const { white } = theme.palette.common;
	const divider = theme.palette.divider;
	const textSecondary = theme.palette.text.secondary;

	return useMemo(
		() => ({
			pink,
			navy,
			divider,
			textSecondary,
			/** Pink that passes 4.5:1 as text on the surface. */
			pinkText: isDark ? lighten(pink, 0.45) : darken(pink, 0.42),
			/** Selected chips, done steps, the empty-state panel. */
			pinkSoft: alpha(pink, isDark ? 0.22 : 0.14),
			/** The best-time rank badge. */
			ring: isDark ? lighten(pink, 0.82) : darken(pink, 0.42),
			ringText: isDark ? navy : white,
		}),
		[isDark, pink, navy, white, divider, textSecondary],
	);
}
