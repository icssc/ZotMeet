import * as Linking from "expo-linking";
import { useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Typography } from "@/components/ui/typography";
import { isOAuthCallbackUrl } from "@/lib/auth/handle-oauth-callback";
import { useAuthStore } from "@/store/useAuthStore";

/**
 * Route: `/auth/login/google/callback` — the app-side twin of the web app's
 * `src/app/auth/login/google/callback/route.tsx`, reached when the callback
 * link is opened as a deep link rather than caught by the in-app browser:
 * on Android, where the link can relaunch the app, and in the Expo web
 * preview, where it lands in the sign-in popup. Everything it does is in
 * `completeSignIn`; this screen exists so the link has somewhere to go.
 *
 * Deliberately not the sign-in screen: this route can only be reached with
 * a code in hand, so it shows a spinner and then hands off to the tabs.
 */
export default function GoogleCallbackScreen() {
	const router = useRouter();
	const insets = useSafeAreaInsets();
	const completeSignIn = useAuthStore((state) => state.completeSignIn);
	const status = useAuthStore((state) => state.status);
	const error = useAuthStore((state) => state.error);
	// The raw link, query and all — the router's params would do, but the
	// handler takes the same URL `openAuthSessionAsync` returns, so both
	// arrivals go through one code path (and one de-duplication).
	const url = Linking.useURL();

	useEffect(() => {
		// In the web preview the link opened in a popup; this hands the URL to
		// the `openAuthSessionAsync` that opened it and closes the popup. On
		// native it reports "not supported" and the link is completed here.
		if (WebBrowser.maybeCompleteAuthSession().type === "success") return;

		if (url && isOAuthCallbackUrl(url)) {
			completeSignIn(url);
		}
	}, [url, completeSignIn]);

	useEffect(() => {
		if (status === "signedIn" || error !== null) {
			router.replace("/profile");
		}
	}, [status, error, router]);

	return (
		<View
			className="flex-1 items-center justify-center gap-4 bg-background"
			style={{ paddingTop: insets.top }}
		>
			<ActivityIndicator />
			<Typography color="textSecondary">Signing you in…</Typography>
		</View>
	);
}
