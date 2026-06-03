"use client";

import { Paper, Typography } from "@mui/material";
import { AppleButton } from "@/components/auth/apple-button";
import { GoogleButton } from "@/components/auth/google-button";
import { useReturnToPath } from "@/hooks/use-return-to-path";

type SignInButtonsProps = {
	returnTo?: string | null;
	/** When true, fall back to the current page if `returnTo` is not set. */
	useCurrentPath?: boolean;
	/** Show Google/Apple account picker (e.g. after account deletion). */
	selectAccount?: boolean;
};

function SignInButtonStack({
	returnTo,
	selectAccount = false,
}: {
	returnTo?: string | null;
	selectAccount?: boolean;
}) {
	return (
		<div className="flex w-full max-w-80 flex-col items-center gap-4">
			<Paper
				variant="outlined"
				sx={{
					width: "100%",
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					gap: 1,
					p: 1.5,
				}}
			>
				<GoogleButton returnTo={returnTo} selectAccount={selectAccount} />
				<Typography variant="caption" color="textSecondary">
					Auto import your Google Calendar
				</Typography>
			</Paper>
			<Typography variant="caption" color="textSecondary">
				or
			</Typography>

			<div className="w-full">
				<AppleButton returnTo={returnTo} selectAccount={selectAccount} />
			</div>
		</div>
	);
}

function SignInButtonsWithCurrentPath({
	returnTo: returnToProp,
	selectAccount = false,
}: {
	returnTo?: string | null;
	selectAccount?: boolean;
}) {
	const currentPath = useReturnToPath();
	return (
		<SignInButtonStack
			returnTo={returnToProp ?? currentPath}
			selectAccount={selectAccount}
		/>
	);
}

export function SignInButtons({
	returnTo,
	useCurrentPath = false,
	selectAccount = false,
}: SignInButtonsProps = {}) {
	if (useCurrentPath) {
		return (
			<SignInButtonsWithCurrentPath
				returnTo={returnTo}
				selectAccount={selectAccount}
			/>
		);
	}
	return (
		<SignInButtonStack returnTo={returnTo} selectAccount={selectAccount} />
	);
}
