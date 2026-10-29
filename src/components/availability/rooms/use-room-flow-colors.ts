"use client";

import { darken, lighten, useTheme } from "@mui/material/styles";
import { useMemo } from "react";

/**
 * Colours the room flow needs that no Tailwind class provides: pink shades
 * derived per mode, and MUI's translucent `divider` / `text.secondary`. For
 * plain or translucent pink, navy or white use `bg-primary`, `bg-primary/15`,
 * `text-secondary-main`, `text-primary-foreground`.
 */
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
			divider,
			textSecondary,
			/** Pink that passes 4.5:1 as text on the surface. */
			pinkText: isDark ? lighten(pink, 0.45) : darken(pink, 0.42),
			/** The best-time rank badge. */
			ring: isDark ? lighten(pink, 0.82) : darken(pink, 0.42),
			ringText: isDark ? navy : white,
		}),
		[isDark, pink, navy, white, divider, textSecondary],
	);
}
