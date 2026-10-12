"use client";

import { Typography } from "@mui/material";
import {
	type BookableSlot,
	bookableSlots,
	formatClock,
	type RoomFit,
} from "@zotmeet/shared";
import { useMemo } from "react";
import { cn } from "@/lib/utils";
import { useRoomFlowStore } from "@/store/useRoomFlowStore";
import { ChoiceGroup, ChoiceRow } from "./choice-row";

/** The slots a booking can start on, and the one picked (the first by default). */
export function useBookingSlot(fit: RoomFit | null): {
	slots: BookableSlot[];
	slot: BookableSlot | null;
	/** When the room stops being free after the picked slot. */
	freeUntil: number | null;
} {
	const selectedSlotStart = useRoomFlowStore((s) => s.selectedSlotStart);
	return useMemo(() => {
		if (!fit) return { slots: [], slot: null, freeUntil: null };
		const slots = bookableSlots(fit.room, fit.window);
		const slot =
			slots.find((s) => s.start === selectedSlotStart) ?? slots[0] ?? null;
		const freeUntil = slot
			? (fit.room.freeWindows.find(
					(w) => w.start <= slot.start && slot.start < w.end,
				)?.end ?? null)
			: null;
		return { slots, slot, freeUntil };
	}, [fit, selectedSlotStart]);
}

/** Step 3: pick a start slot; the footer opens the library's page for it. */
export function BookStep({
	fit,
	timeZone,
}: {
	fit: RoomFit;
	timeZone: string;
}) {
	const setSelectedSlotStart = useRoomFlowStore((s) => s.setSelectedSlotStart);
	const { slots, slot, freeUntil } = useBookingSlot(fit);

	return (
		<div className="flex flex-col gap-3">
			<Typography variant="h6" component="h3">
				Book it on UCI Libraries
			</Typography>

			<div className="flex flex-col gap-2">
				<Typography variant="subtitle2" component="p">
					Start time
				</Typography>
				{slots.length === 0 ? (
					<Typography variant="body2" color="textSecondary">
						The library feed has no bookable slots left for this room.
					</Typography>
				) : (
					<ChoiceGroup label="Start time" className="grid grid-cols-3 gap-2">
						{slots.map((s) => {
							const isOn = s.start === slot?.start;
							return (
								<ChoiceRow
									key={s.start}
									value={String(s.start)}
									checked={isOn}
									onSelect={() => setSelectedSlotStart(s.start)}
									className="min-h-10 justify-center rounded-2xl px-2 py-1"
								>
									<span
										className={cn(
											"text-sm",
											isOn ? "font-semibold" : "font-medium",
										)}
									>
										{formatClock(s.start, timeZone)}
									</span>
								</ChoiceRow>
							);
						})}
					</ChoiceGroup>
				)}
				<Typography variant="caption" color="textSecondary">
					The library site opens with your start slot selected. Choose the end
					time there
					{freeUntil ? ` (free until ${formatClock(freeUntil, timeZone)})` : ""}
					.
				</Typography>
			</div>
		</div>
	);
}
