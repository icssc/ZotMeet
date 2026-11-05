"use client";

import CheckIcon from "@mui/icons-material/Check";
import Box from "@mui/material/Box";
import { Fragment } from "react";
import { cn } from "@/lib/utils";
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
		<ol className="flex items-center gap-2" aria-label="Steps">
			{STEPS.map((label, index) => {
				const state =
					index < step ? "done" : index === step ? "active" : "upcoming";
				const circle = (
					<Box
						component="span"
						className={cn(
							"inline-flex size-6 shrink-0 items-center justify-center rounded-full border font-semibold text-xs",
							state !== "upcoming" &&
								"border-primary bg-primary text-primary-foreground",
						)}
						sx={
							state === "upcoming"
								? { borderColor: "divider", color: "text.secondary" }
								: undefined
						}
					>
						{state === "done" ? (
							<CheckIcon fontSize="inherit" sx={{ color: "inherit" }} />
						) : (
							index + 1
						)}
					</Box>
				);
				const text = (
					<Box
						component="span"
						className="font-medium text-sm"
						sx={state === "upcoming" ? { color: "text.secondary" } : undefined}
					>
						{label}
					</Box>
				);

				return (
					<Fragment key={label}>
						{index > 0 && (
							<Box
								component="li"
								aria-hidden="true"
								className="h-px min-w-3 flex-1"
								sx={{ bgcolor: "divider" }}
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
