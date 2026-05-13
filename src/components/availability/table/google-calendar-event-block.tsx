import type { EventSegment } from "@/lib/types/availability";

import { GoogleCalendarEventSegment } from "./google-calendar-event-segment";

interface GoogleCalendarEventBlockProps {
	eventSegments: EventSegment[];
	rendersOverPrimary: boolean;
}

export function GoogleCalendarEventBlock({
	eventSegments,
	rendersOverPrimary,
}: GoogleCalendarEventBlockProps) {
	if (eventSegments.length === 0) {
		return null;
	}

	const cellGridColumnCountInThisBlock = eventSegments[0].cellGridColumnCount;

	return (
		<div
			className="pointer-events-none absolute inset-0 z-10"
			style={{
				display: "grid",
				gridTemplateColumns: `repeat(${cellGridColumnCountInThisBlock}, minmax(0, 1fr))`,
			}}
		>
			{eventSegments.map((segment, index) => (
				<GoogleCalendarEventSegment
					key={`${segment.eventId}-${index}`}
					segment={segment}
					rendersOverPrimary={rendersOverPrimary}
				/>
			))}
		</div>
	);
}
