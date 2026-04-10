import { Button } from "@mui/material";

export function GoogleButton() {
	return (
		<form action="/auth/login/google" method="GET" className="w-full">
			<Button type="submit" variant="contained" fullWidth>
				Sign in with Google
			</Button>
		</form>
	);
}
