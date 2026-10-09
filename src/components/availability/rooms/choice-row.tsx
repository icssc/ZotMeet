"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useRoomFlowColors } from "./use-room-flow-colors";

export function ChoiceRow({
	name,
	value,
	checked,
	onSelect,
	onPreview,
	dimmed = false,
	children,
	className,
}: {
	name: string;
	value: string;
	checked: boolean;
	onSelect: () => void;
	onPreview?: (active: boolean) => void;
	dimmed?: boolean;
	children: ReactNode;
	className?: string;
}) {
	const colors = useRoomFlowColors();
	return (
		<label
			className={cn(
				"relative flex min-h-11 cursor-pointer items-center gap-3 rounded-[10px] border px-3 py-2 transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2",
				dimmed && !checked && "opacity-60",
				className,
			)}
			style={{
				borderColor: checked ? colors.pink : colors.divider,
				backgroundColor: checked ? colors.pinkSoft : undefined,
				boxShadow: checked ? `inset 0 0 0 1px ${colors.pink}` : undefined,
			}}
			onMouseEnter={() => onPreview?.(true)}
			onMouseLeave={() => onPreview?.(false)}
		>
			<input
				type="radio"
				className="sr-only"
				name={name}
				value={value}
				checked={checked}
				onChange={onSelect}
				onFocus={() => onPreview?.(true)}
				onBlur={() => onPreview?.(false)}
			/>
			{children}
		</label>
	);
}

/** Small rounded pill, e.g. "4/4 free"; pink when `on`. */
export function Pill({ on, children }: { on: boolean; children: ReactNode }) {
	const colors = useRoomFlowColors();
	return (
		<span
			className="inline-flex shrink-0 items-center rounded-2xl px-2 py-0.5 font-semibold text-xs"
			style={
				on
					? { backgroundColor: colors.pink, color: colors.navy }
					: {
							boxShadow: `inset 0 0 0 1px ${colors.divider}`,
							color: colors.textSecondary,
						}
			}
		>
			{children}
		</span>
	);
}
