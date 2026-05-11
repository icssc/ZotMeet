"use client";

import type { DrawerOwnerState, DrawerProps } from "@mui/material/Drawer";
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

function mergePaperSlotProps(
	resolved: unknown,
	extraPaperSx: SxProps<Theme> | undefined,
): Record<string, unknown> & { sx: SxProps<Theme> } {
	const paperRest = stripSxFromPaperSlot(resolved);
	const resolvedSx = paperSlotSx(resolved);
	const sxLayers: SxProps<Theme>[] = [basePaperSx];
	if (resolvedSx != null) sxLayers.push(resolvedSx);
	if (extraPaperSx != null) sxLayers.push(extraPaperSx);
	return {
		...paperRest,
		sx: (sxLayers.length === 1 ? sxLayers[0] : sxLayers) as SxProps<Theme>,
	};
}

export function MuiBottomSheet({
	open,
	onClose,
	children,
	paperSx,
	slotProps,
	...rest
}: MuiBottomSheetProps) {
	const incomingPaper = slotProps?.paper;

	const paperSlot =
		typeof incomingPaper === "function"
			? (ownerState: DrawerOwnerState) =>
					mergePaperSlotProps(incomingPaper(ownerState), paperSx)
			: mergePaperSlotProps(incomingPaper, paperSx);

	return (
		<Drawer
			anchor="bottom"
			open={open}
			onClose={onClose}
			slotProps={{
				...slotProps,
				paper: paperSlot,
			}}
			{...rest}
		>
			{children}
		</Drawer>
	);
}
