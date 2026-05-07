"use client";

import { Box } from "@mui/material";
import {
	FilterChipSkeletonRow,
	SkeletonGrid,
	SummaryMeetingCardSkeleton,
	WaveSkeleton,
} from "@/components/loading/page-skeletons";

export default function Loading() {
	return (
		<div className="px-4 py-8 sm:px-8">
			<Box sx={{ width: "100%" }}>
				<Box
					sx={{
						display: "flex",
						alignItems: "flex-start",
						justifyContent: "space-between",
						mb: 2,
						gap: 2,
					}}
				>
					<Box
						sx={{ display: "flex", flexDirection: "column", gap: 1.5, flex: 1 }}
					>
						<WaveSkeleton variant="rounded" width={220} height={40} />
						<FilterChipSkeletonRow chipWidths={[72, 118, 100, 82]} />
					</Box>
					<WaveSkeleton
						variant="rounded"
						width={170}
						height={36}
						sx={{ display: { xs: "none", md: "block" } }}
					/>
				</Box>

				<SkeletonGrid
					count={6}
					keyPrefix="summary-skeleton"
					renderItem={() => <SummaryMeetingCardSkeleton />}
					gridSx={{
						display: { xs: "flex", sm: "grid" },
						flexDirection: "column",
						gridTemplateColumns: { sm: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" },
						gap: { xs: 1.5, sm: 2 },
					}}
				/>
			</Box>
		</div>
	);
}
