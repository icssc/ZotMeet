import { Button } from "@mui/material";
import { GoogleLogo } from "@/components/auth/google-logo";
import { oauthLoginPath } from "@/lib/auth/return-to";

type GoogleButtonProps = {
	returnTo?: string | null;
};

export function GoogleButton({ returnTo }: GoogleButtonProps = {}) {
	return (
		<form
			action={oauthLoginPath("google", returnTo)}
			method="GET"
			className="w-full"
		>
			<Button
				type="submit"
				variant="outlined"
				fullWidth
				startIcon={<GoogleLogo />}
				sx={{
					boxShadow: "none",
					"&:hover": {
						boxShadow: "none",
						transform: "none",
					},
					"&:active": {
						transform: "none",
						boxShadow: "none",
					},
				}}
			>
				Sign in with Google
			</Button>
		</form>
	);
}
