"use client";

import CheckIcon from "@mui/icons-material/Check";
import { Fragment } from "react";
import { cn } from "@/lib/utils";
import type { RoomFlowStep } from "@/store/useRoomFlowStore";
import { useRoomFlowColors } from "./use-room-flow-colors";

const STEPS = ["Time", "Room", "Book"] as const;

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
						className={cn(
							"inline-flex size-6 shrink-0 items-center justify-center rounded-full border font-semibold text-xs",
							state !== "upcoming" &&
								"border-primary bg-primary text-primary-foreground",
						)}
						style={
							state === "upcoming"
								? {
										borderColor: colors.divider,
										color: colors.textSecondary,
									}
								: undefined
						}
					>
						{state === "done" ? <CheckIcon fontSize="inherit" /> : index + 1}
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
