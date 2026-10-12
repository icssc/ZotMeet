"use client";

import { Paper, Tab, Tabs } from "@mui/material";
import type { ReactNode } from "react";
import { type SidebarPanel, useSidebarPanel } from "@/hooks/use-sidebar-panel";
import { cn } from "@/lib/utils";

const tabsSx = {
	borderBottom: 1,
	borderColor: "divider",
	"& .MuiTabs-indicator": { height: 2, backgroundColor: "primary.main" },
	"& .MuiTab-root": {
		minHeight: 48,
		fontWeight: 600,
		letterSpacing: "0.08em",
		textTransform: "uppercase",
		color: "text.secondary",
	},
	"& .MuiTab-root.Mui-selected": { color: "text.primary" },
	"& .MuiTab-root.Mui-focusVisible": {
		outline: "2px solid",
		outlineOffset: "-2px",
	},
} as const;

/**
 * The meeting sidebar's one card: ATTENDEES · n | ROOMS · m. Both panels stay
 * mounted (only hidden), so the attendee panel's local state and the room
 * flow survive switching.
 */
export function SidebarTabs({
	attendeeCount,
	roomCount,
	attendees,
	rooms,
}: {
	attendeeCount: number;
	/** Null while loading: the tab reads plain "ROOMS". */
	roomCount: number | null;
	attendees: ReactNode;
	rooms: ReactNode;
}) {
	const [panel, setPanel] = useSidebarPanel();

	const panelProps = (value: SidebarPanel) => ({
		role: "tabpanel",
		id: `sidebar-panel-${value}`,
		"aria-labelledby": `sidebar-tab-${value}`,
		hidden: panel !== value,
		// `hidden` alone loses to Tailwind's `flex`, so swap the display too.
		className: cn(
			"min-h-0 min-w-0 flex-1 flex-col",
			panel === value ? "flex" : "hidden",
		),
	});

	return (
		<Paper
			variant="outlined"
			data-availability-sidebar=""
			// Capped at the viewport so the room list scrolls inside the card and
			// its Back / Next footer stays on screen.
			className="flex min-h-[24rem] min-w-0 flex-1 flex-col overflow-hidden lg:max-h-[calc(100dvh-12rem)]"
			// The outlined Paper's theme padding would inset the full-width tabs.
			sx={{ p: 0 }}
		>
			<Tabs
				value={panel}
				onChange={(_, next: SidebarPanel) => void setPanel(next)}
				variant="fullWidth"
				aria-label="Meeting sidebar"
				sx={tabsSx}
			>
				<Tab
					value="attendees"
					id="sidebar-tab-attendees"
					aria-controls="sidebar-panel-attendees"
					label={`Attendees · ${attendeeCount}`}
				/>
				<Tab
					value="rooms"
					id="sidebar-tab-rooms"
					aria-controls="sidebar-panel-rooms"
					label={roomCount == null ? "Rooms" : `Rooms · ${roomCount}`}
				/>
			</Tabs>
			<div {...panelProps("attendees")}>
				{/* The padding the outlined Paper gave the attendee panel before tabs. */}
				<div className="flex min-h-0 flex-1 flex-col p-3">{attendees}</div>
			</div>
			<div {...panelProps("rooms")}>{rooms}</div>
		</Paper>
	);
}
