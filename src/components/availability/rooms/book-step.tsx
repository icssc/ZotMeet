"use client";

import { Chip, Typography } from "@mui/material";
import {
	bookingUrlFor,
	formatClock,
	type RoomFit,
	slotsNearStart,
} from "@zotmeet/shared";
import { useMemo } from "react";
import { useShallow } from "zustand/shallow";
import { useRoomFlowStore } from "@/store/useRoomFlowStore";
import { useRoomFlowColors } from "./use-room-flow-colors";

/** Step 3: start times near the best time; each opens the library with it selected. */
export function BookStep({
	fit,
	timeZone,
}: {
	fit: RoomFit;
	timeZone: string;
}) {
	const colors = useRoomFlowColors();
	const { selectedSlotStart, setSelectedSlotStart } = useRoomFlowStore(
		useShallow((s) => ({
			selectedSlotStart: s.selectedSlotStart,
			setSelectedSlotStart: s.setSelectedSlotStart,
		})),
	);
	const { window: stretch } = fit;
	const slots = useMemo(
		() => slotsNearStart(fit.room, stretch.start),
		[fit.room, stretch.start],
	);
	// The last one opened, else the first at or after the best time's start.
	const highlighted =
		selectedSlotStart ??
		(slots.find((s) => s.start >= stretch.start) ?? slots[0])?.start;

	return (
		<div className="flex flex-col gap-3 pt-4">
			<div className="flex flex-col">
				<Typography variant="h6" component="h3">
					When will you book?
				</Typography>
				<Typography variant="caption" color="textSecondary">
					The library site opens with your start slot selected. The max hours
					you can book will vary per room.
				</Typography>
			</div>

			<div
				className="flex flex-col gap-3 rounded-[10px] border p-4"
				style={{ borderColor: colors.divider }}
			>
				<Typography variant="subtitle1" component="p">
					Start Time
				</Typography>
				{slots.length === 0 ? (
					<Typography variant="body2" color="textSecondary">
						No bookable start times near this time for this room.
					</Typography>
				) : (
					<div className="flex flex-wrap gap-2">
						{slots.map((s) => {
							const isOn = s.start === highlighted;
							return (
								<Chip
									key={s.start}
									component="a"
									href={bookingUrlFor(
										s,
										Math.max(0, (stretch.end - s.start) / 60_000),
									)}
									target="_blank"
									rel="noopener noreferrer"
									clickable
									label={formatClock(s.start, timeZone)}
									aria-label={`Book from ${formatClock(s.start, timeZone)} on UCI Libraries (opens in a new tab)`}
									color={isOn ? "primary" : "default"}
									onClick={() => setSelectedSlotStart(s.start)}
								/>
							);
						})}
					</div>
				)}
			</div>
		</div>
	);
}
