"use client";

import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import PlaceIcon from "@mui/icons-material/Place";
import { Button, Chip, Collapse, Typography } from "@mui/material";
import {
	filterRoomFits,
	formatLocation,
	formatMinutes,
	formatWindow,
	groupSimilarRooms,
	type RoomFit,
	type RoomFitGroup,
	sortRoomFits,
} from "@zotmeet/shared";
import { useMemo, useState } from "react";
import { useShallow } from "zustand/shallow";
import type { BestTimeRooms } from "@/hooks/use-study-room-flow";
import { cn } from "@/lib/utils";
import { useRoomFlowStore } from "@/store/useRoomFlowStore";
import { ChoiceGroup, useChoiceGroupName } from "./choice-row";
import { RoomDetails } from "./room-details";
import { FilterChip, SeatsStepper } from "./room-filters";
import { StepCard } from "./step-card";
import { pinkText } from "./styles";

const INITIAL_ROWS = 4;
const MINUTE_OPTIONS = [30, 60, 90, 120] as const;

/** "30m", "1h", "1.5h", "2h": the Free for menu's lengths. */
function formatFreeFor(minutes: number) {
	return minutes < 60 ? `${minutes}m` : `${minutes / 60}h`;
}

/**
 * Near-identical rooms as one card: building, seats and tech, then a chip per
 * room. The checked card's "Next:" panel moves on to booking.
 */
function RoomGroupCard({
	group,
	timeZone,
}: {
	group: RoomFitGroup;
	timeZone: string;
}) {
	const name = useChoiceGroupName();
	const { selectedRoomKey, selectRoom, setStep } = useRoomFlowStore(
		useShallow((s) => ({
			selectedRoomKey: s.selectedRoomKey,
			selectRoom: s.selectRoom,
			setStep: s.setStep,
		})),
	);
	const fits = [group.lead, ...group.similar];
	const checked = fits.some((f) => f.room.key === selectedRoomKey);
	const { room, kind, window, minutes } = group.lead;

	return (
		<StepCard
			direction="next"
			title="Book the Room"
			onAction={() => setStep(2)}
			showAction={checked}
			as="label"
			className="cursor-pointer has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2"
		>
			<input
				type="radio"
				className="sr-only"
				name={name}
				value={group.key}
				checked={checked}
				onChange={() => selectRoom(group.lead.room.key)}
			/>
			<Typography
				variant="body1"
				component="span"
				className={cn(checked && "truncate")}
			>
				{room.location}
			</Typography>
			<RoomDetails room={room} />
			{kind === "partial" && (
				<Typography variant="caption" color="textSecondary">
					Free {formatWindow(window, timeZone)} · {formatMinutes(minutes)}
				</Typography>
			)}
			<span className="flex flex-wrap gap-2 pt-1">
				{fits.map((fit) => {
					const isActive = fit.room.key === selectedRoomKey;
					return (
						<Chip
							key={fit.room.key}
							icon={<PlaceIcon />}
							label={fit.room.number}
							size="small"
							color={isActive ? "primary" : "default"}
							variant={isActive ? "filled" : "outlined"}
							aria-label={fit.room.label}
							aria-pressed={isActive}
							onClick={(e) => {
								// Inside the card's label: don't let it re-pick the lead.
								e.preventDefault();
								selectRoom(fit.room.key);
							}}
						/>
					);
				})}
			</span>
		</StepCard>
	);
}

/** Room cards, near-identical rooms sharing one card. */
function GroupedRoomList({
	fits,
	timeZone,
	label,
}: {
	fits: RoomFit[];
	timeZone: string;
	label: string;
}) {
	const [showAll, setShowAll] = useState(false);
	const groups = useMemo(() => groupSimilarRooms(fits), [fits]);
	const visible = showAll ? groups : groups.slice(0, INITIAL_ROWS);

	return (
		<div className="flex flex-col gap-2">
			<ChoiceGroup label={label} className="flex flex-col gap-2">
				{visible.map((group) => (
					<RoomGroupCard key={group.key} group={group} timeZone={timeZone} />
				))}
			</ChoiceGroup>
			{groups.length > INITIAL_ROWS && (
				<Button
					variant="text"
					size="small"
					className="self-start"
					onClick={() => setShowAll((v) => !v)}
					sx={pinkText}
				>
					{showAll ? "Show fewer" : `Show all ${fits.length} rooms`}
				</Button>
			)}
		</div>
	);
}

/** Step 2: rooms free the whole best time, then the partly free ones. */
export function RoomStep({
	time,
	timeZone,
}: {
	time: BestTimeRooms;
	timeZone: string;
}) {
	const { filters, setFilters, includePartial } = useRoomFlowStore(
		useShallow((s) => ({
			filters: s.filters,
			setFilters: s.setFilters,
			includePartial: s.includePartial,
		})),
	);
	const [partialOpen, setPartialOpen] = useState(false);

	const groupSize = time.freeMemberIds.length;

	const sortedPrimary = useMemo(
		() => sortRoomFits(filterRoomFits(time.shown, filters), groupSize),
		[time.shown, filters, groupSize],
	);
	const sortedPartial = useMemo(
		() =>
			includePartial
				? []
				: sortRoomFits(filterRoomFits(time.partial, filters), groupSize),
		[includePartial, time.partial, filters, groupSize],
	);

	const locations = useMemo(
		() => [...new Set(time.fits.map((f) => f.room.location))].sort(),
		[time.fits],
	);

	const maxSeats = useMemo(
		() => Math.max(1, ...time.fits.map((f) => f.room.capacity ?? 0)),
		[time.fits],
	);

	return (
		<div className="flex flex-col gap-3">
			<div className="flex flex-col">
				<Typography variant="h6" component="h3">
					Where will you meet?
				</Typography>
				<Typography variant="caption" color="textSecondary">
					Select the room that works best for your meeting
				</Typography>
			</div>

			<div className="flex flex-wrap gap-2">
				<SeatsStepper
					value={filters.minSeats}
					attendees={Math.max(1, groupSize)}
					max={maxSeats}
					onChange={(minSeats) => setFilters({ minSeats })}
				/>
				<FilterChip
					label="Building"
					value={filters.location}
					options={locations}
					getOptionLabel={(l) => l}
					activeLabel={formatLocation}
					onChange={(location) => setFilters({ location })}
				/>
				<FilterChip
					label="Free for"
					value={filters.minMinutes}
					options={MINUTE_OPTIONS}
					getOptionLabel={(m) => `At least ${formatFreeFor(m)}`}
					activeLabel={(m) => `${formatFreeFor(m)}+ free`}
					onChange={(minMinutes) => setFilters({ minMinutes })}
				/>
			</div>

			{sortedPrimary.length > 0 ? (
				<GroupedRoomList
					fits={sortedPrimary}
					timeZone={timeZone}
					label="Rooms"
				/>
			) : (
				<Typography variant="body2" color="textSecondary">
					{time.shown.length === 0
						? "No rooms are free for this whole time."
						: "No rooms match these filters."}
				</Typography>
			)}

			{sortedPartial.length > 0 && (
				<div className="flex flex-col gap-2">
					<Button
						variant="text"
						size="small"
						color="inherit"
						className="self-start"
						endIcon={partialOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
						aria-expanded={partialOpen}
						onClick={() => setPartialOpen((v) => !v)}
					>
						Free part of the time · {sortedPartial.length}
					</Button>
					<Collapse in={partialOpen} unmountOnExit>
						<GroupedRoomList
							fits={sortedPartial}
							timeZone={timeZone}
							label="Partly free rooms"
						/>
					</Collapse>
				</div>
			)}
		</div>
	);
}
