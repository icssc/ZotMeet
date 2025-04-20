"use client";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type StatusType = "ACCEPT" | "MAYBE" | "DECLINE" | "NOT INDICATED";

export const MeetingCardStatus = () => {
    // const handleStatusChange = (newStatus: StatusType) => {
    //     setStatus(newStatus);
    // };

    const statusColors = {
        ACCEPT: "bg-green-500",
        MAYBE: "bg-yellow-500",
        DECLINE: "bg-red-500",
        "NOT INDICATED": "bg-gray-400",
    };

    const statusDisplay = {
        ACCEPT: "ACCEPTED",
        MAYBE: "MAYBE",
        DECLINE: "DECLINED",
        "NOT INDICATED": "NOT INDICATED",
    };

    const statusOptions: StatusType[] = ["ACCEPT", "MAYBE", "DECLINE"];

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button
                    type="button"
                    className={`flex items-center gap-2 rounded-lg border-2 border-gray-200 px-4 py-1 ${status === "NOT INDICATED" ? "w-auto" : "w-28"} justify-center`}
                >
                    <div
                        className={`h-2 w-2 rounded-full ${statusColors[status as keyof typeof statusColors]}`}
                    ></div>
                    <p className="font-dm-sans text-xs font-semibold text-gray-500">
                        {statusDisplay[status as keyof typeof statusDisplay]}
                    </p>
                </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
                className={`${status === "NOT INDICATED" ? "w-36" : "w-28"} rounded-lg bg-gray-200`}
            >
                {statusOptions.map((option) => (
                    <DropdownMenuItem
                        key={option}
                        className={`pl-2 pr-2 ${status === option ? "bg-accent" : ""}`}
                        // onClick={() => handleStatusChange(option)}
                    >
                        <div className="flex items-center gap-2">
                            <div
                                className={`h-2 w-2 rounded-full ${statusColors[option as Exclude<StatusType, "NOT INDICATED">]}`}
                            ></div>
                            <span className="font-dm-sans text-xs font-semibold text-gray-500">
                                {option}
                            </span>
                        </div>
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
