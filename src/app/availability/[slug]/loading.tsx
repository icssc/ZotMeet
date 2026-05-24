"use client";

import { Box, Paper } from "@mui/material";
import { WaveSkeleton } from "@/components/loading/page-skeletons";

const DATE_COLUMNS = 5;
const MOBILE_DATE_COLUMNS = 2;
const GRID_BODY_MIN_HEIGHT = 420;
const HOUR_LABEL_COUNT = 8;

function MetadataRowSkeleton({
	width,
	hideOnMobile = false,
}: {
	width: number;
	hideOnMobile?: boolean;
}) {
	return (
		<Box
			sx={{
				display: "flex",
				alignItems: "center",
				gap: 1,
				...(hideOnMobile && { display: { xs: "none", sm: "flex" } }),
			}}
		>
			<WaveSkeleton variant="circular" width={20} height={20} />
			<WaveSkeleton variant="text" width={width} height={20} />
		</Box>
	);
}

function DayHeaderCellSkeleton({
	hiddenOnMobile,
}: {
	hiddenOnMobile?: boolean;
}) {
	return (
		<Box
			sx={{
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "center",
				gap: 0.5,
				py: 1,
				borderColor: "divider",
				borderRightWidth: 1,
				borderRightStyle: "solid",
				...(hiddenOnMobile && {
					display: { xs: "none", lg: "flex" },
				}),
			}}
		>
			<WaveSkeleton variant="text" width={32} height={16} />
			<WaveSkeleton variant="text" width={40} height={20} />
		</Box>
	);
}

function AvailabilityGridSkeleton() {
	return (
		<Box
			sx={{
				width: "100%",
				border: 1,
				borderColor: "divider",
				borderRadius: 1,
				overflow: "hidden",
				bgcolor: "background.paper",
			}}
		>
			<Box
				sx={{
					display: "grid",
					gridTemplateColumns: {
						xs: `40px repeat(${MOBILE_DATE_COLUMNS}, minmax(0, 1fr)) 28px`,
						lg: `64px repeat(${DATE_COLUMNS}, minmax(0, 1fr)) 32px`,
					},
					borderBottom: 1,
					borderColor: "divider",
				}}
			>
				<Box sx={{ borderRight: 1, borderColor: "divider" }} />
				{Array.from({ length: DATE_COLUMNS }).map((_, index) => (
					<DayHeaderCellSkeleton
						key={`day-header-${index}`}
						hiddenOnMobile={index >= MOBILE_DATE_COLUMNS}
					/>
				))}
				<Box
					sx={{
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
					}}
				>
					<WaveSkeleton variant="circular" width={24} height={24} />
				</Box>
			</Box>

			<Box
				sx={{
					display: "grid",
					gridTemplateColumns: {
						xs: `40px repeat(${MOBILE_DATE_COLUMNS}, minmax(0, 1fr))`,
						lg: `64px repeat(${DATE_COLUMNS}, minmax(0, 1fr))`,
					},
					minHeight: GRID_BODY_MIN_HEIGHT,
					position: "relative",
				}}
			>
				<Box
					sx={{
						borderRight: 1,
						borderColor: "divider",
						display: "flex",
						flexDirection: "column",
						justifyContent: "space-between",
						py: 1.5,
						pr: 1,
					}}
				>
					{Array.from({ length: HOUR_LABEL_COUNT }).map((_, index) => (
						<WaveSkeleton
							key={`hour-label-${index}`}
							variant="text"
							width={36}
							height={14}
							sx={{ alignSelf: "flex-end" }}
						/>
					))}
				</Box>

				{Array.from({ length: DATE_COLUMNS }).map((_, colIndex) => (
					<Box
						key={`grid-column-${colIndex}`}
						sx={{
							borderRight: 1,
							borderColor: "divider",
							display: {
								xs: colIndex < MOBILE_DATE_COLUMNS ? "block" : "none",
								lg: "block",
							},
						}}
					/>
				))}

				<WaveSkeleton
					variant="rectangular"
					sx={{
						position: "absolute",
						top: 0,
						bottom: 0,
						left: { xs: 40, lg: 64 },
						right: 0,
						height: "100%",
						borderRadius: 0,
						opacity: 0.35,
					}}
				/>
			</Box>
		</Box>
	);
}

function ResponderChipSkeleton({ width }: { width: number }) {
	return (
		<Box
			sx={{
				display: "flex",
				alignItems: "center",
				gap: 0.75,
				border: 1,
				borderColor: "divider",
				borderRadius: 99,
				px: 0.5,
				py: 0.25,
				width,
				height: 32,
			}}
		>
			<WaveSkeleton variant="circular" width={24} height={24} />
			<WaveSkeleton variant="text" width={width - 48} height={18} />
		</Box>
	);
}

function SidebarActionsSkeleton() {
	return (
		<Box sx={{ display: "flex", flexDirection: "column", gap: 1.25 }}>
			<Box
				sx={{
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
					border: 1,
					borderColor: "divider",
					borderRadius: 1,
					px: 1.5,
					py: 1,
				}}
			>
				<WaveSkeleton variant="text" width="72%" height={22} />
				<WaveSkeleton
					variant="rounded"
					width={44}
					height={26}
					sx={{ borderRadius: 99 }}
				/>
			</Box>

			{Array.from({ length: 4 }).map((_, index) => (
				<WaveSkeleton
					key={`action-button-${index}`}
					variant="rounded"
					width="100%"
					height={40}
					sx={{ borderRadius: 1 }}
				/>
			))}
		</Box>
	);
}

