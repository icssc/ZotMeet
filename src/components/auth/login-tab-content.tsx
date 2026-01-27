import { GoogleButton } from "@/components/auth/google-button";
import LoginTabFormContent from "@/components/auth/login-tab-form-content";
import {
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

export default function LoginTabContent() {
	return (
		<div className="space-y-4">
			<DialogHeader>
				<DialogTitle className="text-2xl">Login</DialogTitle>
				<DialogDescription>
					Enter your email below to login to your account
				</DialogDescription>
			</DialogHeader>

			<GoogleButton />
			<Separator />

			<LoginTabFormContent />
		</div>
	);
}
