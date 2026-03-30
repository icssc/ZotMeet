import "./globals.css";
import { ThemeProvider } from "@mui/material/styles";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v16-appRouter";
import type { Metadata } from "next";

import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Toaster } from "sonner";
import AppShellWrapper from "@/components/nav/app-shell-wrapper";
import { cn } from "@/lib/utils";
import theme, { figtree } from "@/theme";

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
		<html lang="en" className={figtree.className}>
			<body
				className={cn(
					`${figtree.variable} antialiased`,
					"bg-gradient-to-tl from-[#EEEEEE] to-[#EAEFF2]",
				)}
			>
				<NuqsAdapter>
					<AppRouterCacheProvider>
						<ThemeProvider theme={theme}>
							<AppShellWrapper>
								<div className="h-full rounded-tl-xl bg-gray-50">
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