function GroupResponsesPanelSkeleton() {
	return (
		<Box
			sx={{
				display: "flex",
				flexDirection: "column",
				gap: 2.5,
				p: 2,
				minHeight: "24rem",
			}}
		>
			<Box>
				<WaveSkeleton variant="text" width={100} height={28} />
				<WaveSkeleton
					variant="text"
					width="75%"
					height={18}
					sx={{ mt: 0.75 }}
				/>
			</Box>

			<Box>
				<WaveSkeleton variant="text" width={120} height={28} />
				<WaveSkeleton
					variant="text"
					width="90%"
					height={18}
					sx={{ mt: 0.75 }}
				/>
				<Box sx={{ display: "flex", alignItems: "center", gap: 1.25, mt: 1.5 }}>
					<WaveSkeleton
						variant="rounded"
						width={44}
						height={26}
						sx={{ borderRadius: 99 }}
					/>
					<WaveSkeleton variant="text" width={88} height={22} />
				</Box>
			</Box>

			<Box>
				<WaveSkeleton variant="text" width={130} height={30} />
				<WaveSkeleton variant="text" width={110} height={18} sx={{ mt: 0.5 }} />
				<Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1.5 }}>
					<ResponderChipSkeleton width={108} />
				</Box>
				<Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1.5 }}>
					<WaveSkeleton variant="text" width={108} height={20} />
				</Box>
			</Box>

			<Box>
				<Box
					sx={{
						display: "flex",
						alignItems: "center",
						justifyContent: "space-between",
						gap: 1,
					}}
				>
					<WaveSkeleton variant="text" width={170} height={28} />
					<WaveSkeleton
						variant="rounded"
						width={88}
						height={32}
						sx={{ borderRadius: 1 }}
					/>
				</Box>
				<WaveSkeleton
					variant="text"
					width="85%"
					height={18}
					sx={{ mt: 0.75 }}
				/>
				<Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1.5 }}>
					<ResponderChipSkeleton width={156} />
					<ResponderChipSkeleton width={124} />
				</Box>
			</Box>
		</Box>
	);
}

function RoomRecommendationSkeleton() {
	return (
		<Box
			sx={{
				border: 1,
				borderColor: "divider",
				borderRadius: 2,
				bgcolor: "background.paper",
				px: 2,
				py: 1.75,
			}}
		>
			<Box
				sx={{
					display: "flex",
					alignItems: "flex-start",
					justifyContent: "space-between",
					gap: 1,
				}}
			>
				<Box sx={{ flex: 1 }}>
					<WaveSkeleton variant="text" width="78%" height={28} />
					<WaveSkeleton
						variant="text"
						width="95%"
						height={18}
						sx={{ mt: 0.75 }}
					/>
					<WaveSkeleton variant="text" width="70%" height={18} />
				</Box>
				<WaveSkeleton variant="circular" width={20} height={20} />
			</Box>
		</Box>
	);
}

export default function Loading() {
	return (
		<div className="space-y-2 px-4 pb-20">
			<div className="flex min-h-[80vh] flex-col gap-6">
				<div className="mt-2">
					<Box sx={{ display: { xs: "flex", sm: "none" }, mb: 1 }}>
						<WaveSkeleton variant="text" width={90} height={36} />
					</Box>

					<Paper variant="outlined" className="mt-2 p-4">
						<Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
							<Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
								<WaveSkeleton variant="text" width="42%" height={36} />
								<WaveSkeleton
									variant="circular"
									width={28}
									height={28}
									sx={{ display: { xs: "none", sm: "block" } }}
								/>
							</Box>
							<Box sx={{ display: "flex", flexWrap: "wrap", gap: 2.5 }}>
								<MetadataRowSkeleton width={120} />
								<MetadataRowSkeleton width={110} />
								<MetadataRowSkeleton width={100} hideOnMobile />
							</Box>
						</Box>
					</Paper>
				</div>

				<div className="flex min-h-0 w-full min-w-0 flex-1 flex-row items-stretch justify-start">
					<Paper
						variant="outlined"
						className="flex min-h-0 min-w-0 flex-1 flex-col self-stretch lg:mr-4 lg:pr-14"
					>
						<Box
							sx={{
								display: "flex",
								flexDirection: "column",
								gap: 2,
								p: { xs: 1.5, sm: 2 },
							}}
						>
							<Box
								sx={{
									display: { xs: "flex", lg: "none" },
									flexDirection: "column",
									gap: 1,
								}}
							>
								<WaveSkeleton
									variant="rounded"
									width="100%"
									height={40}
									sx={{ borderRadius: 1 }}
								/>
								<WaveSkeleton
									variant="rounded"
									width="100%"
									height={40}
									sx={{ borderRadius: 1 }}
								/>
							</Box>

							<AvailabilityGridSkeleton />

							<Box
								sx={{
									display: "flex",
									alignItems: "center",
									gap: 1.5,
									pl: { xs: 5, md: 7 },
									flexWrap: "wrap",
								}}
							>
								<WaveSkeleton variant="text" width={128} height={20} />
								<WaveSkeleton
									variant="rounded"
									width={280}
									height={40}
									sx={{ borderRadius: 1 }}
								/>
							</Box>
						</Box>
					</Paper>

					<Box
						sx={{
							display: { xs: "none", lg: "flex" },
							width: 384,
							minWidth: 0,
							flexShrink: 0,
							flexDirection: "column",
							gap: 1.5,
						}}
					>
						<SidebarActionsSkeleton />

						<Paper
							variant="outlined"
							sx={{
								display: "flex",
								minWidth: 0,
								flex: 1,
								flexDirection: "column",
								overflow: "hidden",
							}}
						>
							<GroupResponsesPanelSkeleton />
						</Paper>

						<RoomRecommendationSkeleton />
					</Box>
				</div>
			</div>
		</div>
	);
}
