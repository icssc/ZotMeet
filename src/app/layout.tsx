import "./globals.css";
import { getUserThemeMode } from "@actions/user/action";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v16-appRouter";
import type { Metadata } from "next";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Toaster } from "sonner";
import AppShellWrapper from "@/components/nav/app-shell-wrapper";
import AppThemeProvider from "@/components/theme/theme-provider";
import { cn } from "@/lib/utils";
import { figtree } from "@/theme";

export const metadata: Metadata = {
	title: "ZotMeet | Create a Meeting",
	description: "ZotMeet: Simple, clean, and efficient meeting scheduling app",
	icons: {
		icon: "/favicon.ico",
	},
};

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	// Fetch the preference on the server
	const initialMode = await getUserThemeMode();

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
						<AppThemeProvider initialMode={initialMode}>
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
