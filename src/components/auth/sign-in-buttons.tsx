import { Stack } from "@mui/material";
import { AppleButton } from "@/components/auth/apple-button";
import { GoogleButton } from "@/components/auth/google-button";

export function SignInButtons() {
	return (
		<Stack spacing={1.5} className="w-full">
			<GoogleButton />
			<AppleButton />
		</Stack>
	);
}
