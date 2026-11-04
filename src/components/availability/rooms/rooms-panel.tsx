"use client";

import { Typography } from "@mui/material";
import { formatShortDayAndWindow } from "@zotmeet/shared";
import { useEffect, useMemo } from "react";
import { useShallow } from "zustand/shallow";
import type { BestTimeRooms, StudyRoomFlow } from "@/hooks/use-study-room-flow";
import { useRoomFlowStore } from "@/store/useRoomFlowStore";
import { RoomStep } from "./room-step";
import { RoomsStepper } from "./rooms-stepper";
import { AvailableCount, StepCard } from "./step-card";
import { TimeStep } from "./time-step";

/** The chosen time on the room and book steps; mirrors the selected `TimeCard`. */
function SelectedTimeCard({
	time,
	timeZone,
	memberCount,
	onBack,
}: {
	time: BestTimeRooms;
	timeZone: string;
	memberCount: number;
	onBack: () => void;
}) {
	return (
		<StepCard direction="back" title="Select Time" onAction={onBack}>
			<Typography variant="body1" component="span" className="truncate">
				{formatShortDayAndWindow(time, timeZone)}
			</Typography>
			<AvailableCount free={time.freeMemberIds.length} total={memberCount} />
		</StepCard>
	);
}

/**
 * "Find a study room": Time → Room → Book. All its state lives in
 * `useRoomFlowStore`, so it survives unmounting.
 */
export function RoomsPanel({
	flow,
	timeZone,
	onShowAttendees,
}: {
	flow: StudyRoomFlow;
	timeZone: string;
	onShowAttendees: () => void;
}) {
	const { step, setStep, selectedTimeId } = useRoomFlowStore(
		useShallow((s) => ({
			step: s.step,
			setStep: s.setStep,
			selectedTimeId: s.selectedTimeId,
		})),
	);

	const time = useMemo(
		() => flow.times.find((t) => t.id === selectedTimeId) ?? null,
		[flow.times, selectedTimeId],
	);
	// Until the time's rooms load, the room step can't tell "none free" from
	// "not fetched", and a failed lookup's Retry lives on the time step.
	const canPickRoom = time?.status === "ready";

	// New availability can remove the chosen time or refetch its rooms; fall
	// back a step rather than show one with nothing in it.
	useEffect(() => {
		if (step > 0 && !canPickRoom) setStep(0);
	}, [step, canPickRoom, setStep]);

	return (
		<div className="flex min-h-0 flex-1 flex-col">
			<div className="flex shrink-0 flex-col gap-3 px-4 pt-4 pb-3">
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
						<SelectedTimeCard
							time={time}
							timeZone={timeZone}
							memberCount={flow.memberCount}
							onBack={() => setStep(0)}
						/>
						<RoomStep time={time} timeZone={timeZone} />
					</>
				)}
			</div>
		</div>
	);
}
