import { ThemeProvider } from "@mui/material/styles";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v16-appRouter";
import type { Metadata } from "next";
import localFont from "next/font/local";

import "./globals.css";

import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Toaster } from "sonner";
import AppShellWrapper from "@/components/nav/app-shell-wrapper";
import { Banner } from "@/components/ui/banner";
import { cn } from "@/lib/utils";
import theme, { dmSans, montserrat } from "@/theme";

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
		<html lang="en" className={`${dmSans.className} ${montserrat.className}`}>
			<body
				className={cn(
					`${geistSans.variable} ${geistMono.variable} antialiased`,
					"bg-gradient-to-tl from-[#EEEEEE] to-[#EAEFF2]",
				)}
			>
				<NuqsAdapter>
					<AppRouterCacheProvider>
						<ThemeProvider theme={theme}>
							<AppShellWrapper>
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
							</AppShellWrapper>

							<Toaster />
						</ThemeProvider>
					</AppRouterCacheProvider>
				</NuqsAdapter>
			</body>
		</html>
	);
}
