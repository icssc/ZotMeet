import type { EventSegment } from "@/lib/types/availability";
import { cn } from "@/lib/utils";
import tinycolor from "tinycolor2";

interface GoogleCalendarEventSegmentProps {
	segment: EventSegment;
	isAvailable: boolean;
}

export function GoogleCalendarEventSegment({
	segment,
	isAvailable,
}: GoogleCalendarEventSegmentProps) {
	// Adjusts colors to be more legible
	const segmentBaseColor = tinycolor(segment.calendarColor);
	const segmentBgColor = segmentBaseColor.setAlpha(0.2).toRgbString();
	const segmentBorderColor = segmentBaseColor.clone().darken(20).toHexString();
	const segmentTextColor = segmentBaseColor
		.clone()
		.darken(Math.log2(1 + segmentBaseColor.getLuminance()) * 50)
		.toHexString();

	const gridColumn = segment.cellAssignedColumn + 1;

	return (
		<div
			className={cn(
				// Styles borders per segment
				"box-border h-full overflow-hidden",
				segment.isStartOfEventInCell && "rounded-t border-t",
				segment.isEndOfEventInCell && "rounded-b border-b",
				"border-x",
			)}
			style={{
				gridColumn,
				backgroundColor: isAvailable ? "transparent" : segmentBgColor,
				borderColor: isAvailable ? "white" : segmentBorderColor,
			}}
			title={segment.summary}
		>
			{segment.isStartOfEventInCell && (
				<div
					className="select-none truncate p-0.5 text-xs leading-tight"
					style={{
						color: isAvailable ? "white" : segmentTextColor,
					}}
				>
					{segment.summary}
				</div>
			)}
		</div>
	);
}
