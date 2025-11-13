import { HourMinuteString, TimeConstants } from "@/lib/types/chrono";
import { ZotDate } from "@/lib/zotdate";
import { fromZonedTime } from "date-fns-tz";

export const getTimeFromHourMinuteString = (
    hourMinuteString: HourMinuteString
): number => {
    const [hours, minutes, _seconds] = hourMinuteString.split(":");
    return Number(hours) * TimeConstants.MINUTES_PER_HOUR + Number(minutes);
};

/**
 * Converts a time string from a specific timezone to UTC
 * @param timeString - Time string in format "HH:MM:SS" or "HH:MM"
 * @param timezone - IANA timezone string (e.g., "America/Los_Angeles")
 * @param referenceDate - A date string to use as reference (e.g., "2025-11-13T00:00:00.000Z")
 * @returns Time string in UTC format "HH:MM:SS"
 */
export const convertTimeToUTC = (
    timeString: string,
    timezone: string,
    referenceDate: string
): string => {
    // Parse the time string
    const [hours, minutes, seconds = "00"] = timeString.split(":");

    // Get just the date part (YYYY-MM-DD) from the ISO string
    const datePart = referenceDate.substring(0, 10);

    // Create a date string in the local timezone
    const localDateTimeString = `${datePart}T${hours}:${minutes}:${seconds}`;

    // Convert from the specified timezone to UTC
    const utcDate = fromZonedTime(localDateTimeString, timezone);

    // Format as HH:MM:SS in UTC
    const utcHours = utcDate.getUTCHours().toString().padStart(2, "0");
    const utcMinutes = utcDate.getUTCMinutes().toString().padStart(2, "0");
    const utcSeconds = utcDate.getUTCSeconds().toString().padStart(2, "0");

    return `${utcHours}:${utcMinutes}:${utcSeconds}`;
};

export const BLOCK_LENGTH: number = 15;

export const generateTimeBlocks = (
    startTime: number,
    endTime: number
): number[] => {
    const timeBlocks: number[] = [];
    const minuteRange = Math.abs(endTime - startTime);
    const totalBlocks = Math.floor(minuteRange / BLOCK_LENGTH);

    for (let blockIndex = 0; blockIndex < totalBlocks; blockIndex++) {
        timeBlocks.push(startTime + blockIndex * BLOCK_LENGTH);
    }
    return timeBlocks;
};

export const generateDateKey = ({
    selectedDate,
    timeBlock,
    pageDateIndex,
}: {
    selectedDate: ZotDate;
    timeBlock: number;
    pageDateIndex: number;
}) => {
    return selectedDate
        ? `date-${selectedDate.valueOf()}-${timeBlock}-${pageDateIndex}`
        : `padding-${pageDateIndex}-${timeBlock}`;
};

export const getMinutesFromMidnight = (isoOrDateString: string): number => {
    const date = new Date(isoOrDateString);
    return date.getHours() * 60 + date.getMinutes();
};

export const getDatePart = (isoOrDateString: string): string => {
    return isoOrDateString.substring(0, 10);
};

export function generateCellKey(
    zotDateIndex: number,
    blockIndex: number
): string {
    return `${zotDateIndex}_${blockIndex}`;
}
