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

export const generateDates = (
    startTime: number = earliestTime,
    endTime: number = latestTime,
    groupMembers: MemberAvailability[]
): ZotDate[] => {
    // Extract unique calendar dates from groupMembers' availableBlocks
    //console.log("group members in generate dates:", groupMembers);
    //console.log("group members display:", groupMembers);
    const uniqueDates = new Set<string>();
    // for (let i = 0; i < groupMembers.length; i++) {
    //     console.log("memberId:", groupMembers[i].memberId);
    //     console.log("meetingAvailabilities:", groupMembers[i].meetingAvailabilities);
    // }
    
    groupMembers.forEach(({ meetingAvailabilities }) => {
        //console.log("available block:", meetingAvailabilities);
        for (let dateIndex = 0; dateIndex < meetingAvailabilities.length; dateIndex++) {
            const blocks = meetingAvailabilities[dateIndex];
            //console.log("block at index", dateIndex, ":", blocks);
            if (blocks.length > 0) {
                uniqueDates.add(blocks.split("T")[0]);
            }
        }
        //console.log("unique dates:", uniqueDates);

    });

    //Convert unique dates into ZotDate instances
    const selectedCalendarDates: ZotDate[] = Array.from(uniqueDates)
        .sort()
        .map((dateString) => new ZotDate(new Date(dateString)));
    const selectedCalendarDateDict: Record<string, ZotDate> = Array.from(uniqueDates)
        .sort()
        .reduce((acc, dateString) => {
            acc[dateString] = new ZotDate(new Date(dateString), earliestTime, latestTime);
            return acc;
        }, {} as Record<string, ZotDate>);
    //console.log("selected calendar dates:", selectedCalendarDates);
    const dayCount = selectedCalendarDates.length;
    ZotDate.initializeAvailabilities(
        selectedCalendarDates,
        startTime,
        endTime,
        BLOCK_LENGTH
    );
    //go through each group member, find the corresponding date, and set it
    groupMembers.forEach(({displayName}, memberCount) => {
        //console.log("memberId:", memberId, "memberCount:", memberCount);
        groupMembers[memberCount].meetingAvailabilities.forEach((meetingCount) => {
            //console.log("current meeting",  meetingCount);
            //console.log("attempted to set to zotdate:", selectedCalendarDateDict[meetingCount.split("T")[0]]);
            selectedCalendarDateDict[meetingCount.split("T")[0]].setDayAvailability(
                0, 
                displayName,
                meetingCount,
            )
        // groupMembers[memberCount].forEach(({meetingAvailabilities}, meetingCount) => {
        //     const currentDateString = groupMembers[memberCount].meetingAvailabilities[meetingCount];
        //     if (currentDateString.split("T")[0] === )
        //     console.log("meetingAvailabilities:", meetingAvailabilities, "meetingCount:", meetingCount);
        //     selectedCalendarDates[memberCount].setGroupMemberAvailability(
        //         memberCount,
        //         groupMembers[memberCount].meetingAvailabilities
        //     );
        // }
        // const currentDateString = groupMembers
        // selectedCalendarDates[memberCount].setGroupMemberAvailability(
        //     memberCount,
        //     groupMembers[memberCount].meetingAvailabilities
        // );
    }
    );

    }
);
    // selectedCalendarDates.forEach(({day}, dayCount) => {
    //     console.log("ZotDate day:", day, "dayCount:", dayCount);
    //     console.log("day display:", day.toISOString());
        
        

    //     groupMembers.forEach(({meetingAvailabilities}, memberIndex) => {
    //         console.log("meetingAvailabilities:", meetingAvailabilities, "memberIndex:", memberIndex);
    //         console.log("current date string:", groupMembers[memberIndex].meetingAvailabilities[dayCount]);
    //         const currentDateString = groupMembers[memberIndex].meetingAvailabilities[dayCount];
    //         if (currentDateString.split("T")[0] === selectedCalendarDates[dayCount].day.toISOString().split("T")[0]) {
    //             console.log("currentDateString:", currentDateString, "day:", day);
    //             selectedCalendarDates[dayCount].setDayAvailability(
    //                 dayCount,
    //                 memberIndex,
    //                 //groupMembers[dayCount].meetingAvailabilities,
    //                 groupMembers[dayCount].meetingAvailabilities
    //             );
    //         }
    //     }
    // );});
    // groupMembers.forEach(({memberId}, memberCount) => {
    //     console.log("memberId:", memberId, "memberCount:", memberCount);
    //     groupMembers[memberCount].forEach(({meetingAvailabilities}, meetingCount) => {
    //         const currentDateString = groupMembers[memberCount].meetingAvailabilities[meetingCount];
    //         if (currentDateString.split("T")[0] === )
    //         console.log("meetingAvailabilities:", meetingAvailabilities, "meetingCount:", meetingCount);
    //         selectedCalendarDates[memberCount].setGroupMemberAvailability(
    //             memberCount,
    //             groupMembers[memberCount].meetingAvailabilities
    //         );
    //     }
    //     const currentDateString = groupMembers
    //     selectedCalendarDates[memberCount].setGroupMemberAvailability(
    //         memberCount,
    //         groupMembers[memberCount].meetingAvailabilities
    //     );
    // }
    // groupMembers.forEach(({ meetingAvailabilities }, dayCount) => {
    //     selectedCalendarDates[dayCount].setDayAvailability(
    //         dayCount,
    //         groupMembers[dayCount].meetingAvailabilities,
    //         meetingAvailabilities
    //     );
    // });
    // groupMembers.forEach(({ meetingAvailabilities }, memberIndex) => {
    //     selectedCalendarDates[memberIndex].setGroupMemberAvailability(
    //         memberIndex,
    //         meetingAvailabilities
    //     );
    // });

    //console.log("okay dict", selectedCalendarDateDict["2025-04-04"])
    //console.log("okay dict", selectedCalendarDateDict["2025-04-05"])

    //console.log("selected calendar dates after setting group member availability:", selectedCalendarDates);
    //return selectedCalendarDates;
    //console.log("selected calendar date dict into an array:", Object.values(selectedCalendarDateDict));
    return Object.values(selectedCalendarDateDict);
};

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

    groupMembers.forEach(({ meetingAvailabilities }, memberIndex) => {
        meetingAvailabilities.forEach((meetingAvailabilities, dateIndex) => {
            selectedCalendarDates[dateIndex].setGroupMemberAvailability(
                memberIndex,
                meetingAvailabilities
            );
        });
    });
    console.log('hellooooo', selectedCalendarDates)
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
            [1, 2, 3],
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
