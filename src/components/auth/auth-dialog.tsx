import { GoogleButton } from "@/components/auth/google-button";
import { Dialog } from "@/components/ui/dialog";
import { Tabs } from "@/components/ui/tabs";

export function AuthDialog() {
	return (
		<Dialog>
			<Tabs defaultValue="login">
				<GoogleButton />
			</Tabs>
		</Dialog>
	);
}
