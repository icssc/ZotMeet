import { GoogleButton } from "@/components/auth/google-button";
import { Dialog } from "@/components/ui/dialog";

export function AuthDialog() {
	return (
		<Dialog>
			<GoogleButton />
		</Dialog>
	);
}
