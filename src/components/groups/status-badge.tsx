import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import { Box } from "@mui/material";
import { alpha } from "@mui/material/styles";

export function StatusBadge({
	status,
}: {
	status: "actionRequired" | "upcoming" | null;
}) {
	const isAction = status === "actionRequired";

	return (
		<Box
			sx={(theme) => ({
				display: "inline-flex",
				alignItems: "center",
				gap: 0.5,
				px: 1.25,
				py: 0.5,
				borderRadius: 2,
				fontSize: "0.75rem",
				fontWeight: 700,
				lineHeight: 1,
				bgcolor: isAction
					? alpha(theme.palette.error.main, 0.14)
					: alpha(theme.palette.success.main, 0.14),
				color: isAction ? "error.main" : "success.main",
			})}
		>
			{isAction ? (
				<ErrorOutlineIcon sx={{ fontSize: 16, color: "error.main" }} />
			) : (
				<EventAvailableIcon sx={{ fontSize: 16, color: "success.main" }} />
			)}
			{isAction ? "Action Required" : "Upcoming"}
		</Box>
	);
}
