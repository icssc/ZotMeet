"use client";

import { Box, Skeleton, type SxProps, type Theme } from "@mui/material";
import type React from "react";

const cardShellSx: SxProps<Theme> = {
	border: "1px solid",
	borderColor: "divider",
	borderRadius: 2,
	p: 2,
	display: "flex",
	flexDirection: "column",
	gap: 1.25,
	bgcolor: "background.paper",
};

export const WaveSkeleton = (props: React.ComponentProps<typeof Skeleton>) => (
	<Skeleton animation="wave" {...props} />
);

export const FilterChipSkeletonRow = ({
	chipWidths,
}: {
	chipWidths: number[];
}) => (
	<Box sx={{ display: "flex", gap: 0.75, flexWrap: "wrap" }}>
		{chipWidths.map((width, index) => (
			<WaveSkeleton
				key={`chip-skeleton-${index}`}
				variant="rounded"
				width={width}
				height={30}
			/>
		))}
	</Box>
);

export const SummaryMeetingCardSkeleton = () => (
	<Box sx={cardShellSx}>
		<WaveSkeleton variant="text" width="55%" height={30} />
		<WaveSkeleton variant="text" width="35%" />
		<WaveSkeleton variant="rounded" width="100%" height={58} />
		<Box sx={{ display: "flex", justifyContent: "space-between", pt: 0.5 }}>
			<WaveSkeleton variant="text" width={90} />
			<WaveSkeleton variant="text" width={70} />
		</Box>
	</Box>
);

export const GroupCardSkeleton = () => (
	<Box sx={cardShellSx}>
		<WaveSkeleton variant="text" width="55%" height={32} />
		<WaveSkeleton variant="text" width="85%" />
		<WaveSkeleton variant="text" width="70%" />
		<WaveSkeleton variant="rounded" width="100%" height={34} />
	</Box>
);

export const SkeletonGrid = ({
	count,
	gridSx,
	renderItem,
	keyPrefix,
}: {
	count: number;
	gridSx: SxProps<Theme>;
	renderItem: () => React.ReactNode;
	keyPrefix: string;
}) => (
	<Box sx={gridSx}>
		{Array.from({ length: count }).map((_, index) => (
			<Box key={`${keyPrefix}-${index}`}>{renderItem()}</Box>
		))}
	</Box>
);
