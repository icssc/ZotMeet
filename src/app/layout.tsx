import { ThemeProvider } from "@mui/material/styles";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v16-appRouter";
import type { Metadata } from "next";
import { DM_Sans, Montserrat } from "next/font/google";
import localFont from "next/font/local";

import "./globals.css";

import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Toaster } from "sonner";
import AppSidebar from "@/components/nav/app-sidebar";
import { Banner } from "@/components/ui/banner";
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import theme from "@/theme";

const montserrat = Montserrat({
	subsets: ["latin"],
	variable: "--font-montserrat",
});

const dmSans = DM_Sans({
	subsets: ["latin"],
	variable: "--font-dm-sans",
});

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
	icons: {
		icon: "/favicon.ico",
	},
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
					`${geistSans.variable} ${geistMono.variable} ${montserrat.variable} ${dmSans.variable} antialiased`,
					"bg-gradient-to-tl from-[#EEEEEE] to-[#EAEFF2]",
				)}
			>
				<NuqsAdapter>
					<AppRouterCacheProvider>
						<ThemeProvider theme={theme}>
							<SidebarProvider>
								<AppSidebar />
								<SidebarInset>
									<header className="flex h-16 shrink-0 items-center justify-end gap-2 border-b border-opacity-50 bg-gray-50 drop-shadow-sm md:hidden">
										<div className="flex items-center gap-2 px-4">
											<SidebarTrigger className="-ml-1" />
										</div>
									</header>

									<div className="h-full rounded-tl-xl bg-gray-50">
										<Banner
											chip="ALPHA"
											storageKey="creation-alpha-banner-dismissed"
											className="mx-4 mt-4"
										>
											ZotMeet is currently in alpha. You may experience bugs or
											unexpected behavior.
										</Banner>
										{children}
									</div>
								</SidebarInset>
							</SidebarProvider>

							<Toaster />
						</ThemeProvider>
					</AppRouterCacheProvider>
				</NuqsAdapter>
			</body>
		</html>
	);
}
