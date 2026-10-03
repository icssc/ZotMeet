"use client";

import {
	Alert,
	Button,
	Card,
	CardActionArea,
	CardActions,
	CardContent,
	Chip,
	Divider,
	LinearProgress,
	MenuItem,
	TextField,
	Typography,
} from "@mui/material";
import {
	type ChangeEvent,
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import { useStudyRoomHover } from "@/components/availability/table/study-room-hover-context";
import {
	formatRoomFreeWindows,
	getRoomFreeWindows,
	type RoomFreeWindow,
} from "@/lib/rooms/utils";
import type { paths } from "@/lib/types/anteater-api-types";
import {
	BUILDINGS,
	type Building,
	CAPACITIES,
	type Capacity,
	formatLocation,
	formatRoomChipLabel,
	MEETING_LENGTHS,
	type MeetingLength,
	parseRoomDuration,
	type RoomFilters,
	stripRoomDurationSuffix,
} from "@/lib/types/studyrooms";

export type StudyRoomApiEntry = NonNullable<
	paths["/v2/rest/studyRooms"]["get"]["responses"]["200"]["content"]["application/json"]
>["data"][number];

export interface RoomResult {
	id: string;
	label: string;
	location: string;
	capacity: number | null;
	description: string | null;
	techEnhanced: boolean | null;
	durations: MeetingLength[];
}

function toggle<T>(arr: T[], val: T): T[] {
	return arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val];
}

function dedupeKey(name: string, location: string): string {
	return `${stripRoomDurationSuffix(name)}|${location}`;
}

export function getRoomBookingUrl(
	variants: StudyRoomApiEntry[] | undefined,
	preferredLengths: MeetingLength[] = [],
): string | null {
	if (!variants?.length) return null;

	// Match preferred lengths in a stable, canonical order (shortest → longest)
	// instead of the arbitrary order the user toggled the chips in.
	const orderedLengths = MEETING_LENGTHS.filter((length) =>
		preferredLengths.includes(length),
	);

	let raw: StudyRoomApiEntry | undefined;
	for (const length of orderedLengths) {
		raw = variants.find((v) => parseRoomDuration(v.name) === length);
		if (raw) break;
	}
	raw ??= variants[0];

	// Only surface a booking link the API actually provided; constructing a URL
	// from the room id is unreliable since variants live on different domains.
	return raw.url ?? null;
}

/**
 * Collapses all duration variants (1h, 2h, 3h) of the same physical room into
 * one display entry.
 *
 * Availability is intentionally NOT computed here — the context's
 * buildUnavailableKeys handles that directly from the raw slots, correctly
 * OR-merging overlapping sliding-window slots across all variants.
 */
export function deduplicateRooms(rooms: StudyRoomApiEntry[]): RoomResult[] {
	type Entry = RoomResult & { availableCount: number };
	const seen = new Map<string, Entry>();

	for (const room of rooms) {
		const key = dedupeKey(room.name, room.location);
		const baseName = stripRoomDurationSuffix(room.name);
		const availableCount = room.slots.filter((s) => s.isAvailable).length;
		const duration = parseRoomDuration(room.name);

		const existing = seen.get(key);

		if (!existing) {
			seen.set(key, {
				id: key,
				label: baseName || room.name,
				location: room.location,
				capacity: room.capacity,
				description: room.description ?? null,
				techEnhanced: room.techEnhanced,
				durations: duration ? [duration] : [],
				availableCount,
			});
			continue;
		}

		const mergedDurations = new Set(existing.durations);
		if (duration) mergedDurations.add(duration);

		if (availableCount > existing.availableCount) {
			seen.set(key, {
				...existing,
				label: baseName || room.name,
				capacity: room.capacity,
				description: room.description ?? existing.description,
				techEnhanced: room.techEnhanced,
				durations: Array.from(mergedDurations),
				availableCount,
			});
		} else {
			seen.set(key, {
				...existing,
				durations: Array.from(mergedDurations),
			});
		}
	}

	return Array.from(seen.values());
}

