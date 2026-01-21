"use client";

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

	return (
		<fieldset
			className={[
				"inline-flex items-center rounded-xl bg-neutral-100 p-1",
				disabled ? "opacity-60" : "",
				className,
			].join(" ")}
			aria-label="Availability mode"
		>
			<ToggleButton
				isActive={value === "availability"}
				onClick={() => onChange("availability")}
				disabled={disabled}
			>
				{availabilityLabel}
			</ToggleButton>

			<ToggleButton
				isActive={value === "ifNeeded"}
				onClick={() => onChange("ifNeeded")}
				disabled={disabled}
			>
				{ifNeededLabel}
			</ToggleButton>
		</fieldset>
	);
}

type ToggleButtonProps = {
	isActive: boolean;
	onClick: () => void;
	disabled: boolean;
	children: React.ReactNode;
};

function ToggleButton({
	isActive,
	onClick,
	disabled,
	children,
}: ToggleButtonProps) {
	return (
		<button
			type="button"
			onClick={onClick}
			disabled={disabled}
			aria-pressed={isActive}
			className={[
				"min-w-[140px] rounded-lg px-6 py-2 font-medium text-sm transition-colors",
				"focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2",
				isActive
					? "bg-white text-amber-700 ring-1 ring-amber-400"
					: "bg-transparent text-neutral-500 hover:text-neutral-700",
			].join(" ")}
		>
			{children}
		</button>
	);
}
