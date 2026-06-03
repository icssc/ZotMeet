import { Alert, Box, Paper, Typography } from "@mui/material";
import { headers } from "next/headers";
import Image from "next/image";
import { SignInButtons } from "@/components/auth/sign-in-buttons";
import { safeReturnTo } from "@/lib/auth/return-to";

type LoginPageProps = {
	searchParams: Promise<{ returnTo?: string; deleted?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
	const { returnTo, deleted } = await searchParams;
	const headersList = await headers();
	const refererReturnTo = safeReturnTo(headersList.get("referer"));
	const resolvedReturnTo = safeReturnTo(returnTo) ?? refererReturnTo;

	return (
		<Box
			sx={{
				minHeight: { xs: "calc(100dvh - 56px)", sm: "calc(100dvh - 64px)" },
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				px: { xs: 2, sm: 3 },
				py: { xs: 2, sm: 3 },
			}}
		>
			<Paper variant="outlined" sx={{ width: "100%", maxWidth: 560 }}>
				<div className="flex flex-col items-center justify-center gap-4 p-10 sm:p-14">
					<div className="mb-6 sm:mb-10">
						<Image src="/mascot.svg" alt="mascot" width={90} height={90} />
					</div>

					<Typography variant="h5" component="h1" textAlign="center">
						Sign in to ZotMeet
					</Typography>
					{deleted === "1" && (
						<Alert severity="success" sx={{ width: "100%" }}>
							Your account and associated data were permanently deleted.
						</Alert>
					)}
					<SignInButtons returnTo={resolvedReturnTo} />
				</div>
			</Paper>
		</Box>
	);
}
