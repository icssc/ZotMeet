"use client";

import { Box } from "@mui/material";
import { WaveSkeleton } from "@/components/loading/page-skeletons";

export default function Loading() {
	return (
		<div className="mx-auto my-6 flex w-full max-w-6xl flex-col gap-y-6 px-0 md:my-8 md:w-[calc(100%-2rem)] md:rounded-xl md:border md:border-gray-300 md:px-4">
			<div className="w-full px-2 py-6 md:px-14">
				<Box sx={{ display: { xs: "none", sm: "block" } }}>
					<WaveSkeleton variant="text" width="52%" height={52} />
					<WaveSkeleton variant="text" width="42%" height={24} />
				</Box>
				<Box sx={{ display: { xs: "block", sm: "none" }, mb: 3 }}>
					<WaveSkeleton
						variant="text"
						width={210}
						height={48}
						sx={{ mx: "auto" }}
					/>
				</Box>

				<Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
					<WaveSkeleton variant="rounded" width="100%" height={56} />

					<Box
						sx={{
							display: "grid",
							gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
							gap: { xs: 3, md: 4 },
						}}
					>
						<Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
							<WaveSkeleton variant="rounded" width="100%" height={136} />
							<WaveSkeleton variant="rounded" width="100%" height={88} />
						</Box>

						<WaveSkeleton variant="rounded" width="100%" height={330} />
					</Box>
				</Box>

				<Box
					sx={{
						mt: 6,
						display: "flex",
						justifyContent: { xs: "center", md: "flex-end" },
					}}
				>
					<WaveSkeleton
						variant="rounded"
						width={170}
						height={40}
						sx={{
							maxWidth: { xs: "100%", md: "none" },
							width: { xs: "100%", md: 170 },
						}}
					/>
				</Box>
			</div>
		</div>
	);
}
