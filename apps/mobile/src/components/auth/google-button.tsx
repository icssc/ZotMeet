import { GoogleLogo } from "@/components/auth/google-logo";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import { useAuthStore } from "@/store/useAuthStore";

/**
 * Native counterpart to the web app's `GoogleButton`. The web one is a link
 * to `/auth/login/google`; here pressing runs the whole native flow
 * (`useAuthStore().signIn`), which opens that same route in an in-app
 * browser. Same outlined look, and `flat` for the web's `boxShadow: none`.
 */
export function GoogleButton() {
	const signIn = useAuthStore((state) => state.signIn);

	return (
		<Button
			variant="outlined"
			color="inherit"
			size="large"
			flat
			onPress={() => signIn("google")}
		>
			<GoogleLogo />
			<Typography variant="button">Continue with Google</Typography>
		</Button>
	);
}
