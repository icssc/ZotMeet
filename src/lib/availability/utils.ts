import { MemberAvailability } from "@/lib/types/availability";
import { HourMinuteString, TimeConstants } from "@/lib/types/chrono";
import { ZotDate } from "@/lib/zotdate";

export const getTimeFromHourMinuteString = (
    hourMinuteString: HourMinuteString
): number => {
    const [hours, minutes, seconds] = hourMinuteString.split(":");
    return Number(hours) * TimeConstants.MINUTES_PER_HOUR + Number(minutes);
};

const earliestTime: number = getTimeFromHourMinuteString("08:00:00");
const latestTime: number = getTimeFromHourMinuteString("17:30:00");

const BLOCK_LENGTH: number = 15;

export const generateSampleDates = (
    startTime: number = earliestTime,
    endTime: number = latestTime,
    groupMembers: MemberAvailability[] = SAMPLE_MEMBERS
): ZotDate[] => {
    // Placeholder date array from Calendar component
    const selectedCalendarDates: ZotDate[] = [
        new ZotDate(new Date(2024, 0, 30)),
        new ZotDate(new Date(2024, 0, 31)),
        new ZotDate(new Date(2024, 1, 1)),
        new ZotDate(new Date(2024, 1, 2)),
        new ZotDate(new Date(2024, 1, 3)),
        new ZotDate(new Date(2024, 1, 4)),
        new ZotDate(new Date(2024, 1, 5)),
    ];

    ZotDate.initializeAvailabilities(
        selectedCalendarDates,
        startTime,
        endTime,
        BLOCK_LENGTH
    );

    groupMembers.forEach(({ availableBlocks }, memberIndex) => {
        availableBlocks.forEach((availableBlocks, dateIndex) => {
            selectedCalendarDates[dateIndex].setGroupMemberAvailability(
                memberIndex,
                availableBlocks
            );
        });
    });

    return selectedCalendarDates;
};

export const SAMPLE_MEMBERS: MemberAvailability[] = [
    {
        name: "Sean Fong",
        availableBlocks: [[1], [2], [3, 4, 5], [], [], [], []],
    },
    {
        name: "Joe Biden",
        availableBlocks: [
            [],
            [1, 2],
            [4, 5, 6, 22, 23, 24, 25, 26, 27, 28],
            [],
            [],
            [],
            [],
        ],
    },
    {
        name: "Chuck Norris",
        availableBlocks: [
            [4, 5, 6, 7, 8, 9, 10, 11, 20, 21, 22, 23, 24],
            [3, 4, 5, 6, 7],
            [4, 5, 6],
            [],
            [],
            [],
            [],
        ],
    },
    {
        name: "Dwayne the Rock",
        availableBlocks: [
            [],
            [1, 2, 3, 4, 5],
            [4, 5, 6, 25, 26, 27, 28],
            [],
            [],
            [],
            [],
        ],
    },
    {
        name: "Kevin Hart",
        availableBlocks: [[], [1, 2], [26, 27, 28, 29, 30, 31], [], [], [], []],
    },
];
