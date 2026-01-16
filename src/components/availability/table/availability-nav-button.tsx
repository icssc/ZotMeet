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
				type="button"
				onClick={handleClick}
				className={cn(
					"p-3 pr-0 disabled:opacity-0 md:pr-1",
					direction === "left" && "pl-0 md:pl-1",
					direction === "right" && "pr-0 md:pr-1",
				)}
				disabled={disabled}
			>
				<span className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-gray-300 text-gray-500 text-xl hover:border-gray-400">
					{direction === "left" ? <p> &lsaquo;</p> : <p>&rsaquo;</p>}
				</span>
			</button>
		);
	},
);

AvailabilityNavButton.displayName = "AvailabilityNavButton";