export function filterRoomResults(
	rooms: RoomResult[],
	filters: RoomFilters,
): RoomResult[] {
	const {
		lengths: selectedLengths,
		capacities: selectedCapacities,
		buildings: selectedBuildings,
	} = filters;

	return rooms.filter((room) => {
		if (selectedCapacities.length > 0) {
			if (room.capacity == null) return false;
			const matchesCapacity = selectedCapacities.some((range) => {
				if (range === "13+")
					return room.capacity != null && room.capacity >= 13;
				const [min, max] = range.split("-").map(Number);
				return (
					room.capacity != null && room.capacity >= min && room.capacity <= max
				);
			});
			if (!matchesCapacity) return false;
		}

		if (selectedBuildings.length > 0) {
			const matchesBuilding = selectedBuildings.some((b) =>
				room.location.includes(b),
			);
			if (!matchesBuilding) return false;
		}

		if (selectedLengths.length > 0) {
			const matchesLength = room.durations.some((d) =>
				selectedLengths.includes(d),
			);
			if (!matchesLength) return false;
		}

		return true;
	});
}

/**
 * Groups raw API entries by dedup key so the hover handler passes all duration
 * variants of a room to the context at once, enabling correct OR-merge of
 * overlapping sliding-window slots across all booking-length variants.
 */
export function groupRawRoomsByKey(
	rooms: StudyRoomApiEntry[],
): Map<string, StudyRoomApiEntry[]> {
	const map = new Map<string, StudyRoomApiEntry[]>();
	for (const room of rooms) {
		const key = dedupeKey(room.name, room.location);
		const existing = map.get(key);
		if (existing) {
			existing.push(room);
		} else {
			map.set(key, [room]);
		}
	}
	return map;
}

/** "ALP", "ALP or Sci Lib", "ALP, Sci Lib or PV". */
function joinWithOr(items: string[]): string {
	if (items.length <= 1) return items.join("");
	return `${items.slice(0, -1).join(", ")} or ${items.at(-1)}`;
}

/** "Any room in ALP or Sci Lib", or "Any matching room" with no building filter. */
export function formatAnyRoomLabel(buildings: Building[]): string {
	return buildings.length > 0
		? `Any room in ${joinWithOr(buildings.map(formatLocation))}`
		: "Any matching room";
}

/** True when the pinned set is every room the filters currently match. */
export function isAnyRoomSelection(
	selectedRoomIds: string[],
	filteredRooms: RoomResult[],
): boolean {
	if (filteredRooms.length < 2) return false;
	if (selectedRoomIds.length !== filteredRooms.length) return false;
	const selected = new Set(selectedRoomIds);
	return filteredRooms.every((room) => selected.has(room.id));
}

/**
 * What the grid is outlining for the pinned rooms, e.g. "any room in ALP or
 * Sci Lib" or "ALP 2300 or Sci Lib 483". Null when nothing is pinned.
 */
export function formatPinnedRoomsSummary(
	selectedRoomIds: string[],
	filteredRooms: RoomResult[],
	allRooms: RoomResult[],
	buildings: Building[],
): string | null {
	if (selectedRoomIds.length === 0) return null;
	if (isAnyRoomSelection(selectedRoomIds, filteredRooms)) {
		const label = formatAnyRoomLabel(buildings);
		return label.charAt(0).toLowerCase() + label.slice(1);
	}
	const byId = new Map(allRooms.map((room) => [room.id, room]));
	const labels = selectedRoomIds.flatMap((id) => {
		const room = byId.get(id);
		return room ? [formatRoomChipLabel(room.location, room.label)] : [];
	});
	if (labels.length === 0) return null;
	const MAX_NAMED = 2;
	if (labels.length > MAX_NAMED + 1) {
		const shown = labels.slice(0, MAX_NAMED).join(", ");
		return `${shown} or ${labels.length - MAX_NAMED} more`;
	}
	return joinWithOr(labels);
}

function findBuilding(location: string): Building | null {
	return BUILDINGS.find((b) => location.includes(b)) ?? null;
}

