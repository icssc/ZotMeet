"use client";

import { createContext, type ReactNode, useContext, useId } from "react";
import { cn } from "@/lib/utils";
import { useRoomFlowColors } from "./use-room-flow-colors";

const ChoiceGroupName = createContext("");

/**
 * A radio group of `ChoiceRow`s. Each group gets its own input `name`: the
 * panel renders twice on phones (the hidden sidebar and the sheet), and
 * same-named radios outside a form are one group across the whole page.
 */
export function ChoiceGroup({
	label,
	className,
	children,
}: {
	label: string;
	className?: string;
	children: ReactNode;
}) {
	const name = useId();
	return (
		<div role="radiogroup" aria-label={label} className={className}>
			<ChoiceGroupName.Provider value={name}>
				{children}
			</ChoiceGroupName.Provider>
		</div>
	);
}

export function ChoiceRow({
	value,
	checked,
	onSelect,
	dimmed = false,
	children,
	className,
}: {
	value: string;
	checked: boolean;
	onSelect: () => void;
	dimmed?: boolean;
	children: ReactNode;
	className?: string;
}) {
	const colors = useRoomFlowColors();
	const name = useContext(ChoiceGroupName);
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
		>
			<input
				type="radio"
				className="sr-only"
				name={name}
				value={value}
				checked={checked}
				onChange={onSelect}
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
