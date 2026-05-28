import { Button } from "@mui/material";
import { GoogleLogo } from "@/components/auth/google-logo";
import { oauthLoginPath } from "@/lib/auth/return-to";

type GoogleButtonProps = {
	returnTo?: string | null;
};

export function GoogleButton({ returnTo }: GoogleButtonProps = {}) {
	return (
		<Button
			component="a"
			href={oauthLoginPath("google", returnTo)}
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
			Continue with Google
		</Button>
	);
}
