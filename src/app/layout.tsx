import { AppRouterCacheProvider } from "@mui/material-nextjs/v16-appRouter";
import type { Metadata } from "next";
import localFont from "next/font/local";

import "./globals.css";

import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Toaster } from "sonner";
import AppShellWrapper from "@/components/nav/app-shell-wrapper";
import AppThemeProvider from "@/components/theme/theme-provider";
import { cn } from "@/lib/utils";
import { dmSans, montserrat } from "@/theme";

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
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en" className={`${dmSans.className} ${montserrat.className}`}>
			<body
				className={cn(
					`${geistSans.variable} ${geistMono.variable} antialiased`,
				)}
			>
				<NuqsAdapter>
					<AppRouterCacheProvider>
						<AppThemeProvider>
							<AppShellWrapper>
								<div className="h-full rounded-tl-xl">{children}</div>
							</AppShellWrapper>

							<Toaster />
						</AppThemeProvider>
					</AppRouterCacheProvider>
				</NuqsAdapter>
			</body>
		</html>
	);
}
