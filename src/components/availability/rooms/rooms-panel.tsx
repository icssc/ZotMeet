"use client";

import { Button, Typography } from "@mui/material";
import { formatClock, formatDayAndWindow, type RoomFit } from "@zotmeet/shared";
import { type ReactNode, useEffect, useMemo } from "react";
import { useShallow } from "zustand/shallow";
import type { BestTimeRooms, StudyRoomFlow } from "@/hooks/use-study-room-flow";
import { cn } from "@/lib/utils";
import { useRoomFlowStore } from "@/store/useRoomFlowStore";
import { BookStep, useBookingSlot } from "./book-step";
import { Pill } from "./choice-row";
import { RankBadge } from "./rank-badge";
import { RoomStep } from "./room-step";
import { RoomsStepper } from "./rooms-stepper";
import { TimeStep } from "./time-step";
import { useRoomFlowColors } from "./use-room-flow-colors";

export interface RoomBookingProps {
	onConfirmBooking?: (booking: {
		time: BestTimeRooms;
		fit: RoomFit;
		slotStart: number;
	}) => void;
	isConfirming?: boolean;
	isConfirmed?: boolean;
}

function SummaryRow({
	children,
	onChange,
	label,
}: {
	children: ReactNode;
	onChange: () => void;
	label: string;
}) {
	const colors = useRoomFlowColors();
	return (
		<div
			className="flex min-h-11 items-center gap-2 rounded-[10px] border px-3 py-1.5"
			style={{ borderColor: colors.divider }}
		>
			<div className="flex min-w-0 flex-1 flex-wrap items-center gap-x-2 gap-y-1">
				{children}
			</div>
			<Button
				variant="text"
				size="small"
				onClick={onChange}
				aria-label={`Change ${label}`}
				sx={{ color: colors.pinkText, minWidth: 0 }}
			>
				Change
			</Button>
		</div>
	);
}

/**
 * "Find a study room": Time → Room → Book, with a sticky Back / Next footer.
 * The same panel fills the sidebar's Rooms tab and the phone's bottom sheet;
 * all its state lives in `useRoomFlowStore`, so either can unmount it.
 */
export function RoomsPanel({
	flow,
	timeZone,
	onShowAttendees,
	booking = {},
	className,
	header,
}: {
	flow: StudyRoomFlow;
	timeZone: string;
	onShowAttendees: () => void;
	booking?: RoomBookingProps;
	className?: string;
	/** Replaces the default "Find a study room" heading (the sheet has a close button). */
	header?: ReactNode;
}) {
	const colors = useRoomFlowColors();
	const { step, setStep, selectedTimeId, selectedRoomKey } = useRoomFlowStore(
		useShallow((s) => ({
			step: s.step,
			setStep: s.setStep,
			selectedTimeId: s.selectedTimeId,
			selectedRoomKey: s.selectedRoomKey,
		})),
	);

	const time = useMemo(
		() => flow.times.find((t) => t.id === selectedTimeId) ?? null,
		[flow.times, selectedTimeId],
	);
	const fit = useMemo(
		() =>
			time
				? ([...time.whole, ...time.partial].find(
						(f) => f.room.key === selectedRoomKey,
					) ?? null)
				: null,
		[time, selectedRoomKey],
	);
	const { slot } = useBookingSlot(fit);

	// New availability can remove the chosen time or room; fall back a step
	// rather than show a step with nothing in it.
	useEffect(() => {
		if (step > 0 && !time) setStep(0);
		else if (step > 1 && !fit && time?.status === "ready") setStep(1);
	}, [step, time, fit, setStep]);

	const primarySx = { color: colors.navy, borderRadius: "10px" } as const;

	const timeSummary = time && (
		<SummaryRow label="time" onChange={() => setStep(0)}>
			<RankBadge rank={time.rank} />
			<Typography variant="body2" sx={{ fontWeight: 600 }}>
				{formatDayAndWindow(time, timeZone)}
			</Typography>
			<Pill on={time.freeMemberIds.length === flow.memberCount}>
				{time.freeMemberIds.length}/{flow.memberCount} free
			</Pill>
		</SummaryRow>
	);

	return (
		<div className={cn("flex min-h-0 flex-1 flex-col", className)}>
			<div className="flex shrink-0 flex-col gap-3 px-4 pt-4 pb-3">
				{header ?? (
					<Typography variant="h6" component="h2">
						Find a study room
					</Typography>
				)}
				<RoomsStepper step={step} onStepClick={(next) => setStep(next)} />
			</div>

			<div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto overscroll-y-contain px-4 pb-4">
				{step === 0 && (
					<TimeStep
						flow={flow}
						timeZone={timeZone}
						onShowAttendees={onShowAttendees}
					/>
				)}
				{step === 1 && time && (
					<>
						{timeSummary}
						<RoomStep time={time} timeZone={timeZone} />
					</>
				)}
				{step === 2 && time && fit && (
					<>
						{timeSummary}
						<SummaryRow label="room" onChange={() => setStep(1)}>
							<Typography variant="body2" sx={{ fontWeight: 600 }}>
								{fit.room.label}
							</Typography>
							<Typography variant="caption" color="textSecondary">
								{fit.room.location}
							</Typography>
						</SummaryRow>
						<BookStep
							fit={fit}
							timeZone={timeZone}
							onConfirmBooking={
								booking.onConfirmBooking && slot
									? () =>
											booking.onConfirmBooking?.({
												time,
												fit,
												slotStart: slot.start,
											})
									: undefined
							}
							isConfirming={booking.isConfirming}
							isConfirmed={booking.isConfirmed}
						/>
					</>
				)}
			</div>

			<div
				className="flex shrink-0 items-center gap-2 border-t px-4 py-3"
				style={{ borderColor: colors.divider }}
			>
				{step > 0 && (
					<Button
						variant="outlined"
						color="inherit"
						onClick={() => setStep((step - 1) as 0 | 1)}
						sx={{ borderRadius: "10px" }}
					>
						Back
					</Button>
				)}
				<div className="ml-auto min-w-0">
					{step === 0 && (
						<Button
							variant="contained"
							disabled={!time}
							onClick={() => setStep(1)}
							sx={primarySx}
						>
							Next: pick a room
						</Button>
					)}
					{step === 1 && (
						<Button
							variant="contained"
							disabled={!fit}
							onClick={() => setStep(2)}
							sx={primarySx}
						>
							<span className="truncate">
								{fit ? `Next: book ${fit.room.label}` : "Next: book"}
							</span>
						</Button>
					)}
					{step === 2 && (
						<Button
							variant="contained"
							disabled={!slot}
							href={slot?.url ?? ""}
							target="_blank"
							rel="noopener noreferrer"
							sx={primarySx}
						>
							<span className="truncate">
								{slot
									? `Book ${formatClock(slot.start, timeZone)} on UCI Libraries ↗`
									: "Book on UCI Libraries ↗"}
							</span>
						</Button>
					)}
				</div>
			</div>
		</div>
	);
}
