"use client";

import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import PersonIcon from "@mui/icons-material/Person";
import RemoveIcon from "@mui/icons-material/Remove";
import {
	Box,
	Chip,
	IconButton,
	Menu,
	MenuItem,
	Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { type MouseEvent, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * "Seats" as a −/+ stepper in a chip-height pill. Unset, it shows the attendee
 * count faded and filters nothing; the first press sets a minimum, × clears it.
 */
export function SeatsStepper({
	value,
	attendees,
	max,
	onChange,
}: {
	value: number | null;
	attendees: number;
	/** The roomiest room; past it nothing would match. */
	max: number;
	onChange: (value: number | null) => void;
}) {
	const isOn = value != null;
	const shown = value ?? attendees;
	// MUI sets IconButton's padding, so a class can't shrink it to fit the pill.
	const buttonSx = { p: "2px", color: "inherit" } as const;

	return (
		<Typography
			variant="body2"
			component="span"
			role="group"
			aria-label="Minimum seats"
			className={cn(
				"inline-flex h-6 items-center rounded-2xl border px-px",
				isOn && "border-primary bg-primary/15 dark:bg-primary/20",
			)}
			sx={isOn ? undefined : { borderColor: "divider" }}
		>
			<IconButton
				size="small"
				aria-label="Fewer seats"
				disabled={shown <= 1}
				onClick={() => onChange(Math.max(1, shown - 1))}
				sx={buttonSx}
			>
				<RemoveIcon sx={{ fontSize: 16 }} />
			</IconButton>
			<Box
				component="span"
				className={cn(
					"flex min-w-16 items-center justify-center gap-1 px-1 tabular-nums",
					isOn && "font-semibold",
				)}
				sx={isOn ? undefined : { color: "text.secondary" }}
				aria-live="polite"
			>
				<PersonIcon sx={{ fontSize: 16 }} />
				{shown} {shown === 1 ? "seat" : "seats"}
			</Box>
			<IconButton
				size="small"
				aria-label="More seats"
				disabled={shown >= max}
				onClick={() => onChange(Math.min(max, shown + 1))}
				sx={buttonSx}
			>
				<AddIcon sx={{ fontSize: 16 }} />
			</IconButton>
			{isOn && (
				<IconButton
					size="small"
					aria-label="Clear seats"
					onClick={() => onChange(null)}
					sx={buttonSx}
				>
					<CloseIcon sx={{ fontSize: 16 }} />
				</IconButton>
			)}
		</Typography>
	);
}

export function FilterChip<T extends string | number>({
	label,
	activeLabel,
	value,
	options,
	getOptionLabel,
	onChange,
}: {
	label: string;
	activeLabel: (value: T) => string;
	value: T | null;
	options: readonly T[];
	getOptionLabel: (value: T) => string;
	onChange: (value: T | null) => void;
}) {
	const [anchor, setAnchor] = useState<HTMLElement | null>(null);
	const isOn = value != null;
	return (
		<>
			<Chip
				size="small"
				variant="outlined"
				clickable
				label={isOn ? activeLabel(value) : `${label} ▾`}
				onClick={(e: MouseEvent<HTMLElement>) => setAnchor(e.currentTarget)}
				onDelete={isOn ? () => onChange(null) : undefined}
				deleteIcon={
					isOn ? <CloseIcon aria-label={`Clear ${label}`} /> : undefined
				}
				aria-haspopup="menu"
				sx={
					isOn
						? {
								backgroundColor: (theme) =>
									alpha(
										theme.palette.primary.main,
										theme.palette.mode === "dark" ? 0.2 : 0.15,
									),
								borderColor: "primary.main",
								fontWeight: 600,
							}
						: undefined
				}
			/>
			<Menu
				anchorEl={anchor}
				open={Boolean(anchor)}
				onClose={() => setAnchor(null)}
			>
				{options.map((option) => (
					<MenuItem
						key={String(option)}
						selected={option === value}
						onClick={() => {
							onChange(option);
							setAnchor(null);
						}}
					>
						{getOptionLabel(option)}
					</MenuItem>
				))}
			</Menu>
		</>
	);
}
