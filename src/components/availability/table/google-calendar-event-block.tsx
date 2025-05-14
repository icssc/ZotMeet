import type { EventSegment } from "@/lib/types/availability";
import { cn } from "@/lib/utils";
import tinycolor from "tinycolor2";

interface GoogleCalendarEventBlockProps {
    eventSegments: EventSegment[];
    isAvailable: boolean;
}

export function GoogleCalendarEventBlock({
    eventSegments,
    isAvailable,
}: GoogleCalendarEventBlockProps) {
    const maxConcurrentInThisBlock = Math.max(
        1,
        ...eventSegments.map((s) => s.cellMaxConcurrentInGroup)
    );

    return (
        <div
            className="pointer-events-none absolute inset-0 z-10"
            style={{
                display: "grid",
                gridTemplateColumns: `repeat(${maxConcurrentInThisBlock}, minmax(0, 1fr))`,
            }}
        >
            {eventSegments.map((segment, index) => {
                // Adjusts colors to be more legible
                const segmentBaseColor = tinycolor(segment.calendarColor);
                const segmentBgColor = segmentBaseColor
                    .setAlpha(0.2)
                    .toRgbString();
                const segmentBorderColor = segmentBaseColor
                    .clone()
                    .darken(20)
                    .toHexString();
                const segmentTextColor = segmentBaseColor
                    .clone()
                    .darken(Math.log2(1 + segmentBaseColor.getLuminance()) * 50)
                    .toHexString();

                const column = segment.cellAssignedColumn + 1;

                return (
                    <div
                        key={`${segment.eventId}-${index}`}
                        className={cn(
                            // Styles borders per segment
                            "box-border h-full overflow-hidden",
                            segment.isStartOfEventInCell &&
                                "rounded-t border-t",
                            segment.isEndOfEventInCell && "rounded-b border-b",
                            "border-x"
                        )}
                        style={{
                            gridColumn: column,
                            backgroundColor: isAvailable
                                ? "transparent"
                                : segmentBgColor,
                            borderColor: isAvailable
                                ? "white"
                                : segmentBorderColor,
                        }}
                        title={segment.summary}
                    >
                        {segment.isStartOfEventInCell && (
                            <div
                                className="select-none truncate p-0.5 text-xs leading-tight"
                                style={{
                                    color: isAvailable
                                        ? "white"
                                        : segmentTextColor,
                                }}
                            >
                                {segment.summary}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
