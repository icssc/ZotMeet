import type { ReactNode } from "react";
import type { Availability } from "@/components/availability/availability";

export type AvailabilityOption = {
	value: Availability;
	label: string;
	icon: ReactNode;
};

export const PERSONAL_AVAILABILITY_OPTIONS: AvailabilityOption[] = [
	{
		value: "available",
		label: "Available",
		icon: (
			<div
				style={{
					width: 20,
					height: 20,
					borderRadius: "50%",
					background: "#D4537E",
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
					width: 20,
					height: 20,
					borderRadius: "50%",
					border: "2px solid #ED93B1",
					background:
						"repeating-linear-gradient(45deg, #ED93B1 0px, #ED93B1 1.5px, transparent 1.5px, transparent 4px)",
					boxSizing: "border-box",
				}}
			/>
		),
	},
	{
		value: "unavailable",
		label: "Unavailable",
		icon: (
			<div
				style={{
					width: 20,
					height: 20,
					borderRadius: "50%",
					border: "2px solid #D3D1C7",
					boxSizing: "border-box",
				}}
			/>
		),
	},
];
