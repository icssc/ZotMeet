import { memo } from "react";
import { cn } from "@/lib/utils";

interface AvailabilityNavButtonProps {
	direction: "left" | "right";
	disabled: boolean;
	handleClick: VoidFunction;
}

export const AvailabilityNavButton = memo(
	({ direction, disabled, handleClick }: AvailabilityNavButtonProps) => {
		return (
			<button
				onClick={handleClick}
				className={cn(
					"p-3 pr-0 disabled:opacity-0 md:pr-1",
					direction === "left" && "pl-0 md:pl-1",
					direction === "right" && "pr-0 md:pr-1",
				)}
				disabled={disabled}
			>
				<span className="text-3xl text-gray-500">
					{direction === "left" ? <p> &lsaquo;</p> : <p>&rsaquo;</p>}
				</span>
			</button>
		);
	},
);

AvailabilityNavButton.displayName = "AvailabilityNavButton";
