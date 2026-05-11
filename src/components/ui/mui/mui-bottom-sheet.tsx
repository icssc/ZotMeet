"use client";

import type { DrawerProps } from "@mui/material/Drawer";
import Drawer from "@mui/material/Drawer";
import type { SxProps, Theme } from "@mui/material/styles";
import type { ReactNode } from "react";

const basePaperSx: SxProps<Theme> = {
	borderTopLeftRadius: 12,
	borderTopRightRadius: 12,
	maxHeight: "85dvh",
	overflow: "auto",
};

export type MuiBottomSheetProps = Omit<
	DrawerProps,
	"anchor" | "children" | "open" | "onClose"
> & {
	open: boolean;
	onClose: NonNullable<DrawerProps["onClose"]>;
	children: ReactNode;
	/** Applied after base sheet styles; later entries win for the same keys. */
	paperSx?: SxProps<Theme>;
};

function stripSxFromPaperSlot(paper: unknown): Record<string, unknown> {
	if (!paper || typeof paper !== "object" || Array.isArray(paper)) {
		return {};
	}
	return Object.fromEntries(
		Object.entries(paper as Record<string, unknown>).filter(
			([k]) => k !== "sx",
		),
	);
}

function paperSlotSx(paper: unknown): SxProps<Theme> | undefined {
	if (!paper || typeof paper !== "object" || Array.isArray(paper)) {
		return undefined;
	}
	return "sx" in paper ? (paper as { sx?: SxProps<Theme> }).sx : undefined;
}

/**
 * Opinionated MUI bottom {@link Drawer} for modal sheets (rounded top,
 * max height, scroll). Pass `paperSx` to override padding or corner radius.
 */
export function MuiBottomSheet({
	open,
	onClose,
	children,
	paperSx,
	slotProps,
	...rest
}: MuiBottomSheetProps) {
	const incomingPaper = slotProps?.paper;
	const paperRest = stripSxFromPaperSlot(incomingPaper);
	const incomingSx = paperSlotSx(incomingPaper);

	return (
		<Drawer
			anchor="bottom"
			open={open}
			onClose={onClose}
			slotProps={{
				...slotProps,
				paper: {
					...paperRest,
					sx: [basePaperSx, incomingSx, paperSx].filter(
						Boolean,
					) as SxProps<Theme>,
				},
			}}
			{...rest}
		>
			{children}
		</Drawer>
	);
}
