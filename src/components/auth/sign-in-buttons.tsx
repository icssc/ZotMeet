"use client";

import { Stack } from "@mui/material";
import { AppleButton } from "@/components/auth/apple-button";
import { GoogleButton } from "@/components/auth/google-button";
import { useReturnToPath } from "@/hooks/use-return-to-path";

type SignInButtonsProps = {
	returnTo?: string | null;
	/** When true, fall back to the current page if `returnTo` is not set. */
	useCurrentPath?: boolean;
};

function SignInButtonStack({ returnTo }: { returnTo?: string | null }) {
	return (
		<Stack spacing={1.5} className="w-full">
			<GoogleButton returnTo={returnTo} />
			<AppleButton returnTo={returnTo} />
		</Stack>
	);
}

function SignInButtonsWithCurrentPath({
	returnTo: returnToProp,
}: {
	returnTo?: string | null;
}) {
	const currentPath = useReturnToPath();
	return <SignInButtonStack returnTo={returnToProp ?? currentPath} />;
}

export function SignInButtons({
	returnTo,
	useCurrentPath = false,
}: SignInButtonsProps = {}) {
	if (useCurrentPath) {
		return <SignInButtonsWithCurrentPath returnTo={returnTo} />;
	}
	return <SignInButtonStack returnTo={returnTo} />;
}
