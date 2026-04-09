import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { IconButton } from "@mui/material";
import { memo } from "react";

interface AvailabilityNavButtonProps {
	direction: "left" | "right";
	disabled: boolean;
	handleClick: VoidFunction;
}

export const AvailabilityNavButton = memo(
	({ direction, disabled, handleClick }: AvailabilityNavButtonProps) => {
		return (
			<IconButton
				onClick={handleClick}
				disabled={disabled}
				size="small"
				sx={{ opacity: disabled ? 0 : 1 }}
			>
				{direction === "left" ? <ChevronLeftIcon /> : <ChevronRightIcon />}
			</IconButton>
		);
	},
);

AvailabilityNavButton.displayName = "AvailabilityNavButton";
