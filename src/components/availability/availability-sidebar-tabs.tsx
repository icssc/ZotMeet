"use client";

import { Divider, Paper, Tab, Tabs } from "@mui/material";
import { type ComponentProps, useState } from "react";
import { GroupResponses } from "@/components/availability/group-responses";
import { RoomRecommendationSettings } from "@/components/availability/room-recommendations";
import { cn } from "@/lib/utils";

type SidebarTab = "attendees" | "rooms";

interface AvailabilitySidebarTabsProps {
	attendeeCount: number;
	/** Rooms matching the current filters; null before the first search. */
	roomCount: number | null;
	groupResponsesProps: ComponentProps<typeof GroupResponses>;
	roomProps: Omit<ComponentProps<typeof RoomRecommendationSettings>, "layout">;
}

/** Desktop group/schedule sidebar: attendees and room recommendations as tabs. */
export function AvailabilitySidebarTabs({
	attendeeCount,
	roomCount,
	groupResponsesProps,
	roomProps,
}: AvailabilitySidebarTabsProps) {
	const [tab, setTab] = useState<SidebarTab>("attendees");

	return (
		<Paper
			variant="outlined"
			className="flex min-h-[24rem] min-w-0 flex-1 flex-col overflow-hidden"
		>
			<Tabs
				value={tab}
				onChange={(_, next: SidebarTab) => setTab(next)}
				variant="fullWidth"
			>
				<Tab value="attendees" label={`Attendees · ${attendeeCount}`} />
				<Tab
					value="rooms"
					label={roomCount === null ? "Rooms" : `Rooms · ${roomCount}`}
				/>
			</Tabs>
			<Divider />

			{/* Kept mounted while hidden: below lg it also owns the mobile
			    responders sheet, and it holds the nudge cooldown state. */}
			<div
				className={cn(
					"flex min-h-0 flex-1 flex-col pt-4",
					tab !== "attendees" && "hidden",
				)}
			>
				<GroupResponses {...groupResponsesProps} />
			</div>

			{tab === "rooms" && (
				<div className="min-h-0 flex-1 overflow-y-auto overscroll-y-contain">
					<RoomRecommendationSettings layout="sidebar" {...roomProps} />
				</div>
			)}
		</Paper>
	);
}
