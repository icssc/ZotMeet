import { HourMinuteString, TimeConstants } from "@/lib/types/chrono";
import { ZotDate } from "@/lib/zotdate";
import { differenceInCalendarDays } from "date-fns";

export const getTimeFromHourMinuteString = (
    hourMinuteString: HourMinuteString
): number => {
    const [hours, minutes, _seconds] = hourMinuteString.split(":");
    return Number(hours) * TimeConstants.MINUTES_PER_HOUR + Number(minutes);
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
export const spacerBeforeDate = (
    currentPageAvailability: ZotDate[]
): boolean[] => {
    return currentPageAvailability.map((date, index, arr) => {
        if (index === 0 || !date || !arr[index - 1]) return false;
        const prevDate = arr[index - 1].day;
        const currentDate = date.day;

        return (
            differenceInCalendarDays(
                new Date(currentDate),
                new Date(prevDate)
            ) > 1
        );
    });
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
