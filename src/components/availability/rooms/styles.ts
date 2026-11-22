import type { Theme } from "@mui/material";
import { darken, lighten } from "@mui/material/styles";

/** Pink that passes 4.5:1 as text on the surface; no theme token for it. */
export const pinkText = {
	color: (t: Theme) =>
		t.palette.mode === "dark"
			? lighten(t.palette.primary.main, 0.45)
			: darken(t.palette.primary.main, 0.42),
};
