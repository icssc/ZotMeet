"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import {
	batchUpdateCalendarSelections,
	getCalendarsForDialog,
} from "@/server/actions/availability/google/calendar-selection/action";
import { useGoogleCalendarSelectionStore } from "@/store/useGoogleCalendarSelectionStore";

export function GoogleCalendarSelectionDialog() {
	const {
		calendars,
		isDialogOpen,
		setDialogOpen,
		setCalendars,
		toggleCalendar,
	} = useGoogleCalendarSelectionStore();

	const [isSaving, setIsSaving] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [initialState, setInitialState] = useState(calendars);
	const hasFetchedRef = useRef(false);

	useEffect(() => {
		if (isDialogOpen) {
			if (!hasFetchedRef.current) setIsLoading(true);

			getCalendarsForDialog()
				.then((fetchedCalendars) => {
					setCalendars(fetchedCalendars);
					setInitialState(fetchedCalendars);
					hasFetchedRef.current = true;
				})
				.catch((error) => {
					console.error("Error loading calendars:", error);
				})
				.finally(() => {
					setIsLoading(false);
				});
		}
	}, [isDialogOpen, setCalendars]);

	const activeCalendars = calendars.filter((c) => !c.archived);
	const archivedCalendars = calendars.filter((c) => c.archived);

	const handleSave = async () => {
		setIsSaving(true);
		try {
			const updates = calendars.map((cal) => ({
				calendarId: cal.calendarId,
				enabled: cal.enabled,
			}));

			const result = await batchUpdateCalendarSelections(updates);

			if (result.success) {
				setDialogOpen(false);

				window.dispatchEvent(new CustomEvent("google-calendar-updated"));
			} else {
				console.error("Failed to update calendars:", result.error);
			}
		} catch (error) {
			console.error("Error saving calendar selections:", error);
		} finally {
			setIsSaving(false);
		}
	};

	const handleCancel = () => {
		useGoogleCalendarSelectionStore.setState({ calendars: initialState });
		setDialogOpen(false);
	};

	return (
		<Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
			<DialogContent className="max-w-md">
				<DialogHeader>
					<DialogTitle>Select Calendars to Sync</DialogTitle>
					<DialogDescription>
						Choose which Google Calendars to display in your availability view.
					</DialogDescription>
				</DialogHeader>

				<div className="max-h-[400px] space-y-4 overflow-y-auto">
					{isLoading ? (
						<div className="py-4 text-center text-muted-foreground text-sm">
							Loading calendars...
						</div>
					) : activeCalendars.length > 0 ? (
						<div className="space-y-2">
							{activeCalendars.map((cal) => (
								<div
									key={cal.calendarId}
									className="flex items-center justify-between py-2"
								>
									<div className="flex min-w-0 flex-1 items-center gap-2">
										<div
											className="h-3 w-3 flex-shrink-0 rounded-full"
											style={{ backgroundColor: cal.calendarColor }}
										/>
										<span className="truncate text-sm">{cal.calendarName}</span>
									</div>
									<Switch
										checked={cal.enabled}
										onCheckedChange={() => toggleCalendar(cal.calendarId)}
									/>
								</div>
							))}
						</div>
					) : (
						<div className="py-4 text-center text-muted-foreground text-sm">
							No calendars found. Connect your Google Calendar to sync.
						</div>
					)}

					{archivedCalendars.length > 0 && (
						<div className="border-t pt-4">
							<p className="mb-2 text-muted-foreground text-xs">
								Archived Calendars (no longer in Google)
							</p>
							{archivedCalendars.map((cal) => (
								<div
									key={cal.calendarId}
									className="flex items-center justify-between py-2 opacity-50"
								>
									<div className="flex min-w-0 flex-1 items-center gap-2">
										<div
											className="h-3 w-3 flex-shrink-0 rounded-full"
											style={{ backgroundColor: cal.calendarColor }}
										/>
										<span className="truncate text-sm line-through">
											{cal.calendarName}
										</span>
									</div>
									<Switch checked={false} disabled />
								</div>
							))}
						</div>
					)}
				</div>

				<div className="mt-4 flex justify-end gap-2">
					<Button variant="outline" onClick={handleCancel} disabled={isSaving}>
						Cancel
					</Button>
					<Button onClick={handleSave} disabled={isSaving}>
						{isSaving ? "Saving..." : "Save"}
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
