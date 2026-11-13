import { Image, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SignInButtons } from "@/components/auth/sign-in-buttons";
import { Card } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";

/**
 * Native counterpart to the web app's `/auth/login` page
 * (`src/app/auth/login/page.tsx`): the mascot, the heading, and
 * `SignInButtons` in an outlined paper. Not a route of its own — it is what
 * the Profile tab shows while signed out, since that tab reads "Sign In"
 * then, as on the web.
 */
export function SignIn() {
	const insets = useSafeAreaInsets();

	// Scrolls so the Apple button is reachable on short or landscape screens,
	// where the card is taller than the viewport.
	return (
		<ScrollView
			className="flex-1 bg-background"
			contentContainerClassName="px-4 pb-6"
			contentContainerStyle={{ paddingTop: insets.top + 16 }}
			keyboardShouldPersistTaps="handled"
		>
			<Card className="items-center gap-4 px-6 py-14">
				<Image
					source={require("@/assets/images/mascot.png")}
					accessibilityLabel="mascot"
					style={{ width: 111, height: 111 }}
					resizeMode="contain"
					className="mb-6"
				/>

				<Typography variant="h5" align="center">
					Sign in to ZotMeet
				</Typography>

				<SignInButtons />
			</Card>
		</ScrollView>
	);
}
