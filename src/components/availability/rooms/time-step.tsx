"use client";

import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ApartmentIcon from "@mui/icons-material/Apartment";
import CancelIcon from "@mui/icons-material/Cancel";
import { Alert, Button, Chip, Skeleton, Typography } from "@mui/material";
import { formatMinutes, formatShortDayAndWindow } from "@zotmeet/shared";
import { useShallow } from "zustand/shallow";
import type { BestTimeRooms, StudyRoomFlow } from "@/hooks/use-study-room-flow";
import { cn } from "@/lib/utils";
import { useRoomFlowStore } from "@/store/useRoomFlowStore";
import { ChoiceGroup, useChoiceGroupName } from "./choice-row";
import { AvailableCount, StepCard } from "./step-card";
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
		return (
			<Skeleton
				variant="rounded"
				width={96}
				height={32}
				className="ml-auto"
				aria-label="Loading rooms"
			/>
		);
	}
	const count = roomsFor(time, includePartial);
	return (
		<Chip
			icon={<ApartmentIcon />}
			label={
				time.status === "error"
					? "—"
					: count === 0
						? "No rooms"
						: `${count} ${count === 1 ? "Room" : "Rooms"}`
			}
			className="ml-auto shrink-0"
			sx={{ typography: "caption" }}
		/>
	);
}

function TimeCard({
	time,
	timeZone,
	memberCount,
	includePartial,
	checked,
	onSelect,
	onNext,
}: {
	time: BestTimeRooms;
	timeZone: string;
	memberCount: number;
	includePartial: boolean;
	checked: boolean;
	onSelect: () => void;
	onNext: () => void;
}) {
	const name = useChoiceGroupName();

	return (
		<StepCard
			direction="next"
			title="Choose a Room"
			onAction={onNext}
			actionDisabled={time.status !== "ready"}
			showAction={checked}
			as="label"
			className="cursor-pointer has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2"
		>
			<input
				type="radio"
				className="sr-only"
				name={name}
				value={time.id}
				checked={checked}
				onChange={onSelect}
			/>
			<Typography
				variant="body1"
				component="span"
				className={cn(checked && "truncate")}
			>
				{formatShortDayAndWindow(time, timeZone)}
			</Typography>
			{time.missingNames.length > 0 && (
				<Typography
					variant="caption"
					color="textSecondary"
					className="flex min-w-0 items-center gap-1.5"
				>
					<CancelIcon fontSize="small" className="shrink-0" />
					<span className={cn(checked && "truncate")}>
						{time.missingNames.join(", ")}
					</span>
				</Typography>
			)}
			<div className="flex items-center gap-3">
				<AvailableCount free={time.freeMemberIds.length} total={memberCount} />
				{!checked && (
					<Typography
						variant="caption"
						color="textSecondary"
						className="flex shrink-0 items-center gap-1.5"
					>
						<AccessTimeIcon fontSize="small" />
						{formatMinutes(time.minutes)}
					</Typography>
				)}
				<RoomCount time={time} includePartial={includePartial} />
			</div>
		</StepCard>
	);
}

/** The empty state's way out; offers only the options that can still help. */
function NoRoomsPanel({
	canIncludePartial,
	showMoreTimes,
}: {
	/** Partly free rooms exist and aren't shown yet. */
	canIncludePartial: boolean;
	showMoreTimes: boolean;
}) {
	const colors = useRoomFlowColors();
	const { setIncludePartial, setShowMoreTimes } = useRoomFlowStore(
		useShallow((s) => ({
			setIncludePartial: s.setIncludePartial,
			setShowMoreTimes: s.setShowMoreTimes,
		})),
	);
	return (
		<div className="flex flex-col gap-2 rounded-xl bg-primary/15 p-4 dark:bg-primary/20">
			<Typography variant="subtitle2" component="p">
				No rooms free at your best times
			</Typography>
			<Typography variant="body2" color="textSecondary">
				{canIncludePartial
					? "Every room is booked for part of each best time. Continue with partly free rooms, or look at more times."
					: "No room is free for any part of your best times. Look at more times, or browse the library."}
			</Typography>
			<div className="flex flex-wrap items-center gap-2 pt-1">
				{canIncludePartial && (
					<Button
						variant="outlined"
						size="small"
						onClick={() => setIncludePartial(true)}
					>
						Include partly free rooms
					</Button>
				)}
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
		setIncludePartial,
		setStep,
	} = useRoomFlowStore(
		useShallow((s) => ({
			selectedTimeId: s.selectedTimeId,
			includePartial: s.includePartial,
			showMoreTimes: s.showMoreTimes,
			selectTime: s.selectTime,
			setIncludePartial: s.setIncludePartial,
			setStep: s.setStep,
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
		!flow.isLoading &&
		flow.errorCount === 0 &&
		flow.times.every((time) => roomsFor(time, includePartial) === 0);

	return (
		<div className="flex flex-col gap-3">
			<div>
				<Typography variant="h6" component="h3">
					When will you meet?
				</Typography>
				<Typography variant="caption" color="textSecondary">
					Select the time that works best for your meeting.
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

			{isEmpty && (
				<NoRoomsPanel
					canIncludePartial={
						!includePartial && flow.times.some((t) => t.partial.length > 0)
					}
					showMoreTimes={showMoreTimes}
				/>
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

			<ChoiceGroup label="Best times" className="flex flex-col gap-2">
				{flow.times.map((time) => (
					<TimeCard
						key={time.id}
						time={time}
						timeZone={timeZone}
						memberCount={flow.memberCount}
						includePartial={includePartial}
						checked={selectedTimeId === time.id}
						onSelect={() => selectTime(time.id)}
						onNext={() => setStep(1)}
					/>
				))}
			</ChoiceGroup>
		</div>
	);
}
