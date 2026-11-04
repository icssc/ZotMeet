"use client";

import { useShallow } from "zustand/shallow";
import type { StudyRoomFlow } from "@/hooks/use-study-room-flow";
import { useRoomFlowStore } from "@/store/useRoomFlowStore";
import { RoomsStepper } from "./rooms-stepper";
import { TimeStep } from "./time-step";

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
	const { step, setStep } = useRoomFlowStore(
		useShallow((s) => ({ step: s.step, setStep: s.setStep })),
	);

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
			</div>
		</div>
	);
}
