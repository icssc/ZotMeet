import { View } from "react-native";
import { AppleButton } from "@/components/auth/apple-button";
import { GoogleButton } from "@/components/auth/google-button";
import { Card } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import { useAuthStore } from "@/store/useAuthStore";

/**
 * Native counterpart to the web app's `SignInButtons`: the two provider
 * buttons in an outlined paper. The web's `returnTo` has no equivalent —
 * there is nowhere to go back to but the tab that opened this — and the
 * sign-in error the web shows on its own page is rendered here instead,
 * since this is the only place a native sign-in can fail visibly.
 */
export function SignInButtons() {
	const error = useAuthStore((state) => state.error);

	return (
		<View className="w-full max-w-80 items-center gap-4">
			<Card className="w-full gap-2 p-3">
				<GoogleButton />
				<AppleButton />
			</Card>
			{error ? (
				<Typography variant="body2" color="error" align="center">
					{error}
				</Typography>
			) : null}
		</View>
	);
}
