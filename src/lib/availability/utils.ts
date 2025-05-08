import { HourMinuteString, TimeConstants } from "@/lib/types/chrono";
import { ZotDate } from "@/lib/zotdate";

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
