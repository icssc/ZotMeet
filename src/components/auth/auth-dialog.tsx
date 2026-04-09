import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import { GoogleButton } from "@/components/auth/google-button";

export function AuthDialog() {
	return (
		<Dialog open>
			<DialogTitle>Sign In</DialogTitle>
			<DialogContent>
				<GoogleButton />
			</DialogContent>
		</Dialog>
	);
}
