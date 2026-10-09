"use client";

import { Alert, Button, Skeleton, Typography } from "@mui/material";
import { formatBestTimeNote, formatDayAndWindow } from "@zotmeet/shared";
import { useShallow } from "zustand/shallow";
import type { BestTimeRooms, StudyRoomFlow } from "@/hooks/use-study-room-flow";
import { useRoomFlowStore } from "@/store/useRoomFlowStore";
import { ChoiceRow, Pill } from "./choice-row";
import { RankBadge } from "./rank-badge";
import { useRoomFlowColors } from "./use-room-flow-colors";

export const UCI_LIBRARIES_URL = "https://spaces.lib.uci.edu/";

/** Rooms a time offers in the current mode: whole only, or partial too. */
export function roomsFor(time: BestTimeRooms, includePartial: boolean) {
	return includePartial
		? time.whole.length + time.partial.length
		: time.whole.length;
}

function RoomCount({
	time,
	includePartial,
}: {
	time: BestTimeRooms;
	includePartial: boolean;
}) {
	if (time.status === "loading") {
		return <Skeleton variant="text" width={52} aria-label="Loading rooms" />;
	}
	if (time.status === "error") {
		return (
			<Typography variant="caption" color="textSecondary">
				—
			</Typography>
		);
	}
	const count = roomsFor(time, includePartial);
	return (
		<Typography
			variant="caption"
			color="textSecondary"
			className="shrink-0 whitespace-nowrap"
		>
			{count === 0 ? "No rooms" : `${count} ${count === 1 ? "room" : "rooms"}`}
		</Typography>
	);
}

export function NoRoomsPanel({ showMoreTimes }: { showMoreTimes: boolean }) {
	const colors = useRoomFlowColors();
	const { setIncludePartial, setShowMoreTimes } = useRoomFlowStore(
		useShallow((s) => ({
			setIncludePartial: s.setIncludePartial,
			setShowMoreTimes: s.setShowMoreTimes,
		})),
	);
	return (
		<div
			className="flex flex-col gap-2 rounded-xl p-4"
			style={{ backgroundColor: colors.pinkSoft }}
		>
			<Typography variant="subtitle2" component="p">
				No rooms free at your best times
			</Typography>
			<Typography variant="body2" color="textSecondary">
				Every room is booked for part of each best time. Continue with partly
				free rooms, or look at more times.
			</Typography>
			<div className="flex flex-wrap items-center gap-2 pt-1">
				<Button
					variant="outlined"
					size="small"
					onClick={() => setIncludePartial(true)}
				>
					Include partly free rooms
				</Button>
				{!showMoreTimes && (
					<Button
						variant="text"
						size="small"
						onClick={() => setShowMoreTimes(true)}
						sx={{ color: colors.pinkText }}
					>
						Show more times
					</Button>
				)}
			</div>
			<a
				href={UCI_LIBRARIES_URL}
				target="_blank"
				rel="noopener noreferrer"
				className="w-fit font-medium text-sm underline underline-offset-2"
				style={{ color: colors.pinkText }}
			>
				Browse UCI Libraries directly ↗
			</a>
		</div>
	);
}

/** Step 1: the ranked best times, each with how many rooms it has. */
export function TimeStep({
	flow,
	timeZone,
	onShowAttendees,
}: {
	flow: StudyRoomFlow;
	timeZone: string;
	onShowAttendees: () => void;
}) {
	const colors = useRoomFlowColors();
	const {
		selectedTimeId,
		includePartial,
		showMoreTimes,
		selectTime,
		setHoveredTimeId,
		setIncludePartial,
	} = useRoomFlowStore(
		useShallow((s) => ({
			selectedTimeId: s.selectedTimeId,
			includePartial: s.includePartial,
			showMoreTimes: s.showMoreTimes,
			selectTime: s.selectTime,
			setHoveredTimeId: s.setHoveredTimeId,
			setIncludePartial: s.setIncludePartial,
		})),
	);

	if (flow.isUnsupported) {
		return (
			<Typography variant="body2" color="textSecondary">
				This meeting repeats on days of the week, so there is no date to book a
				room for. Rooms work with meetings on specific dates.
			</Typography>
		);
	}

	if (flow.times.length === 0) {
		return (
			<div className="flex flex-col items-start gap-2">
				<Typography variant="body2" color="textSecondary">
					Rooms appear once people add availability.
				</Typography>
				<Button
					variant="text"
					size="small"
					onClick={onShowAttendees}
					sx={{ color: colors.pinkText }}
				>
					See attendees
				</Button>
			</div>
		);
	}

	const isEmpty =
		!flow.isLoading && flow.errorCount === 0 && flow.roomCount === 0;

	return (
		<div className="flex flex-col gap-3">
			<div>
				<Typography variant="h6" component="h3">
					When should you meet?
				</Typography>
				<Typography variant="caption" color="textSecondary">
					Your best times, most people first. Hover to find one on the grid.
				</Typography>
			</div>

			{flow.errorCount > 0 && (
				<Alert
					severity="error"
					action={
						<Button color="inherit" size="small" onClick={flow.retry}>
							Retry
						</Button>
					}
				>
					{flow.errorCount === flow.times.length
						? "Couldn't load study rooms."
						: `Couldn't load rooms for ${flow.errorCount} of ${flow.times.length} times.`}
				</Alert>
			)}

			{isEmpty && !includePartial && (
				<NoRoomsPanel showMoreTimes={showMoreTimes} />
			)}
			{includePartial && (
				<div className="flex items-center justify-between gap-2">
					<Typography variant="caption" color="textSecondary">
						Including partly free rooms.
					</Typography>
					<Button
						variant="text"
						size="small"
						onClick={() => setIncludePartial(false)}
						sx={{ color: colors.pinkText }}
					>
						Only fully free
					</Button>
				</div>
			)}

			<div
				role="radiogroup"
				aria-label="Best times"
				className="flex flex-col gap-2"
			>
				{flow.times.map((time) => {
					const everyone = time.freeMemberIds.length === flow.memberCount;
					const noRooms =
						time.status === "ready" && roomsFor(time, includePartial) === 0;
					return (
						<ChoiceRow
							key={time.id}
							name="room-flow-time"
							value={time.id}
							checked={selectedTimeId === time.id}
							onSelect={() => selectTime(time.id)}
							onPreview={(active) => setHoveredTimeId(active ? time.id : null)}
							dimmed={noRooms}
						>
							<RankBadge rank={time.rank} />
							<div className="flex min-w-0 flex-1 flex-col">
								<div className="flex flex-wrap items-center gap-x-2 gap-y-1">
									<Typography variant="body2" sx={{ fontWeight: 600 }}>
										{formatDayAndWindow(time, timeZone)}
									</Typography>
									<Pill on={everyone}>
										{time.freeMemberIds.length}/{flow.memberCount} free
									</Pill>
								</div>
								<Typography variant="caption" color="textSecondary">
									{formatBestTimeNote(time.missingNames, time.minutes)}
								</Typography>
							</div>
							<RoomCount time={time} includePartial={includePartial} />
						</ChoiceRow>
					);
				})}
			</div>
		</div>
	);
}
