import { Box, Dialog, DialogContent, DialogTitle } from "@mui/material";
import { SignInButtons } from "@/components/auth/sign-in-buttons";

export function AuthDialog() {
	return (
		<Dialog open>
			<DialogTitle>Sign In</DialogTitle>
			<DialogContent>
				<Box sx={{ pt: 1, minWidth: 280 }}>
					<SignInButtons useCurrentPath />
				</Box>
			</DialogContent>
		</Dialog>
	);
}
