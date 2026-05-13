"use client";

import { ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { PERSONAL_AVAILABILITY_OPTIONS } from "@/components/nav/personal-availability-options";
import type { PaintMode } from "@/lib/availability/paint-selection";
import { useAvailabilityStore } from "@/store/useAvailabilityStore";

export type PersonalPaintModeToggleDensity = "compact" | "comfortable";

export function PersonalPaintModeToggle({
	density,
	fullWidth = true,
}: {
	density: PersonalPaintModeToggleDensity;
	fullWidth?: boolean;
}) {
	const paintMode = useAvailabilityStore((s) => s.paintMode);
	const setPaintMode = useAvailabilityStore((s) => s.setPaintMode);

	return (
		<ToggleButtonGroup
			exclusive
			fullWidth={fullWidth}
			value={paintMode}
			onChange={(_, val: PaintMode | null) => val && setPaintMode(val)}
			aria-label="availability"
		>
			{PERSONAL_AVAILABILITY_OPTIONS.map(({ value, label, icon }) => (
				<ToggleButton
					key={value}
					value={value}
					aria-label={label}
					sx={(theme) =>
						density === "compact"
							? {
									flex: 1,
									minWidth: 0,
									minHeight: 0,
									textTransform: "none",
									display: "flex",
									flexDirection: "column",
									alignItems: "center",
									justifyContent: "center",
									gap: theme.spacing(0.5),
									paddingBlock: theme.spacing(2),
									paddingInline: theme.spacing(2),
									"&.Mui-selected": {
										backgroundColor: alpha(
											theme.palette.primary.main,
											theme.palette.mode === "dark" ? 0.2 : 0.12,
										),
										borderColor: theme.palette.primary.main,
									},
								}
							: {
									display: "flex",
									flexDirection: "column",
									gap: 1,
									px: 2,
									py: 1.5,
									"&.Mui-selected": {
										backgroundColor: alpha(
											theme.palette.primary.main,
											theme.palette.mode === "dark" ? 0.2 : 0.12,
										),
										borderColor: theme.palette.primary.main,
									},
								}
					}
				>
					{icon}
					{density === "compact" ? (
						<Typography
							variant="caption"
							sx={{ display: "block", textAlign: "center" }}
						>
							{label}
						</Typography>
					) : (
						<Typography variant="caption">{label}</Typography>
					)}
				</ToggleButton>
			))}
		</ToggleButtonGroup>
	);
}
