import { Button } from "@mui/material";
import { GoogleLogo } from "@/components/auth/google-logo";

export function GoogleButton() {
	return (
		<form action="/auth/login/google" method="GET" className="w-full">
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
