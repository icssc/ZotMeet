"use client";

import CloseIcon from "@mui/icons-material/Close";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
	Button,
	Chip,
	Collapse,
	Menu,
	MenuItem,
	Typography,
} from "@mui/material";
import {
	filterRoomFits,
	formatLocation,
	formatMinutes,
	formatWindow,
	groupSimilarRooms,
	type RoomFit,
	sortRoomFits,
} from "@zotmeet/shared";
import { type MouseEvent, type ReactNode, useMemo, useState } from "react";
import { useShallow } from "zustand/shallow";
import type { BestTimeRooms } from "@/hooks/use-study-room-flow";
import {
	type RoomFlowFilters,
	useRoomFlowStore,
} from "@/store/useRoomFlowStore";
import { ChoiceRow } from "./choice-row";
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
	const colors = useRoomFlowColors();
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
								backgroundColor: colors.pinkSoft,
								borderColor: colors.pink,
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

/** One room as a radio row: "Sci Lib 471", "Science Library · 4 seats · Tech". */
function RoomRow({
	fit,
	timeZone,
	trailing,
	className,
}: {
	fit: RoomFit;
	timeZone: string;
	trailing?: ReactNode;
	className?: string;
}) {
	const { selectedRoomKey, selectRoom, setHoveredRoomKey } = useRoomFlowStore(
		useShallow((s) => ({
			selectedRoomKey: s.selectedRoomKey,
			selectRoom: s.selectRoom,
			setHoveredRoomKey: s.setHoveredRoomKey,
		})),
	);
	const { room } = fit;
	const details = [
		room.location,
		room.capacity != null
			? `${room.capacity} ${room.capacity === 1 ? "seat" : "seats"}`
			: null,
		room.techEnhanced ? "Tech" : null,
	]
		.filter(Boolean)
		.join(" · ");

	return (
		<ChoiceRow
			name="room-flow-room"
			value={room.key}
			checked={selectedRoomKey === room.key}
			onSelect={() => selectRoom(room.key)}
			onPreview={(active) => setHoveredRoomKey(active ? room.key : null)}
			className={className}
		>
			<div className="flex min-w-0 flex-1 flex-col">
				<Typography variant="body2" sx={{ fontWeight: 600 }}>
					{room.label}
				</Typography>
				<Typography variant="caption" color="textSecondary">
					{details}
				</Typography>
				{fit.kind === "partial" && (
					<Typography variant="caption" color="textSecondary">
						Free {formatWindow(fit.window, timeZone)} ·{" "}
						{formatMinutes(fit.minutes)}
					</Typography>
				)}
			</div>
			{trailing}
		</ChoiceRow>
	);
}

/** A list of rooms with near-identical ones folded under "+N similar". */
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
	const [expanded, setExpanded] = useState<ReadonlySet<string>>(new Set());
	const groups = useMemo(() => groupSimilarRooms(fits), [fits]);
	const visible = showAll ? groups : groups.slice(0, INITIAL_ROWS);

	const toggle = (key: string) =>
		setExpanded((prev) => {
			const next = new Set(prev);
			if (next.has(key)) next.delete(key);
			else next.add(key);
			return next;
		});

	return (
		<div className="flex flex-col gap-2">
			<div role="radiogroup" aria-label={label} className="flex flex-col gap-2">
				{visible.map((group) => {
					const isOpen = expanded.has(group.key);
					return (
						<div key={group.key} className="flex flex-col gap-2">
							<RoomRow
								fit={group.lead}
								timeZone={timeZone}
								trailing={
									group.similar.length > 0 && (
										<Chip
											size="small"
											variant="outlined"
											label={`+${group.similar.length} similar`}
											icon={isOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
											aria-expanded={isOpen}
											onClick={(e) => {
												// Inside the row's label: don't select the room too.
												e.preventDefault();
												e.stopPropagation();
												toggle(group.key);
											}}
										/>
									)
								}
							/>
							{isOpen &&
								group.similar.map((fit) => (
									<RoomRow
										key={fit.room.key}
										fit={fit}
										timeZone={timeZone}
										className="ml-4"
									/>
								))}
						</div>
					);
				})}
			</div>
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
			<div className="flex items-baseline justify-between gap-2">
				<Typography variant="h6" component="h3">
					Which room?
				</Typography>
				<Typography variant="caption" color="textSecondary">
					{includePartial
						? `${sortedPrimary.length} free for some of it`
						: `${sortedPrimary.length} free the whole ${formatMinutes(time.minutes)}`}
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
