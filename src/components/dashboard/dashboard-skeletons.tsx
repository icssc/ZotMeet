import { Box } from "@mui/material";
import { SectionCard } from "@/components/dashboard/dashboard-parts";
import { WaveSkeleton } from "@/components/loading/page-skeletons";

/**
 * Placeholders shaped like each dashboard section. `(creation)/loading.tsx`
 * renders all of them; `Dashboard` renders the date-dependent ones until the
 * browser's "today" is known.
 */

const sectionPadding = { xs: 2, sm: 3.75 };

function HeadingSkeleton({ width }: { width: number }) {
	return <WaveSkeleton variant="text" width={width} height={48} />;
}

function RowSkeleton() {
	return (
		<Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
			<WaveSkeleton variant="text" width="45%" height={32} />
			<WaveSkeleton variant="text" width="70%" />
		</Box>
	);
}

export function HeaderSkeleton() {
	return (
		<Box
			sx={{
				display: "flex",
				alignItems: { xs: "stretch", sm: "center" },
				flexDirection: { xs: "column", sm: "row" },
				justifyContent: "space-between",
				gap: 2,
			}}
		>
			<WaveSkeleton variant="text" width="55%" height={64} />
			<WaveSkeleton variant="rounded" width={210} height={42} />
		</Box>
	);
}

export function ActionItemsSkeleton() {
	return (
		<SectionCard
			sx={{
				p: sectionPadding,
				display: "flex",
				flexDirection: "column",
				gap: 1.5,
			}}
		>
			<Box
				sx={{
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
				}}
			>
				<HeadingSkeleton width={240} />
				<WaveSkeleton variant="rounded" width={72} height={32} />
			</Box>
			{Array.from({ length: 3 }, (_, i) => (
				<RowSkeleton key={i} />
			))}
		</SectionCard>
	);
}

export function QuickBookSkeleton() {
	return (
		<SectionCard
			sx={{
				p: sectionPadding,
				display: "flex",
				flexDirection: "column",
				gap: 3,
			}}
		>
			<Box>
				<HeadingSkeleton width={200} />
				<WaveSkeleton variant="text" width="50%" />
			</Box>
			<Box
				sx={{
					display: "grid",
					gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" },
					columnGap: 4.5,
					rowGap: 1.5,
				}}
			>
				{Array.from({ length: 6 }, (_, i) => (
					<WaveSkeleton key={i} variant="rounded" height={85} />
				))}
			</Box>
		</SectionCard>
	);
}

export function CalendarSkeleton() {
	return <WaveSkeleton variant="rounded" height={340} />;
}

export function UpcomingSkeleton() {
	return (
		<SectionCard
			sx={{
				px: 2.5,
				pt: 1.875,
				pb: 3.75,
				display: "flex",
				flexDirection: "column",
				gap: 2,
			}}
		>
			<HeadingSkeleton width={160} />
			{Array.from({ length: 2 }, (_, i) => (
				<RowSkeleton key={i} />
			))}
		</SectionCard>
	);
}

export function RecentRoomsSkeleton() {
	return (
		<SectionCard
			sx={{
				mt: 2,
				px: 2.5,
				py: 3.75,
				display: "flex",
				flexDirection: "column",
				gap: 1.5,
			}}
		>
			<WaveSkeleton variant="text" width="60%" height={32} />
			{Array.from({ length: 2 }, (_, i) => (
				<WaveSkeleton key={i} variant="rounded" height={85} />
			))}
		</SectionCard>
	);
}
