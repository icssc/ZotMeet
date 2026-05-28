import { Box, Stack, Typography } from "@mui/material";
import { SignInButtons } from "@/components/auth/sign-in-buttons";

type LoginPageProps = {
	searchParams: Promise<{ returnTo?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
	const { returnTo } = await searchParams;

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
				<SignInButtons returnTo={returnTo} />
			</Stack>
		</Box>
	);
}
