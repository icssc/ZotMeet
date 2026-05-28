import { Box, Stack, Typography } from "@mui/material";
import { headers } from "next/headers";
import { SignInButtons } from "@/components/auth/sign-in-buttons";
import { safeReturnTo } from "@/lib/auth/return-to";

type LoginPageProps = {
	searchParams: Promise<{ returnTo?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
	const { returnTo } = await searchParams;
	const headersList = await headers();
	const refererReturnTo = safeReturnTo(headersList.get("referer"));
	const resolvedReturnTo = safeReturnTo(returnTo) ?? refererReturnTo;

	return (
		<Box
			sx={{
				minHeight: "60vh",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				px: 2,
			}}
		>
			<Stack spacing={2} sx={{ width: "100%", maxWidth: 360 }}>
				<Typography variant="h5" component="h1" textAlign="center">
					Sign in to ZotMeet
				</Typography>
				<SignInButtons returnTo={resolvedReturnTo} />
			</Stack>
		</Box>
	);
}
