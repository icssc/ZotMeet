"use client";

import CloseIcon from "@mui/icons-material/Close";
import {
	Dialog,
	DialogTitle,
	IconButton,
	useMediaQuery,
	useTheme,
} from "@mui/material";
import { useQueryStates } from "nuqs";
import { Creation, creationSearchParams } from "@/components/creation/creation";
import type { UserProfile } from "@/lib/auth/user";

const clearedCreationParams = Object.fromEntries(
	Object.keys(creationSearchParams).map((key) => [key, null]),
) as { [K in keyof typeof creationSearchParams]: null };

/** Opens on `?create=true`; the form's own state lives in the same URL. */
export function CreateMeetingDialog({ user }: { user: UserProfile }) {
	const theme = useTheme();
	const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
	const [{ create: open }, setParams] = useQueryStates(creationSearchParams);

	const handleClose = () => {
		void setParams(clearedCreationParams);
	};

	return (
		<Dialog
			open={open}
			onClose={handleClose}
			fullScreen={fullScreen}
			fullWidth
			maxWidth="lg"
			aria-labelledby="create-meeting-title"
		>
			<DialogTitle
				id="create-meeting-title"
				variant="h4"
				sx={{ fontWeight: 700, pr: 7 }}
			>
				Create A Meeting
			</DialogTitle>
			<IconButton
				aria-label="Close"
				onClick={handleClose}
				sx={{
					position: "absolute",
					top: (theme) => theme.spacing(2),
					right: (theme) => theme.spacing(2),
				}}
			>
				<CloseIcon />
			</IconButton>
			<Creation user={user} />
		</Dialog>
	);
}
