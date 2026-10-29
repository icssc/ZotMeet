"use client";

import CloseIcon from "@mui/icons-material/Close";
import DesktopWindowsOutlinedIcon from "@mui/icons-material/DesktopWindowsOutlined";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import PersonIcon from "@mui/icons-material/Person";
import PlaceIcon from "@mui/icons-material/Place";
import {
	Button,
	Chip,
	Collapse,
	Menu,
	MenuItem,
	Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import {
	filterRoomFits,
	formatLocation,
	formatMinutes,
	formatWindow,
	groupSimilarRooms,
	type Room,
	type RoomFit,
	type RoomFitGroup,
	sortRoomFits,
} from "@zotmeet/shared";
import { type MouseEvent, useMemo, useState } from "react";
import { useShallow } from "zustand/shallow";
import type { BestTimeRooms } from "@/hooks/use-study-room-flow";
import { cn } from "@/lib/utils";
import {
	type RoomFlowFilters,
	useRoomFlowStore,
} from "@/store/useRoomFlowStore";
import { ChoiceGroup, useChoiceGroupName } from "./choice-row";
import { StepCard } from "./step-card";
import { useRoomFlowColors } from "./use-room-flow-colors";

const INITIAL_ROWS = 4;
const SEAT_OPTIONS = [2, 4, 6, 8] as const;
const MINUTE_OPTIONS = [30, 60, 90, 120] as const;

/** "30m", "1h", "1.5h", "2h": the Free for menu's lengths. */
function formatFreeFor(minutes: number) {
	return minutes < 60 ? `${minutes}m` : `${minutes / 60}h`;
}

function FilterChip<T extends string | number>({
	label,
	activeLabel,
	value,
	options,
	getOptionLabel,
	onChange,
}: {
	label: string;
	activeLabel: (value: T) => string;
	value: T | null;
	options: readonly T[];
	getOptionLabel: (value: T) => string;
	onChange: (value: T | null) => void;
}) {
	const [anchor, setAnchor] = useState<HTMLElement | null>(null);
	const isOn = value != null;
	return (
		<>
			<Chip
				size="small"
				variant="outlined"
				clickable
				label={isOn ? activeLabel(value) : `${label} ▾`}
				onClick={(e: MouseEvent<HTMLElement>) => setAnchor(e.currentTarget)}
				onDelete={isOn ? () => onChange(null) : undefined}
				deleteIcon={
					isOn ? <CloseIcon aria-label={`Clear ${label}`} /> : undefined
				}
				aria-haspopup="menu"
				sx={
					isOn
						? {
								backgroundColor: (theme) =>
									alpha(
										theme.palette.primary.main,
										theme.palette.mode === "dark" ? 0.2 : 0.15,
									),
								borderColor: "primary.main",
								fontWeight: 600,
							}
						: undefined
				}
			/>
			<Menu
				anchorEl={anchor}
				open={Boolean(anchor)}
				onClose={() => setAnchor(null)}
			>
				{options.map((option) => (
					<MenuItem
						key={String(option)}
						selected={option === value}
						onClick={() => {
							onChange(option);
							setAnchor(null);
						}}
					>
						{getOptionLabel(option)}
					</MenuItem>
				))}
			</Menu>
		</>
	);
}

/** "2111" from "Gateway 2111": the building is already the card's title. */
function roomNumber(room: Room) {
	const prefix = `${room.building} `;
	return room.label.startsWith(prefix)
		? room.label.slice(prefix.length)
		: room.label;
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
			<Typography
				variant="body2"
				color="textSecondary"
				component="span"
				className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1"
			>
				{room.capacity != null && (
					<span className="flex items-center gap-1.5">
						<PersonIcon fontSize="small" />
						{room.capacity} {room.capacity === 1 ? "seat" : "seats"}
					</span>
				)}
				{room.techEnhanced && (
					<span className="flex items-center gap-1.5">
						<DesktopWindowsOutlinedIcon fontSize="small" />
						Tech Enhanced
					</span>
				)}
			</Typography>
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
							label={roomNumber(fit.room)}
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
	const colors = useRoomFlowColors();
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
					sx={{ color: colors.pinkText }}
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
	const primaryFits = includePartial
		? [...time.whole, ...time.partial]
		: time.whole;

	const sortedPrimary = useMemo(
		() => sortRoomFits(filterRoomFits(primaryFits, filters), groupSize),
		[primaryFits, filters, groupSize],
	);
	const sortedPartial = useMemo(
		() =>
			includePartial
				? []
				: sortRoomFits(filterRoomFits(time.partial, filters), groupSize),
		[includePartial, time.partial, filters, groupSize],
	);

	const locations = useMemo(
		() =>
			[
				...new Set(
					[...time.whole, ...time.partial].map((f) => f.room.location),
				),
			].sort(),
		[time.whole, time.partial],
	);

	const set = (patch: Partial<RoomFlowFilters>) => setFilters(patch);

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
				<FilterChip
					label="Seats"
					value={filters.minSeats}
					options={SEAT_OPTIONS}
					getOptionLabel={(n) => `${n}+ seats`}
					activeLabel={(n) => `${n}+ seats`}
					onChange={(minSeats) => set({ minSeats })}
				/>
				<FilterChip
					label="Building"
					value={filters.location}
					options={locations}
					getOptionLabel={(l) => l}
					activeLabel={formatLocation}
					onChange={(location) => set({ location })}
				/>
				<FilterChip
					label="Free for"
					value={filters.minMinutes}
					options={MINUTE_OPTIONS}
					getOptionLabel={(m) => `At least ${formatFreeFor(m)}`}
					activeLabel={(m) => `${formatFreeFor(m)}+ free`}
					onChange={(minMinutes) => set({ minMinutes })}
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
					{primaryFits.length === 0
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
