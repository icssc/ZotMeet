import "./globals.css";
import { getUserThemeMode } from "@actions/user/action";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v16-appRouter";
import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import AppShellWrapper from "@/components/nav/app-shell-wrapper";
import AppThemeProvider from "@/components/theme/theme-provider";
import { SnackbarProvider } from "@/components/ui/snackbar-provider";
import { figtree } from "@/fonts";
import {
	APP_DESCRIPTION,
	APP_NAME,
	APP_URL,
	BRAND_ACCENT_HEX,
} from "@/lib/pwa-config.mjs";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
	metadataBase: new URL(APP_URL),
	applicationName: APP_NAME,
	title: {
		default: APP_NAME,
		template: `%s · ${APP_NAME}`,
	},
	description: APP_DESCRIPTION,
	manifest: "/manifest.webmanifest",
	icons: {
		icon: [
			{ url: "/icons/favicon-16.png", sizes: "16x16", type: "image/png" },
			{ url: "/icons/favicon-32.png", sizes: "32x32", type: "image/png" },
			{ url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
			{ url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
		],
		shortcut: ["/icons/favicon-32.png"],
		apple: [
			{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
		],
	},
	appleWebApp: {
		capable: true,
		title: APP_NAME,
		statusBarStyle: "black-translucent",
		// `startupImage` intentionally omitted: it expects per-device launch
		// images, not the 180x180 touch icon. iOS will fall back to a blank
		// screen tinted with the manifest's `background_color`.
	},
	formatDetection: {
		telephone: false,
		email: false,
		address: false,
	},
	openGraph: {
		type: "website",
		siteName: APP_NAME,
		title: APP_NAME,
		description: APP_DESCRIPTION,
		url: APP_URL,
		images: [
			{ url: "/icons/icon-512.png", width: 512, height: 512, alt: APP_NAME },
		],
	},
	twitter: {
		card: "summary",
		title: APP_NAME,
		description: APP_DESCRIPTION,
		images: ["/icons/icon-512.png"],
	},
};

// Aligned with the manifest's `theme_color` so the iOS standalone status bar
// and the Android home-screen chrome show the same brand color.
export const viewport: Viewport = {
	themeColor: BRAND_ACCENT_HEX,
	width: "device-width",
	initialScale: 1,
	maximumScale: 5,
	viewportFit: "cover",
};

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	// Fetch the preference on the server
	const initialMode = await getUserThemeMode();

	return (
		<html
			lang="en"
			className={cn(figtree.className, initialMode === "dark" && "dark")}
		>
			{/* TODO: Standardize CSS classes for light and dark mode ^ */}
			<body
				className={cn(
					`${figtree.variable} antialiased`,
					"bg-gradient-to-tl from-[#EEEEEE] to-[#EAEFF2]",
				)}
			>
				<NuqsAdapter>
					<AppRouterCacheProvider>
						<AppThemeProvider initialMode={initialMode}>
							<SnackbarProvider>
								<AppShellWrapper>
									<div className="h-full rounded-tl-xl">{children}</div>
								</AppShellWrapper>
							</SnackbarProvider>
						</AppThemeProvider>
					</AppRouterCacheProvider>
				</NuqsAdapter>
				{process.env.NODE_ENV === "production" ||
				process.env.NEXT_PUBLIC_ENABLE_SW === "true" ? (
					<>
						{/* Inline register runs even if sw-register.js is slow to load. */}
						<Script id="zotmeet-sw-inline" strategy="beforeInteractive">
							{`if("serviceWorker"in navigator){navigator.serviceWorker.register("/sw.js",{scope:"/"})}`}
						</Script>
						<Script
							id="zotmeet-sw-register"
							src="/sw-register.js"
							strategy="beforeInteractive"
						/>
					</>
				) : null}
			</body>
		</html>
	);
}
