import type React from "react";
import type { PaintMode } from "@/lib/availability/paint-selection";

const SWATCH_DIMENSION_STYLE = {
	width: 20,
	height: 20,
	borderRadius: "50%",
	boxSizing: "border-box" as const,
};

export const PERSONAL_AVAILABILITY_OPTIONS: {
	value: PaintMode;
	label: string;
	icon: React.ReactNode;
}[] = [
	{
		value: "available",
		label: "Available",
		icon: (
			<div
				style={{
					...SWATCH_DIMENSION_STYLE,
					background: "hsl(var(--primary))",
				}}
			/>
		),
	},
	{
		value: "if-needed",
		label: "If Needed",
		icon: (
			<div
				style={{
					...SWATCH_DIMENSION_STYLE,
					border: "2px solid hsl(var(--if-needed))",
					background:
						"repeating-linear-gradient(45deg, hsl(var(--if-needed)) 0px, hsl(var(--if-needed)) 1.5px, transparent 1.5px, transparent 4px)",
				}}
			/>
		),
	},
	{
		value: "unavailable",
		label: "Unavailable",
		icon: (
			<div style={SWATCH_DIMENSION_STYLE} className="border-2 border-gray-medium" />
		),
	},
];
