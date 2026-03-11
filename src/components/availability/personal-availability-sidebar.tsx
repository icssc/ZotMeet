"use client";

import { ChevronDown, ChevronUp, RefreshCw } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

export type AvailabilityMode = "available" | "if-needed" | "unavailable";

interface AvailabilityModeSelectorProps {
	availabilityMode: AvailabilityMode;
	onModeChange: (mode: AvailabilityMode) => void;
}

export function AvailabilityModeSelector({
	availabilityMode,
	onModeChange,
}: AvailabilityModeSelectorProps) {
	return (
		<div className="flex gap-2">
			<button
				type="button"
				className={cn(
					"flex flex-1 flex-col items-center gap-1.5 rounded-lg border-2 py-2 text-xs transition-colors",
					availabilityMode === "available"
						? "border-[#F26489] bg-[#FDEEF3]"
						: "border-gray-200 bg-white",
				)}
				onClick={() => onModeChange("available")}
			>
				<div className="size-6 rounded-full bg-[#F26489]" />
				<span>Available</span>
			</button>

			<button
				type="button"
				className={cn(
					"flex flex-1 flex-col items-center gap-1.5 rounded-lg border-2 py-2 text-xs transition-colors",
					availabilityMode === "if-needed"
						? "border-[#F26489] bg-[#FDEEF3]"
						: "border-gray-200 bg-white",
				)}
				onClick={() => onModeChange("if-needed")}
			>
				<div
					className="size-6 rounded-full border-2 border-[#F26489]"
					style={{
						background:
							"repeating-linear-gradient(45deg, #F9B8CA, #F9B8CA 2px, transparent 2px, transparent 7px)",
					}}
				/>
				<span>If Needed</span>
			</button>

			<button
				type="button"
				className={cn(
					"flex flex-1 flex-col items-center gap-1.5 rounded-lg border-2 py-2 text-xs transition-colors",
					availabilityMode === "unavailable"
						? "border-[#F26489] bg-[#FDEEF3]"
						: "border-gray-200 bg-white",
				)}
				onClick={() => onModeChange("unavailable")}
			>
				<div className="size-6 rounded-full border-2 border-gray-300 bg-white" />
				<span>Unavailable</span>
			</button>
		</div>
	);
}

export interface GoogleCalendarInfo {
	id: string;
	name: string;
	color: string;
}

interface PersonalAvailabilitySidebarProps {
	onCancel: () => void;
	onReset: () => void;
	onSave: () => void;
	availabilityMode: AvailabilityMode;
	onModeChange: (mode: AvailabilityMode) => void;
	googleCalendars: GoogleCalendarInfo[];
	hiddenCalendarIds: Set<string>;
	onToggleCalendar: (calendarId: string) => void;
	overlayAvailabilities: boolean;
	onOverlayChange: (value: boolean) => void;
}

export function PersonalAvailabilitySidebar({
	onCancel,
	onReset,
	onSave,
	availabilityMode,
	onModeChange,
	googleCalendars,
	hiddenCalendarIds,
	onToggleCalendar,
	overlayAvailabilities,
	onOverlayChange,
}: PersonalAvailabilitySidebarProps) {
	const [calendarOverlaysExpanded, setCalendarOverlaysExpanded] =
		useState(true);

	return (
		<div className="hidden w-72 shrink-0 flex-col gap-4 pl-4 lg:flex">
			<div>
				<h2 className="font-medium font-montserrat text-xl">
					Add Availability
				</h2>
				<p className="mt-0.5 text-gray-500 text-sm">
					Drag over the calendar to add your availability.
				</p>
			</div>

			<div className="rounded-lg border bg-white p-4">
				<h3 className="font-medium font-montserrat text-lg">
					Availability Settings
				</h3>
				<p className="mt-0.5 text-gray-500 text-sm">
					Click to switch from fill &ldquo;Available&rdquo; to &ldquo;If
					needed&rdquo;.
				</p>

				<div className="mt-3">
					<AvailabilityModeSelector
						availabilityMode={availabilityMode}
						onModeChange={onModeChange}
					/>
				</div>

				<Button
					variant="outline"
					className="mt-3 w-full gap-2 uppercase"
					onClick={onReset}
				>
					<RefreshCw className="size-4" />
					Reset Availability
				</Button>
			</div>

			<div className="rounded-lg border bg-white">
				<button
					type="button"
					className="flex w-full items-start justify-between px-4 pt-4 pb-3"
					onClick={() => setCalendarOverlaysExpanded((v) => !v)}
				>
					<div className="text-left">
						<h3 className="font-medium font-montserrat text-lg">
							Calendar Overlays
						</h3>
						<p className="mt-0.5 text-gray-500 text-sm">
							Selected schedules will overlay their events.
						</p>
					</div>
					{calendarOverlaysExpanded ? (
						<ChevronUp className="mt-1 size-5 shrink-0 text-gray-500" />
					) : (
						<ChevronDown className="mt-1 size-5 shrink-0 text-gray-500" />
					)}
				</button>

				{calendarOverlaysExpanded && (
					<div className="flex flex-col gap-2 px-4 pb-4">
						{googleCalendars.length === 0 ? (
							<p className="text-gray-400 text-sm">No calendars connected.</p>
						) : (
							googleCalendars.map((cal) => (
								<div key={cal.id} className="flex items-center gap-2">
									<Checkbox
										id={`overlay-${cal.id}`}
										checked={!hiddenCalendarIds.has(cal.id)}
										onCheckedChange={() => onToggleCalendar(cal.id)}
									/>
									<div
										className="size-3 shrink-0 rounded-full"
										style={{ backgroundColor: cal.color }}
									/>
									<Label
										htmlFor={`overlay-${cal.id}`}
										className="cursor-pointer truncate"
									>
										{cal.name}
									</Label>
								</div>
							))
						)}
					</div>
				)}
			</div>

			<div className="rounded-lg border bg-white px-4 py-4">
				<div className="flex items-start justify-between gap-4">
					<div>
						<h3 className="font-medium font-montserrat text-lg">
							Overlay Availabilities
						</h3>
						<p className="mt-0.5 text-gray-500 text-sm">
							View all availability while inputting your own.
						</p>
					</div>
					<Switch
						checked={overlayAvailabilities}
						onCheckedChange={onOverlayChange}
					/>
				</div>
			</div>

			<div className="flex gap-2">
				<Button
					variant="outline"
					className="flex-1 uppercase"
					onClick={onCancel}
				>
					Cancel
				</Button>
				<Button className="flex-1 uppercase" onClick={onSave}>
					Save
				</Button>
			</div>
		</div>
	);
}
