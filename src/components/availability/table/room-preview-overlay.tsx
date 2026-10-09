"use client";

import { Typography } from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import type { RoomPreviewVariant } from "@/components/availability/table/study-room-hover-context";
import { cn } from "@/lib/utils";

interface RoomPreviewOverlayProps {
	title?: string;
	timeRange?: string;
	blockCount: number;
	variant: RoomPreviewVariant;
}

export function RoomPreviewOverlay({
	title,
	timeRange,
	blockCount,
	variant,
}: RoomPreviewOverlayProps) {
	const theme = useTheme();
	const isSelected = variant === "selected";

	return (
		<>
			<div
				aria-hidden="true"
				className={cn(
					"pointer-events-none absolute inset-x-0.5 top-0.5 z-[5] rounded-lg border-2 border-secondary-main dark:border-foreground",
					!isSelected && "border-dashed",
				)}
				style={{
					height: `calc(${blockCount * 100}% - 4px)`,
					backgroundColor: alpha(
						theme.palette.secondary.main,
						isSelected ? 0.18 : 0.08,
					),
				}}
			/>
			{(title || timeRange) && (
				<div
					aria-hidden="true"
					className="pointer-events-none absolute top-1.5 left-1.5 z-[10] flex max-w-[calc(100%-0.75rem)] flex-col overflow-hidden rounded-md bg-secondary-main px-1.5 py-0.5 text-left text-secondary-main-foreground shadow-md"
				>
					{title && (
						<Typography
							variant="caption"
							noWrap
							sx={{ fontWeight: 600, lineHeight: 1.3 }}
						>
							{title}
						</Typography>
					)}
					{timeRange && blockCount > 1 && (
						<Typography variant="caption" noWrap sx={{ lineHeight: 1.2 }}>
							{timeRange}
						</Typography>
					)}
				</div>
			)}
		</>
	);
}
