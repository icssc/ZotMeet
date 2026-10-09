"use client";

import { Button, Typography } from "@mui/material";
import {
	type BookableSlot,
	bookableSlots,
	formatClock,
	type RoomFit,
} from "@zotmeet/shared";
import { useMemo } from "react";
import { useRoomFlowStore } from "@/store/useRoomFlowStore";
import { useRoomFlowColors } from "./use-room-flow-colors";

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
	onConfirmBooking,
	isConfirming = false,
	isConfirmed = false,
}: {
	fit: RoomFit;
	timeZone: string;
	/** "I booked it"; hidden when the viewer can't schedule the meeting. */
	onConfirmBooking?: () => void;
	isConfirming?: boolean;
	isConfirmed?: boolean;
}) {
	const colors = useRoomFlowColors();
	const setSelectedSlotStart = useRoomFlowStore((s) => s.setSelectedSlotStart);
	const { slots, slot, freeUntil } = useBookingSlot(fit);

	return (
		<div className="flex flex-col gap-3">
			<Typography variant="h6" component="h3">
				Book it on UCI Libraries
			</Typography>

			<div className="flex flex-col gap-2">
				<Typography
					variant="subtitle2"
					component="p"
					id="room-flow-start-label"
				>
					Start time
				</Typography>
				{slots.length === 0 ? (
					<Typography variant="body2" color="textSecondary">
						The library feed has no bookable slots left for this room.
					</Typography>
				) : (
					<div
						role="radiogroup"
						aria-labelledby="room-flow-start-label"
						className="grid grid-cols-3 gap-2"
					>
						{slots.map((s) => {
							const isOn = s.start === slot?.start;
							return (
								<Button
									key={s.start}
									role="radio"
									aria-checked={isOn}
									variant="outlined"
									color="inherit"
									onClick={() => setSelectedSlotStart(s.start)}
									sx={{
										minHeight: 40,
										borderRadius: "16px",
										textTransform: "none",
										fontWeight: isOn ? 600 : 500,
										borderColor: isOn ? colors.pink : colors.divider,
										backgroundColor: isOn ? colors.pinkSoft : undefined,
									}}
								>
									{formatClock(s.start, timeZone)}
								</Button>
							);
						})}
					</div>
				)}
				<Typography variant="caption" color="textSecondary">
					The library site opens with your start slot selected. Choose the end
					time there
					{freeUntil ? ` (free until ${formatClock(freeUntil, timeZone)})` : ""}
					.
				</Typography>
			</div>

			{onConfirmBooking && (
				<div
					className="flex flex-col items-start gap-2 rounded-xl border p-3"
					style={{ borderColor: colors.divider }}
				>
					<Typography variant="subtitle2" component="p">
						After booking
					</Typography>
					{isConfirmed ? (
						<Typography variant="body2" role="status">
							Saved. {fit.room.label} now shows on the meeting for everyone.
						</Typography>
					) : (
						<>
							<Typography variant="body2" color="textSecondary">
								Come back and confirm so the room shows on the meeting for
								everyone.
							</Typography>
							<Button
								variant="outlined"
								size="small"
								disabled={isConfirming || !slot}
								onClick={onConfirmBooking}
							>
								{isConfirming ? "Saving…" : "I booked it"}
							</Button>
						</>
					)}
				</div>
			)}
		</div>
	);
}
