import { MemberMeetingAvailability } from "@/lib/types/availability";
import { HourMinuteString, TimeConstants } from "@/lib/types/chrono";
import { ZotDate } from "@/lib/zotdate";

export const getTimeFromHourMinuteString = (
    hourMinuteString: HourMinuteString
): number => {
    const [hours, minutes, seconds] = hourMinuteString.split(":");
    return Number(hours) * TimeConstants.MINUTES_PER_HOUR + Number(minutes);
};

const BLOCK_LENGTH: number = 15;

// export const generateDates = (
//     startTime: number = 0,
//     endTime: number = 1440,
//     groupMembers: MemberMeetingAvailability[]
// ): ZotDate[] => {
//     // Extract unique calendar dates from groupMembers' availableBlocks
//     const uniqueDates = new Set<string>();

//     groupMembers.forEach(({ meetingAvailabilities }) => {
//         for (
//             let dateIndex = 0;
//             dateIndex < meetingAvailabilities.length;
//             dateIndex++
//         ) {
//             const blocks = meetingAvailabilities[dateIndex];

//             if (blocks.length > 0) {
//                 uniqueDates.add(blocks.split("T")[0]);
//             }
//         }
//     });

//     //Convert unique dates into ZotDate instances
//     const selectedCalendarDates: ZotDate[] = Array.from(uniqueDates)
//         .sort()
//         .map((dateString) => new ZotDate(new Date(dateString)));
//     const selectedCalendarDateDict: Record<string, ZotDate> = Array.from(
//         uniqueDates
//     )
//         .sort()
//         .reduce(
//             (acc, dateString) => {
//                 acc[dateString] = new ZotDate(
//                     new Date(dateString),
//                     startTime,
//                     endTime
//                 );
//                 return acc;
//             },
//             {} as Record<string, ZotDate>
//         );
//     const dayCount = selectedCalendarDates.length;
//     ZotDate.initializeAvailabilities(
//         selectedCalendarDates,
//         startTime,
//         endTime,
//         BLOCK_LENGTH
//     );
//     groupMembers.forEach(({ displayName }, memberCount) => {
//         groupMembers[memberCount].meetingAvailabilities.forEach(
//             (meetingCount) => {
//                 selectedCalendarDateDict[
//                     meetingCount.split("T")[0]
//                 ].setDayAvailability(0, displayName, meetingCount);
//             }
//         );
//     });
//     return Object.values(selectedCalendarDateDict);
// };
