"use client";

import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import type * as React from "react";
import type { AvailabilityType } from "@/lib/zotdate";

type AvailabilityModeToggleProps = {
	value: AvailabilityType;
	onChange: (next: AvailabilityType) => void;
	disabled?: boolean;
	className?: string;
	labels?: {
		availability?: string;
		ifNeeded?: string;
	};
};

export function AvailabilityModeToggle({
	value,
	onChange,
	disabled = false,
	className = "",
	labels,
}: AvailabilityModeToggleProps) {
	const availabilityLabel = labels?.availability ?? "Available";
	const ifNeededLabel = labels?.ifNeeded ?? "If needed";

	const handleChange = (
		_event: React.MouseEvent<HTMLElement>,
		next: AvailabilityType | null,
	) => {
		if (!next) return;
		onChange(next);
	};

	return (
		<div className={className} style={{ display: "inline-flex" }}>
			<ToggleButtonGroup
				value={value}
				exclusive
				onChange={handleChange}
				disabled={disabled}
				aria-label="Availability mode"
				sx={{
					// Outer pill container
					display: "inline-flex",
					alignItems: "center",
					justifyContent: "center",
					p: "4px",
					borderRadius: "16px",
					backgroundColor: "rgb(245 245 245)",
					overflow: "hidden",

					// Remove MUI default group borders
					"& .MuiToggleButtonGroup-grouped": {
						margin: 0,
						border: 0,
						borderRadius: "12px !important",
					},

					// Make both buttons same size so the pill doesn't look off-center
					width: 360, // adjust if you want it wider/narrower
					"& .MuiToggleButton-root": {
						flex: 1,
						textTransform: "none",
						fontWeight: 500,
						fontSize: "1rem",
						py: 1.25,
					},
				}}
			>
				<ToggleButton
					value="availability"
					aria-label="Available"
					sx={{
						color: "rgb(82 82 82)",
						"&.Mui-selected": {
							backgroundColor: "#fff",
							color: "#b45309",
							boxShadow: "0 0 0 1px rgba(251, 191, 36, 0.8) inset",
						},
						"&.Mui-selected:hover": {
							backgroundColor: "#fff",
						},
					}}
				>
					{availabilityLabel}
				</ToggleButton>

				<ToggleButton
					value="ifNeeded"
					aria-label="If needed"
					sx={{
						color: "rgb(82 82 82)",
						"&.Mui-selected": {
							backgroundColor: "#fff",
							color: "#b45309",
							boxShadow: "0 0 0 1px rgba(251, 191, 36, 0.8) inset",
						},
						"&.Mui-selected:hover": {
							backgroundColor: "#fff",
						},
					}}
				>
					{ifNeededLabel}
				</ToggleButton>
			</ToggleButtonGroup>
		</div>
	);
}
