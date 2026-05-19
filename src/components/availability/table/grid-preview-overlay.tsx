"use client";

import { Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import type { SelectionEdges } from "@/components/availability/group-availability";

interface GridPreviewOverlayProps {
	edges: SelectionEdges;
	title?: string;
	timeRange?: string;
	blockCount?: number;
	/** When true, renders the title/time label spanning `blockCount` rows (top-edge cells only). */
	showTopLabel?: boolean;
}

export function GridPreviewOverlay({
	edges,
	title,
	timeRange,
	blockCount = 1,
	showTopLabel = false,
}: GridPreviewOverlayProps) {
	const theme = useTheme();
	const dashColor = theme.palette.secondary.main;

	return (
		<>
			<svg
				aria-hidden="true"
				className="pointer-events-none absolute inset-0 z-[5]"
				width="100%"
				height="100%"
				overflow="visible"
			>
				<line
					x1="1"
					y1="0"
					x2="1"
					y2="100%"
					stroke={dashColor}
					strokeWidth="2"
					strokeDasharray="12 6"
				/>
				<line
					x1="calc(100% - 1px)"
					y1="0"
					x2="calc(100% - 1px)"
					y2="100%"
					stroke={dashColor}
					strokeWidth="2"
					strokeDasharray="12 6"
				/>
				{edges.top && (
					<line
						x1="0"
						y1="1"
						x2="100%"
						y2="1"
						stroke={dashColor}
						strokeWidth="2"
						strokeDasharray="12 6"
					/>
				)}
				{edges.bottom && (
					<line
						x1="0"
						y1="calc(100% - 1px)"
						x2="100%"
						y2="calc(100% - 1px)"
						stroke={dashColor}
						strokeWidth="2"
						strokeDasharray="12 6"
					/>
				)}
			</svg>
			{showTopLabel && (title || timeRange) && (
				<div
					aria-hidden="true"
					className="pointer-events-none absolute inset-x-0 top-0 z-[10] flex flex-col justify-between overflow-hidden p-1.5"
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