interface RoomRecommendationSettingsProps {
	layout?: "sidebar" | "sheet";
	onShowBestRooms?: () => void;
	rawRooms?: StudyRoomApiEntry[];
	hasSearched?: boolean;
	filters: RoomFilters;
	onFiltersChange: (filters: RoomFilters) => void;
	isLoading?: boolean;
	errorMessage?: string | null;
	selectedRoomIds?: string[];
	onSelectedRoomIdsChange?: (ids: string[]) => void;
	onRoomSelect?: (room: RoomResult, selected: boolean) => void;
	/** Zone the grid is drawn in; room free times are shown in it too. */
	timeZone: string;
}

const ANY_VALUE = "any";

const selectedCardSx = { borderColor: "text.primary" } as const;

export function RoomRecommendationSettings({
	layout = "sidebar",
	onShowBestRooms,
	onFiltersChange,
	filters,
	rawRooms = [],
	hasSearched = false,
	isLoading = false,
	errorMessage = null,
	selectedRoomIds,
	onSelectedRoomIdsChange,
	onRoomSelect,
	timeZone,
}: RoomRecommendationSettingsProps) {
	const isSheet = layout === "sheet";

	const roomResults = useMemo(() => deduplicateRooms(rawRooms), [rawRooms]);

	const rawRoomsByKey = useMemo(() => groupRawRoomsByKey(rawRooms), [rawRooms]);

	const { setHoveredRoom } = useStudyRoomHover();

	const {
		lengths: selectedLengths,
		capacities: selectedCapacities,
		buildings: selectedBuildings,
	} = filters;

	// Search on open, and again whenever the query itself changes (capacity is
	// sent to the API; `showBestRooms` is rebuilt when it or the group's best
	// times change). Length and building filter the results client-side.
	const lastSearchRef = useRef(hasSearched ? onShowBestRooms : undefined);
	useEffect(() => {
		if (!onShowBestRooms || lastSearchRef.current === onShowBestRooms) return;
		lastSearchRef.current = onShowBestRooms;
		onShowBestRooms();
	}, [onShowBestRooms]);

	const [internalSelectedRoomIds, setInternalSelectedRoomIds] = useState<
		string[]
	>([]);
	const isSelectionControlled = selectedRoomIds !== undefined;
	const effectiveSelectedRoomIds = isSelectionControlled
		? selectedRoomIds
		: internalSelectedRoomIds;

	const setSelection = useCallback(
		(next: string[]) => {
			if (isSelectionControlled) {
				onSelectedRoomIdsChange?.(next);
			} else {
				setInternalSelectedRoomIds(next);
			}
		},
		[isSelectionControlled, onSelectedRoomIdsChange],
	);

	const filteredRooms = useMemo(
		() => filterRoomResults(roomResults, filters),
		[roomResults, filters],
	);

	const freeWindowsById = useMemo(() => {
		const map = new Map<string, RoomFreeWindow[]>();
		for (const room of filteredRooms) {
			map.set(room.id, getRoomFreeWindows(rawRoomsByKey.get(room.id) ?? []));
		}
		return map;
	}, [filteredRooms, rawRoomsByKey]);

	// Rooms grouped by building (in BUILDINGS order), most free time first.
	const roomGroups = useMemo(() => {
		const freeMinutes = (id: string) =>
			(freeWindowsById.get(id) ?? []).reduce(
				(sum, w) => sum + (w.end.getTime() - w.start.getTime()),
				0,
			);
		const groups = new Map<string, RoomResult[]>();
		for (const room of filteredRooms) {
			const key = findBuilding(room.location) ?? room.location;
			groups.set(key, [...(groups.get(key) ?? []), room]);
		}
		const order = (key: string) => {
			const index = BUILDINGS.indexOf(key as Building);
			return index === -1 ? BUILDINGS.length : index;
		};
		return Array.from(groups.entries())
			.sort(([a], [b]) => order(a) - order(b))
			.map(([building, rooms]) => ({
				building,
				rooms: [...rooms].sort((a, b) => freeMinutes(b.id) - freeMinutes(a.id)),
			}));
	}, [filteredRooms, freeWindowsById]);

	const selectedBookingUrl = useMemo(() => {
		if (effectiveSelectedRoomIds.length !== 1) return null;
		return getRoomBookingUrl(
			rawRoomsByKey.get(effectiveSelectedRoomIds[0]),
			selectedLengths,
		);
	}, [effectiveSelectedRoomIds, rawRoomsByKey, selectedLengths]);

	const anyRoomLabel = formatAnyRoomLabel(selectedBuildings);
	const isAnyRoomSelected = isAnyRoomSelection(
		effectiveSelectedRoomIds,
		filteredRooms,
	);

	const handleLengthChange = useCallback(
		(event: ChangeEvent<HTMLInputElement>) => {
			const { value } = event.target;
			onFiltersChange({
				...filters,
				lengths: value === ANY_VALUE ? [] : [Number(value) as MeetingLength],
			});
		},
		[filters, onFiltersChange],
	);

	const handleCapacityChange = useCallback(
		(event: ChangeEvent<HTMLInputElement>) => {
			const { value } = event.target;
			onFiltersChange({
				...filters,
				capacities: value === ANY_VALUE ? [] : [value as Capacity],
			});
		},
		[filters, onFiltersChange],
	);

	const handleToggleBuilding = useCallback(
		(v: Building) => {
			onFiltersChange({
				...filters,
				buildings: toggle(selectedBuildings, v),
			});
		},
		[filters, selectedBuildings, onFiltersChange],
	);

	const handleToggleRoom = useCallback(
		(room: RoomResult) => {
			// Coming from "any room", a click narrows the pin to just this room.
			const next = isAnyRoomSelected
				? [room.id]
				: toggle(effectiveSelectedRoomIds, room.id);
			setSelection(next);
			onRoomSelect?.(room, next.includes(room.id));
		},
		[effectiveSelectedRoomIds, isAnyRoomSelected, setSelection, onRoomSelect],
	);

	const handleToggleAnyRoom = useCallback(() => {
		setSelection(isAnyRoomSelected ? [] : filteredRooms.map((r) => r.id));
	}, [filteredRooms, isAnyRoomSelected, setSelection]);

	const handleRoomMouseEnter = useCallback(
		(room: RoomResult) => {
			setHoveredRoom(rawRoomsByKey.get(room.id) ?? null);
		},
		[rawRoomsByKey, setHoveredRoom],
	);

	const handleAnyRoomMouseEnter = useCallback(() => {
		setHoveredRoom(
			filteredRooms.flatMap((room) => rawRoomsByKey.get(room.id) ?? []),
			anyRoomLabel,
		);
	}, [anyRoomLabel, filteredRooms, rawRoomsByKey, setHoveredRoom]);

	const handleRoomMouseLeave = useCallback(() => {
		setHoveredRoom(null);
	}, [setHoveredRoom]);

	const lengthValue =
		selectedLengths.length === 1 ? String(selectedLengths[0]) : ANY_VALUE;
	const capacityValue =
		selectedCapacities.length === 1 ? selectedCapacities[0] : ANY_VALUE;

	const settingsContent = (
		<div
			className={
				isSheet ? "flex flex-col gap-4 pb-2" : "flex flex-col gap-4 p-4"
			}
		>
			<div className="grid grid-cols-2 gap-3">
				<TextField
					select
					size="small"
					label="Length"
					value={lengthValue}
					onChange={handleLengthChange}
				>
					<MenuItem value={ANY_VALUE}>Any length</MenuItem>
					{MEETING_LENGTHS.map((length) => (
						<MenuItem key={length} value={String(length)}>
							{length} min
						</MenuItem>
					))}
				</TextField>
				<TextField
					select
					size="small"
					label="Capacity"
					value={capacityValue}
					onChange={handleCapacityChange}
				>
					<MenuItem value={ANY_VALUE}>Any size</MenuItem>
					{CAPACITIES.map((capacity) => (
						<MenuItem key={capacity} value={capacity}>
							{capacity}
						</MenuItem>
					))}
				</TextField>
			</div>

			<div className="flex flex-col gap-2">
				<div className="flex items-center justify-between">
					<Typography variant="caption" color="textSecondary">
						Buildings · pick any
					</Typography>
					<Button
						variant="text"
						size="small"
						disabled={selectedBuildings.length === 0}
						onClick={() => onFiltersChange({ ...filters, buildings: [] })}
					>
						Clear (all buildings)
					</Button>
				</div>
				<div className="flex flex-wrap gap-2">
					{BUILDINGS.map((building) => {
						const isSelected = selectedBuildings.includes(building);
						return (
							<Chip
								key={building}
								label={formatLocation(building)}
								clickable
								color={isSelected ? "primary" : "default"}
								variant={isSelected ? "filled" : "outlined"}
								onClick={() => handleToggleBuilding(building)}
							/>
						);
					})}
				</div>
			</div>

			{isLoading && <LinearProgress />}

			{errorMessage && (
				<Alert
					severity="error"
					action={
						onShowBestRooms && (
							<Button color="inherit" size="small" onClick={onShowBestRooms}>
								Retry
							</Button>
						)
					}
				>
					{errorMessage}
				</Alert>
			)}

			{hasSearched && !isLoading && filteredRooms.length === 0 && (
				<Typography variant="body2" color="textSecondary">
					{rawRooms.length === 0
						? "No available study rooms for the group's best times."
						: "No rooms match your current filters."}
				</Typography>
			)}

			{filteredRooms.length > 0 && (
				<>
					<Card
						variant="outlined"
						sx={isAnyRoomSelected ? selectedCardSx : undefined}
					>
						<CardActionArea
							onClick={handleToggleAnyRoom}
							onMouseEnter={handleAnyRoomMouseEnter}
							onMouseLeave={handleRoomMouseLeave}
							aria-pressed={isAnyRoomSelected}
						>
							<CardContent>
								<Typography variant="subtitle1">{anyRoomLabel}</Typography>
								<Typography variant="body2" color="textSecondary">
									Outlines every time at least one of these{" "}
									{filteredRooms.length} rooms is free
								</Typography>
							</CardContent>
						</CardActionArea>
					</Card>

					<Typography variant="body2" color="textSecondary">
						Hover to preview on the grid, click to pin.
					</Typography>

					{roomGroups.map(({ building, rooms }) => (
						<div key={building} className="flex flex-col gap-2">
							<div className="flex items-center justify-between">
								<Typography variant="overline">
									{formatLocation(building)}
								</Typography>
								<Typography variant="caption" color="textSecondary">
									{rooms.length} {rooms.length === 1 ? "room" : "rooms"}
								</Typography>
							</div>
							<Divider />
							{rooms.map((room) => {
								const isSelected =
									!isAnyRoomSelected &&
									effectiveSelectedRoomIds.includes(room.id);
								const details = [
									room.capacity != null ? `${room.capacity} cap` : null,
									room.techEnhanced ? "Tech" : null,
									formatRoomFreeWindows(
										freeWindowsById.get(room.id) ?? [],
										timeZone,
									) || null,
								]
									.filter(Boolean)
									.join(" · ");

								return (
									<Card
										key={room.id}
										variant="outlined"
										sx={isSelected ? selectedCardSx : undefined}
									>
										<CardActionArea
											onClick={() => handleToggleRoom(room)}
											onMouseEnter={() => handleRoomMouseEnter(room)}
											onMouseLeave={handleRoomMouseLeave}
											aria-pressed={isSelected}
										>
											<CardContent>
												<Typography variant="subtitle1">
													{formatRoomChipLabel(room.location, room.label)}
												</Typography>
												<Typography variant="body2" color="textSecondary">
													{details}
												</Typography>
											</CardContent>
										</CardActionArea>
										{isSelected && selectedBookingUrl && (
											<CardActions>
												<Button
													href={selectedBookingUrl}
													target="_blank"
													rel="noopener noreferrer"
													size="small"
												>
													Book room
												</Button>
											</CardActions>
										)}
									</Card>
								);
							})}
						</div>
					))}
				</>
			)}
		</div>
	);

	if (isSheet) {
		return (
			<div className="min-w-0">
				<div className="mb-4">
					<Typography variant="h6">Room Recommendations</Typography>
					<Typography variant="caption" color="textSecondary">
						Rooms free during the group's best times.
					</Typography>
				</div>
				{settingsContent}
			</div>
		);
	}

	return settingsContent;
}
