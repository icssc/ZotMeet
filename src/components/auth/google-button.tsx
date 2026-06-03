import { Button } from "@mui/material";
import { GoogleLogo } from "@/components/auth/google-logo";
import { oauthLoginPath } from "@/lib/auth/return-to";

type GoogleButtonProps = {
	returnTo?: string | null;
	selectAccount?: boolean;
};

export function GoogleButton({
	returnTo,
	selectAccount = false,
}: GoogleButtonProps = {}) {
	return (
		<Button
			component="a"
			href={oauthLoginPath("google", returnTo, { selectAccount })}
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
