"use client";

import { CalendarCheck, ChevronDown, Pencil, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useShallow } from "zustand/shallow";
import {
	type AvailabilityMode,
	AvailabilityModeSelector,
	type GoogleCalendarInfo,
} from "@/components/availability/personal-availability-sidebar";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import type { UserProfile } from "@/lib/auth/user";
import type { Member } from "@/lib/types/availability";
import { useAvailabilityStore } from "@/store/useAvailabilityStore";

interface MobileActionBarProps {
	user: UserProfile | null;
	isOwner: boolean;
	members: Member[];
	setChangeableTimezone: (can: boolean) => void;
	setTimezone: (timezone: string) => void;
	availabilityMode: AvailabilityMode;
	onModeChange: (mode: AvailabilityMode) => void;
	onReset: () => void;
	googleCalendars: GoogleCalendarInfo[];
	hiddenCalendarIds: Set<string>;
	onToggleCalendar: (calendarId: string) => void;
	overlayAvailabilities: boolean;
	onOverlayChange: (value: boolean) => void;
}

export function MobileActionBar({
	user,
	isOwner,
	members,
	setChangeableTimezone,
	setTimezone,
	availabilityMode,
	onModeChange,
	onReset,
	googleCalendars,
	hiddenCalendarIds,
	onToggleCalendar,
	overlayAvailabilities,
	onOverlayChange,
}: MobileActionBarProps) {
	const router = useRouter();

	const { availabilityView, setAvailabilityView, setIsMobileDrawerOpen } =
		useAvailabilityStore(
			useShallow((state) => ({
				availabilityView: state.availabilityView,
				setAvailabilityView: state.setAvailabilityView,
				setIsMobileDrawerOpen: state.setIsMobileDrawerOpen,
			})),
		);

	const [isMoreOptionsOpen, setIsMoreOptionsOpen] = useState(false);

	const handleAddAvailability = () => {
		if (!user) {
			router.push("/auth/login/google");
			return;
		}
		setChangeableTimezone(false);
		setTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone);
		setAvailabilityView("personal");
	};

	const handleScheduleMeeting = () => {
		setAvailabilityView("schedule");
	};

	if (availabilityView === "personal") {
		return (
			<>
				<div className="fixed right-4 bottom-20 left-4 z-30 lg:hidden">
					<div className="flex items-center justify-around rounded-2xl bg-white px-2 py-3 shadow-lg">
						<button
							type="button"
							className="flex flex-col items-center gap-1 px-3 py-1 text-gray-700"
							onClick={() => setIsMoreOptionsOpen(true)}
						>
							<ChevronDown className="size-5" />
							<span className="text-xs">More Options</span>
						</button>

						<div className="h-10 w-px bg-gray-200" />

						<button
							type="button"
							className="flex flex-col items-center gap-1 px-3 py-1"
							onClick={() => onModeChange("available")}
						>
							<div
								className={
									availabilityMode === "available"
										? "size-6 rounded-full bg-[#F26489]"
										: "size-6 rounded-full border-2 border-gray-300 bg-white"
								}
							/>
							<span className="text-gray-700 text-xs">Available</span>
						</button>

						<div className="h-10 w-px bg-gray-200" />

						<button
							type="button"
							className="flex flex-col items-center gap-1 px-3 py-1"
							onClick={() => onModeChange("if-needed")}
						>
							<div
								className="size-6 rounded-full border-2 border-[#F26489]"
								style={
									availabilityMode === "if-needed"
										? {
												background:
													"repeating-linear-gradient(45deg, #F9B8CA, #F9B8CA 2px, transparent 2px, transparent 7px)",
											}
										: { background: "white" }
								}
							/>
							<span className="text-gray-700 text-xs">If Needed</span>
						</button>

						<div className="h-10 w-px bg-gray-200" />

						<button
							type="button"
							className="flex flex-col items-center gap-1 px-3 py-1"
							onClick={() => onModeChange("unavailable")}
						>
							<div className="size-6 rounded-full border-2 border-gray-300 bg-white" />
							<span className="text-gray-700 text-xs">Unavailable</span>
						</button>
					</div>
				</div>

				{isMoreOptionsOpen && (
					<>
						<button
							type="button"
							aria-label="Close options"
							className="fixed inset-0 z-40 bg-black/20"
							onClick={() => setIsMoreOptionsOpen(false)}
						/>
						<div className="fixed right-0 bottom-0 left-0 z-50 rounded-t-2xl bg-white pb-8 shadow-xl lg:hidden">
							<div className="flex justify-center pt-3 pb-2">
								<div className="h-1 w-10 rounded-full bg-gray-300" />
							</div>

							<div className="overflow-y-auto px-4 pb-28">
								<div className="mb-4">
									<h3 className="font-medium font-montserrat text-lg">
										Availability Settings
									</h3>
									<p className="mb-3 text-gray-500 text-sm">
										Click to switch from fill &ldquo;Available&rdquo; to
										&ldquo;If needed&rdquo;.
									</p>
									<AvailabilityModeSelector
										availabilityMode={availabilityMode}
										onModeChange={onModeChange}
									/>
									<Button
										variant="outline"
										className="mt-3 w-full gap-2 uppercase"
										onClick={() => {
											onReset();
											setIsMoreOptionsOpen(false);
										}}
									>
										<RefreshCw className="size-4" />
										Reset Availability
									</Button>
								</div>

								<div className="my-4 h-px bg-gray-200" />

								{googleCalendars.length > 0 && (
									<>
										<div className="mb-4">
											<h3 className="font-medium font-montserrat text-lg">
												Calendar Overlays
											</h3>
											<p className="mb-3 text-gray-500 text-sm">
												Selected schedules will overlay their events.
											</p>
											<div className="flex flex-col gap-2">
												{googleCalendars.map((cal) => (
													<div key={cal.id} className="flex items-center gap-2">
														<Checkbox
															id={`mobile-overlay-${cal.id}`}
															checked={!hiddenCalendarIds.has(cal.id)}
															onCheckedChange={() => onToggleCalendar(cal.id)}
														/>
														<div
															className="size-3 shrink-0 rounded-full"
															style={{ backgroundColor: cal.color }}
														/>
														<Label
															htmlFor={`mobile-overlay-${cal.id}`}
															className="cursor-pointer truncate"
														>
															{cal.name}
														</Label>
													</div>
												))}
											</div>
										</div>

										<div className="my-4 h-px bg-gray-200" />
									</>
								)}

								<div className="flex items-start justify-between gap-4">
									<div>
										<h3 className="font-medium font-montserrat text-lg">
											Overlay Availabilities
										</h3>
										<p className="text-gray-500 text-sm">
											View all availability while inputting your own.
										</p>
									</div>
									<Switch
										checked={overlayAvailabilities}
										onCheckedChange={onOverlayChange}
									/>
								</div>
							</div>
						</div>
					</>
				)}
			</>
		);
	}

	if (availabilityView !== "group") return null;

	return (
		<div className="fixed right-4 bottom-20 left-4 z-30 lg:hidden">
			<div className="flex items-center justify-around rounded-2xl bg-white px-2 py-3 shadow-lg">
				<button
					type="button"
					className="flex flex-col items-center gap-1 px-3 py-1 text-gray-700"
					onClick={() => setIsMobileDrawerOpen(true)}
				>
					<ChevronDown className="size-5" />
					<span className="text-xs">More Options</span>
				</button>

				<div className="h-10 w-px bg-gray-200" />

				<div className="flex flex-col items-center gap-1 px-3 py-1 text-gray-700">
					<span className="font-medium text-sm leading-none">
						{members.length}
					</span>
					<span className="text-xs">Attendees</span>
				</div>

				<div className="h-10 w-px bg-gray-200" />

				<button
					type="button"
					className="flex flex-col items-center gap-1 px-3 py-1 text-gray-700"
					onClick={handleAddAvailability}
				>
					<Pencil className="size-5" />
					<span className="text-xs">Add Availability</span>
				</button>

				{isOwner && (
					<>
						<div className="h-10 w-px bg-gray-200" />

						<button
							type="button"
							className="flex flex-col items-center gap-1 px-3 py-1 text-gray-700"
							onClick={handleScheduleMeeting}
						>
							<CalendarCheck className="size-5" />
							<span className="text-xs">Schedule Meeting</span>
						</button>
					</>
				)}
			</div>
		</div>
	);
}
