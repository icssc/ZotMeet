import type { Metadata } from "next";
import localFont from "next/font/local";

import "./globals.css";

import AppSidebar from "@/components/nav/app-sidebar";
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

const geistSans = localFont({
    src: "./fonts/GeistVF.woff",
    variable: "--font-geist-sans",
    weight: "100 900",
});
const geistMono = localFont({
    src: "./fonts/GeistMonoVF.woff",
    variable: "--font-geist-mono",
    weight: "100 900",
});

export const metadata: Metadata = {
    title: "ZotMeet | Create a Meeting",
    description: "ZotMeet: Simple, clean, and efficient meeting scheduling app",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body
                className={cn(
                    `${geistSans.variable} ${geistMono.variable} antialiased`,
                    "bg-gradient-to-tl from-[#EEEEEE] to-[#EAEFF2]"
                )}
            >
                <SidebarProvider>
                    <AppSidebar />
                    <SidebarInset>
                        <header className="flex h-16 shrink-0 items-center justify-end gap-2 md:hidden">
                            <div className="flex items-center gap-2 px-4">
                                <SidebarTrigger className="-ml-1" />
                            </div>
                        </header>

                        <div className="h-full rounded-tl-xl bg-gray-50">
                            {children}
                        </div>
                    </SidebarInset>
                </SidebarProvider>
            </body>
        </html>
    );
}
