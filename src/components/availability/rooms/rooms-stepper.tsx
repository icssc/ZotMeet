"use client";

import Step from "@mui/material/Step";
import StepButton from "@mui/material/StepButton";
import Stepper from "@mui/material/Stepper";
import type { RoomFlowStep } from "@/store/useRoomFlowStore";

const STEPS = ["Time", "Room", "Book"] as const;

export function RoomsStepper({
	step,
	onStepClick,
}: {
	step: RoomFlowStep;
	onStepClick: (step: RoomFlowStep) => void;
}) {
	return (
		<Stepper activeStep={step} nonLinear aria-label="Steps">
			{STEPS.map((label, index) => (
				<Step key={label} completed={index < step}>
					<StepButton
						disabled={index >= step}
						onClick={() => onStepClick(index as RoomFlowStep)}
					>
						{label}
					</StepButton>
				</Step>
			))}
		</Stepper>
	);
}
