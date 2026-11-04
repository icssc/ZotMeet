"use client";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import PeopleIcon from "@mui/icons-material/People";
import { Typography } from "@mui/material";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useRoomFlowColors } from "./use-room-flow-colors";

// The action panel sits behind the card and peeks out on one side; its inner
// padding on the card's side covers the overlap so the text stays visible.
const DIRECTIONS = {
	next: {
		prefix: "Next:",
		Icon: ArrowForwardIcon,
		panel: "right-0 w-32 bg-primary pr-3 pl-10 text-primary-foreground",
		title: "",
		card: "px-4",
		offset: "mr-24",
	},
	back: {
		prefix: "Back:",
		Icon: ArrowBackIcon,
		panel:
			"left-0 w-36 bg-secondary-main py-2 pr-9 pl-3 text-secondary-main-foreground",
		title: "whitespace-nowrap",
		card: "px-3",
		offset: "ml-28",
	},
} as const;

/**
 * A card with a "Next:"/"Back:" panel tucked behind it: step 1's selected time
 * moves forward, step 2's chosen time moves back.
 */
export function StepCard({
	direction,
	title,
	onAction,
	actionDisabled,
	showAction = true,
	as: Card = "div",
	className,
	children,
}: {
	direction: keyof typeof DIRECTIONS;
	/** What the action goes to, e.g. "Choose the Room". */
	title: string;
	onAction: () => void;
	actionDisabled?: boolean;
	/** Hide the panel and let the card take the full width. */
	showAction?: boolean;
	/** `label` when the card wraps a radio input. */
	as?: "div" | "label";
	className?: string;
	children: ReactNode;
}) {
	const colors = useRoomFlowColors();
	const { prefix, Icon, ...style } = DIRECTIONS[direction];

	return (
		<div className="relative flex">
			<button
				type="button"
				onClick={onAction}
				disabled={actionDisabled}
				className={cn(
					"absolute inset-y-0 flex flex-col items-start justify-center rounded-[10px] text-left transition-[visibility] duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-60",
					style.panel,
					!showAction && "invisible",
				)}
			>
				<span className="font-semibold text-xs leading-tight">{prefix}</span>
				<span
					className={cn("font-semibold text-sm leading-tight", style.title)}
				>
					{title}
				</span>
				<span className="mt-1 flex justify-center self-stretch">
					<Icon fontSize="small" sx={{ color: "inherit" }} />
				</span>
			</button>
			<Card
				className={cn(
					"relative z-10 flex min-w-0 flex-1 flex-col gap-1.5 rounded-[10px] border bg-paper py-3 transition-[margin] duration-200",
					style.card,
					showAction && style.offset,
					className,
				)}
				style={{ borderColor: colors.divider }}
			>
				{children}
			</Card>
		</div>
	);
}

/** "6/8 Available" with the people icon, as both time cards show it. */
export function AvailableCount({
	free,
	total,
}: {
	free: number;
	total: number;
}) {
	return (
		<Typography
			variant="caption"
			color="textSecondary"
			className="flex min-w-0 items-center gap-1.5"
		>
			<PeopleIcon fontSize="small" className="shrink-0" />
			<span className="truncate">
				{free}/{total} Available
			</span>
		</Typography>
	);
}
