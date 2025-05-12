import type { EventSegment } from "@/lib/types/availability";
import { cn } from "@/lib/utils";

export function GoogleCalendarEventBlock({
    eventSegments,
}: {
    eventSegments: EventSegment[];
}) {
    return (
        <div
            className="pointer-events-none absolute inset-0 z-10"
            style={{
                display: "grid",
                gridTemplateColumns: `repeat(${Math.max(...eventSegments.map((s) => s.cellMaxConcurrentInGroup), 1)}, 1fr)`,
            }}
        >
            {eventSegments.map((segment, index) => {
                const segmentBgColor = "bg-blue-300"; // Can potentially pass in Google Calendar color
                const segmentBorderColor = "border-blue-500";

                return (
                    <div
                        key={`${segment.eventId}-${index}`}
                        className={cn(
                            // Styles borders per segment
                            "box-border h-full overflow-hidden",
                            segmentBgColor,
                            "bg-opacity-20",
                            segment.isStartOfEventInCell &&
                                `rounded-t border-t ${segmentBorderColor}`,
                            segment.isEndOfEventInCell &&
                                `rounded-b border-b ${segmentBorderColor}`,
                            `border-l ${segmentBorderColor}`,
                            `border-r ${segmentBorderColor}`
                        )}
                        style={{
                            gridColumn: `${segment.cellAssignedColumn + 1} / span 1`,
                        }}
                        title={segment.summary}
                    >
                        {segment.isStartOfEventInCell && (
                            <div className="select-none truncate p-0.5 text-xs leading-tight text-blue-800">
                                {segment.summary}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
