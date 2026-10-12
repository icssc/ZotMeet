"use client";

import { Fragment } from "react";
import type { RoomFlowStep } from "@/store/useRoomFlowStore";
import { useRoomFlowColors } from "./use-room-flow-colors";

const STEPS = ["Time", "Room", "Book"] as const;

/**
 * 1 Time → 2 Room → 3 Book. Active is pink with a navy number, done is soft
 * pink and clickable to go back, upcoming is outlined and muted. Hand-rolled
 * rather than MUI `Stepper`, whose connector and icon slots fight this shape.
 */
export function RoomsStepper({
	step,
	onStepClick,
}: {
	step: RoomFlowStep;
	onStepClick: (step: RoomFlowStep) => void;
}) {
	const colors = useRoomFlowColors();

	return (
		<ol className="flex items-center gap-2" aria-label="Steps">
			{STEPS.map((label, index) => {
				const state =
					index < step ? "done" : index === step ? "active" : "upcoming";
				const circle = (
					<span
						className="inline-flex size-6 shrink-0 items-center justify-center rounded-full border font-semibold text-xs"
						style={
							state === "active"
								? {
										backgroundColor: colors.pink,
										borderColor: colors.pink,
										color: colors.navy,
									}
								: state === "done"
									? {
											backgroundColor: colors.pinkSoft,
											borderColor: "transparent",
											color: colors.pinkText,
										}
									: {
											borderColor: colors.divider,
											color: colors.textSecondary,
										}
						}
					>
						{index + 1}
					</span>
				);
				const text = (
					<span
						className="font-medium text-sm"
						style={
							state === "upcoming" ? { color: colors.textSecondary } : undefined
						}
					>
						{label}
					</span>
				);

				return (
					<Fragment key={label}>
						{index > 0 && (
							<li
								aria-hidden="true"
								className="h-px min-w-3 flex-1"
								style={{ backgroundColor: colors.divider }}
							/>
						)}
						<li
							className="flex items-center"
							aria-current={state === "active" ? "step" : undefined}
						>
							{state === "done" ? (
								<button
									type="button"
									className="flex items-center gap-1.5 rounded-full pr-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
									onClick={() => onStepClick(index as RoomFlowStep)}
									aria-label={`Back to step ${index + 1}: ${label}`}
								>
									{circle}
									{text}
								</button>
							) : (
								<span className="flex items-center gap-1.5">
									{circle}
									{text}
								</span>
							)}
						</li>
					</Fragment>
				);
			})}
		</ol>
	);
}
