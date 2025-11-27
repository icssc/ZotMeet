"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NotFound() {
    const isMeeting = usePathname().includes("/availability/");
    const typeDes = isMeeting ? "meeting" : "page"; // type for description
    const typeTitle = isMeeting ? "Meeting" : "Page"; //type for title

    return (
        <div className="flex min-h-screen items-center justify-center">
            <div className="flex h-fit w-fit items-center justify-center gap-2 rounded-md border border-blue-400 bg-blue-100 p-16 shadow-sm">
                <div className="flex flex-col items-center gap-3">
                    <h2 className="text-2xl font-bold">
                        Oops! {typeTitle} Not Found
                    </h2>
                    <p className="text-gray-600">
                        The {typeDes} you're looking for doesn't exist or may
                        have been moved
                    </p>

                    <div className="p-7">
                        <Image
                            src="/ZotMeet_BLACK.png"
                            alt="ZotMeet Logo"
                            width={120}
                            height={120}
                        />
                    </div>

                    <Link
                        href="/"
                        className="rounded-md border border-blue-400 bg-blue-600 p-4 text-white hover:bg-blue-500"
                    >
                        Return Home
                    </Link>
                </div>
            </div>
        </div>
    );
}
