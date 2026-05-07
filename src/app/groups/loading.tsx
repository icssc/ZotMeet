"use client";

import { Box, Divider } from "@mui/material";
import {
	FilterChipSkeletonRow,
	GroupCardSkeleton,
	SkeletonGrid,
	WaveSkeleton,
} from "@/components/loading/page-skeletons";

export default function Loading() {
	return (
		<div className="px-4 py-8 sm:px-8">
			<Box sx={{ width: "100%" }}>
				<Box
					sx={{
						display: { xs: "block", sm: "flex" },
						alignItems: "center",
						gap: 1.5,
					}}
				>
					<WaveSkeleton
						variant="rounded"
						width={240}
						height={42}
						sx={{ borderRadius: 99 }}
					/>

					<Box
						sx={{
							ml: "auto",
							display: { xs: "none", sm: "flex" },
							alignItems: "center",
							gap: 1,
						}}
					>
						<WaveSkeleton variant="rounded" width={118} height={36} />
						<WaveSkeleton variant="rounded" width={132} height={36} />
					</Box>
				</Box>

				<Divider sx={{ mt: 2 }} />

				<Box sx={{ mt: 2 }}>
					<FilterChipSkeletonRow chipWidths={[68, 84, 98]} />
				</Box>

				<Box sx={{ mt: 4 }}>
					<WaveSkeleton variant="text" width={90} height={26} />
					<SkeletonGrid
						count={6}
						keyPrefix="group-skeleton"
						renderItem={() => <GroupCardSkeleton />}
						gridSx={{
							display: "grid",
							gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" },
							gap: { xs: 0.75, sm: 4 },
						}}
					/>
				</Box>
			</Box>
		</div>
	);
}
