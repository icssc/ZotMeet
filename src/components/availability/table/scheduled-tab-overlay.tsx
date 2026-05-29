"use client";

import { Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";

interface ScheduledTabOverlayProps {
	title?: string;
	timeRange?: string;
	blockCount: number;
}

/** Navy tab + white label — matches scheduled meeting blocks on main. */
export function ScheduledTabOverlay({
	title,
	timeRange,
	blockCount,
}: ScheduledTabOverlayProps) {
	const theme = useTheme();

	return (
		<>
			<div
				aria-hidden="true"
				className="pointer-events-none absolute inset-0 z-[5] w-[87%] rounded-r-xl bg-[#1F2A44] shadow-2xl shadow-inner"
				style={{ height: `${blockCount * 100}%` }}
			/>
			{(title || timeRange) && (
				<div
					aria-hidden="true"
					className="pointer-events-none absolute inset-x-0 top-0 z-[10] flex w-[87%] flex-col overflow-hidden p-1.5"
					style={{ height: `calc(${blockCount} * 100%)` }}
				>
					{title && (
						<Typography
							variant="body1"
							sx={{
								display: "-webkit-box",
								WebkitLineClamp: 3,
								WebkitBoxOrient: "vertical",
								overflow: "hidden",
								lineHeight: 1.2,
								letterSpacing: "0.15px",
								color: theme.palette.common.white,
							}}
						>
							{title}
						</Typography>
					)}
					{timeRange && (
						<Typography
							variant="caption"
							noWrap
							sx={{
								fontWeight: 500,
								lineHeight: 1,
								letterSpacing: "0.4px",
								color: theme.palette.common.white,
								margin: 1,
							}}
						>
							{timeRange}
						</Typography>
					)}
				</div>
			)}
		</>
	);
}
