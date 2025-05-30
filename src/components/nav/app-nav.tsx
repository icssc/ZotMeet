"use client";

import * as React from "react";
import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { NavMain } from "@/components/nav/nav-main";
import { NavUser } from "@/components/nav/nav-user";
import { Separator } from "@/components/ui/separator";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import { UserProfile } from "@/lib/auth/user";
import { CalendarSearchIcon, SquarePlusIcon } from "lucide-react";

const data = {
    navMain: [
        {
            title: "New Meeting",
            url: "/",
            icon: SquarePlusIcon,
            isActive: true,
        },
        {
            title: "Summary",
            url: "/summary",
            icon: CalendarSearchIcon,
        },
    ],
};

type SidebarComponentProps = React.ComponentProps<typeof Sidebar> & {
    user: UserProfile | null;
};

export function SidebarComponent({ user, ...props }: SidebarComponentProps) {
    const [isMobile, setIsMobile] = useState(false);

    const checkWindowSize = useCallback(() => {
        if (window.innerWidth < 768) {
            setIsMobile(true);
        } else {
            setIsMobile(false);
        }
    }, []);

    useEffect(() => {
        checkWindowSize();

        window.addEventListener("resize", checkWindowSize);

        return () => window.removeEventListener("resize", checkWindowSize);
    }, [checkWindowSize]);

    return (
        <Sidebar
            variant="inset"
            side={isMobile ? "right" : "left"}
            className="bg-gradient-to-tl from-[#EEEEEE] to-[#EAEFF2]"
            {...props}
        >
            <SidebarHeader className="bg-gradient-to-tl from-[#EEEEEE] to-[#EAEFF2]">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            size="lg"
                            asChild
                            className="hover:bg-inherit active:bg-inherit"
                        >
                            <a
                                href="/"
                                className="space-gray-800 space-x-2"
                            >
                                <div className="relative flex aspect-square size-8 items-center justify-center rounded-lg border border-black text-sidebar-primary-foreground">
                                    <Image
                                        src="/ZotMeet_BLACK.png"
                                        fill
                                        alt="ZotMeet logo"
                                    />
                                </div>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate text-4xl font-semibold">
                                        ZotMeet
                                    </span>
                                </div>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>

                <Separator className="h-[2px] bg-gray-300" />
            </SidebarHeader>
            <SidebarContent className="bg-gradient-to-tl from-[#EEEEEE] to-[#EAEFF2]">
                <NavMain items={data.navMain} />
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={user} />
            </SidebarFooter>
        </Sidebar>
    );
}
