import { GoogleButton } from "@/components/auth/google-button";
import {
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

import SignupTabFormContent from "./signup-tab-form-content";

export default function SignupTabContent() {
	return (
		<div className="space-y-4">
			<DialogHeader>
				<DialogTitle className="text-2xl">Sign up</DialogTitle>
				<DialogDescription>
					Enter your information below to sign up for an account
				</DialogDescription>
			</DialogHeader>

			<GoogleButton />
			<Separator />

			<SignupTabFormContent />
		</div>
	);
}
