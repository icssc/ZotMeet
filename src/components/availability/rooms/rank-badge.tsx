"use client";

import { cn } from "@/lib/utils";
import { useRoomFlowColors } from "./use-room-flow-colors";

/** A best time's rank: the same 22px badge in the sidebar and on the heatmap. */
export function RankBadge({
	rank,
	className,
}: {
	rank: number;
	className?: string;
}) {
	const colors = useRoomFlowColors();
	return (
		<span
			aria-hidden="true"
			className={cn(
				"inline-flex size-[22px] shrink-0 items-center justify-center rounded-full font-semibold text-xs leading-none",
				className,
			)}
			style={{ backgroundColor: colors.ring, color: colors.ringText }}
		>
			{rank}
		</span>
	);
}
