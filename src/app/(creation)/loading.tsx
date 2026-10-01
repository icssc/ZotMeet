"use client";

import { DashboardLayout } from "@/components/dashboard/dashboard-parts";
import {
	ActionItemsSkeleton,
	CalendarSkeleton,
	HeaderSkeleton,
	QuickBookSkeleton,
	RecentRoomsSkeleton,
	UpcomingSkeleton,
} from "@/components/dashboard/dashboard-skeletons";

export default function Loading() {
	return (
		<DashboardLayout
			main={
				<>
					<HeaderSkeleton />
					<ActionItemsSkeleton />
					<QuickBookSkeleton />
				</>
			}
			rail={
				<>
					<CalendarSkeleton />
					<UpcomingSkeleton />
					<RecentRoomsSkeleton />
				</>
			}
		/>
	);
}
