"use client";

import { alpha, darken, lighten, useTheme } from "@mui/material/styles";
import { useMemo } from "react";

export function useRoomFlowColors() {
	const theme = useTheme();
	const isDark = theme.palette.mode === "dark";
	const pink = theme.palette.primary.main;
	const navy = theme.palette.secondary.main;
	const surface = theme.palette.background.paper;
	const { white, black } = theme.palette.common;
	const divider = theme.palette.divider;
	const textSecondary = theme.palette.text.secondary;

	return useMemo(
		() => ({
			pink,
			navy,
			surface,
			divider,
			textSecondary,
			/** Pink that passes 4.5:1 as text on the surface. */
			pinkText: isDark ? lighten(pink, 0.45) : darken(pink, 0.42),
			/** Selected chips, done steps, the empty-state panel. */
			pinkSoft: alpha(pink, isDark ? 0.22 : 0.14),
			/** Best-time ring and its rank badge. */
			ring: isDark ? lighten(pink, 0.82) : darken(pink, 0.42),
			ringText: isDark ? navy : white,
			/** Room preview on the heatmap: dashed outline, hatch, dark label. */
			previewBorder: isDark ? lighten(navy, 0.62) : navy,
			previewText: isDark ? lighten(navy, 0.86) : navy,
			previewHatch: isDark
				? `repeating-linear-gradient(135deg, ${alpha(black, 0.68)} 0 6px, ${alpha(black, 0.93)} 6px 12px)`
				: `repeating-linear-gradient(135deg, ${alpha(white, 0.74)} 0 6px, ${alpha(white, 0.96)} 6px 12px)`,
		}),
		[isDark, pink, navy, surface, white, black, divider, textSecondary],
	);
}

export type RoomFlowColors = ReturnType<typeof useRoomFlowColors>;
