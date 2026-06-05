"use client";

import {
	Button,
	Chip,
	CircularProgress,
	Collapse,
	Divider,
	Typography,
} from "@mui/material";
import { ChevronDownIcon, ChevronUpIcon, SparklesIcon } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useStudyRoomHover } from "@/components/availability/table/study-room-hover-context";
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

interface RoomResult {
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

function getRoomBookingUrl(
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
}

function FilterChipGroup<T extends string | number>({
	options,
	selected,
	onToggle,
	onClear,
	getLabel,
}: {
	options: readonly T[];
	selected: T[];
	onToggle: (value: T) => void;
	onClear: () => void;
	getLabel?: (value: T) => string;
}) {
	return (
		<div className="flex flex-col gap-2">
			<div className="flex flex-wrap gap-2">
				{options.map((opt) => (
					<Chip
						key={String(opt)}
						label={getLabel ? getLabel(opt) : String(opt)}
						clickable
						variant="outlined"
						color={selected.includes(opt) ? "primary" : "default"}
						onClick={() => onToggle(opt)}
						sx={{ maxWidth: "100%" }}
					/>
				))}
			</div>
			<div className="flex justify-end">
				<Button
					variant="text"
					size="small"
					onClick={onClear}
					sx={{
						color: "text.secondary",
						textTransform: "none",
						fontSize: "0.75rem",
					}}
				>
					Clear Selected
				</Button>
			</div>
		</div>
	);
}

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
}: RoomRecommendationSettingsProps) {
	const isSheet = layout === "sheet";
	const [isOpen, setIsOpen] = useState(isSheet);
	const [filtersOpen, setFiltersOpen] = useState(true);

	const roomResults = useMemo(() => deduplicateRooms(rawRooms), [rawRooms]);

	const rawRoomsByKey = useMemo(() => groupRawRoomsByKey(rawRooms), [rawRooms]);

	const { setHoveredRoom } = useStudyRoomHover();

	const {
		lengths: selectedLengths,
		capacities: selectedCapacities,
		buildings: selectedBuildings,
	} = filters;

	const [internalSelectedRoomIds, setInternalSelectedRoomIds] = useState<
		string[]
	>([]);
	const isSelectionControlled = selectedRoomIds !== undefined;
	const effectiveSelectedRoomIds = isSelectionControlled
		? selectedRoomIds
		: internalSelectedRoomIds;

	const selectedBookingUrl = useMemo(() => {
		if (effectiveSelectedRoomIds.length !== 1) return null;
		return getRoomBookingUrl(
			rawRoomsByKey.get(effectiveSelectedRoomIds[0]),
			selectedLengths,
		);
	}, [effectiveSelectedRoomIds, rawRoomsByKey, selectedLengths]);

	const filteredRooms = useMemo(() => {
		return roomResults.filter((room) => {
			if (selectedCapacities.length > 0) {
				if (room.capacity == null) return false;
				const matchesCapacity = selectedCapacities.some((range) => {
					if (range === "13+")
						return room.capacity != null && room.capacity >= 13;
					const [min, max] = range.split("-").map(Number);
					return (
						room.capacity != null &&
						room.capacity >= min &&
						room.capacity <= max
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

			if (selectedLengths.length > 0 && room.durations.length > 0) {
				const matchesLength = room.durations.some((d) =>
					selectedLengths.includes(d),
				);
				if (!matchesLength) return false;
			}

			return true;
		});
	}, [roomResults, selectedCapacities, selectedBuildings, selectedLengths]);

	const roomState = useMemo(() => {
		if (!hasSearched) return { status: "initial" as const };
		if (!filteredRooms.length) return { status: "empty" as const };
		return { status: "results" as const, rooms: filteredRooms };
	}, [hasSearched, filteredRooms]);

	const hasResults = roomState.status === "results";

	// Collapse the filters only the first time results appear, so a later search
	// doesn't override the user reopening them.
	const hasAutoCollapsedFilters = useRef(false);
	useEffect(() => {
		if (hasResults && !hasAutoCollapsedFilters.current) {
			hasAutoCollapsedFilters.current = true;
			setFiltersOpen(false);
		}
	}, [hasResults]);

	const handleToggleLength = useCallback(
		(v: MeetingLength) => {
			onFiltersChange({ ...filters, lengths: toggle(selectedLengths, v) });
		},
		[filters, selectedLengths, onFiltersChange],
	);

	const handleToggleCapacity = useCallback(
		(v: Capacity) => {
			onFiltersChange({
				...filters,
				capacities: toggle(selectedCapacities, v),
			});
		},
		[filters, selectedCapacities, onFiltersChange],
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
			const next = toggle(effectiveSelectedRoomIds, room.id);
			if (isSelectionControlled) {
				onSelectedRoomIdsChange?.(next);
			} else {
				setInternalSelectedRoomIds(next);
			}
			onRoomSelect?.(room, next.includes(room.id));
		},
		[
			effectiveSelectedRoomIds,
			isSelectionControlled,
			onSelectedRoomIdsChange,
			onRoomSelect,
		],
	);

	const handleRoomChipMouseEnter = useCallback(
		(room: RoomResult) => {
			const variants = rawRoomsByKey.get(room.id) ?? null;
			setHoveredRoom(variants);
		},
		[rawRoomsByKey, setHoveredRoom],
	);

	const handleRoomChipMouseLeave = useCallback(() => {
		setHoveredRoom(null);
	}, [setHoveredRoom]);

	const settingsContent = (
		<div
			className={
				isSheet ? "flex flex-col gap-4 pb-2" : "flex flex-col gap-4 px-4 pb-5"
			}
		>
			<Button
				variant="contained"
				color="primary"
				fullWidth
				disabled={isLoading}
				startIcon={
					isLoading ? (
						<CircularProgress size={16} color="inherit" />
					) : (
						<SparklesIcon size={16} />
					)
				}
				onClick={onShowBestRooms}
				sx={{ borderRadius: "8px", py: 1.25 }}
			>
				{isLoading ? "Loading…" : "Show Best Rooms"}
			</Button>

			{errorMessage && (
				<Typography variant="body2" color="error">
					{errorMessage}
				</Typography>
			)}

			<Divider />

			<div className="flex flex-col gap-4">
				<button
					type="button"
					className="flex w-full items-center justify-between text-left"
					onClick={() => setFiltersOpen((v) => !v)}
					aria-expanded={!hasResults || filtersOpen}
				>
					<Typography variant="h6">Room Filters</Typography>
					{hasResults &&
						(filtersOpen ? (
							<ChevronUpIcon size={20} className="shrink-0 text-slate-400" />
						) : (
							<ChevronDownIcon size={20} className="shrink-0 text-slate-400" />
						))}
				</button>

				<Collapse in={!hasResults || filtersOpen} timeout="auto">
					<div className="flex flex-col gap-4">
						<div className="flex flex-col gap-1">
							<Typography variant="subtitle2" color="textSecondary">
								Meeting Length
							</Typography>
							<FilterChipGroup
								options={MEETING_LENGTHS}
								selected={selectedLengths}
								onToggle={handleToggleLength}
								onClear={() => onFiltersChange({ ...filters, lengths: [] })}
							/>
						</div>

						<div className="flex flex-col gap-1">
							<Typography variant="subtitle2" color="textSecondary">
								Capacity
							</Typography>
							<FilterChipGroup
								options={CAPACITIES}
								selected={selectedCapacities}
								onToggle={handleToggleCapacity}
								onClear={() => onFiltersChange({ ...filters, capacities: [] })}
							/>
						</div>

						<div className="flex flex-col gap-1">
							<Typography variant="subtitle2" color="textSecondary">
								Buildings
							</Typography>
							<FilterChipGroup
								options={BUILDINGS}
								selected={selectedBuildings}
								onToggle={handleToggleBuilding}
								getLabel={formatLocation}
								onClear={() => onFiltersChange({ ...filters, buildings: [] })}
							/>
						</div>
					</div>
				</Collapse>
			</div>

			<Divider />

			<div className="flex flex-col gap-2">
				{roomState.status === "results" && (
					<div>
						<div className="mb-4 flex items-center">
							<Typography variant="h6">Room Results</Typography>
							{selectedBookingUrl && (
								<div className="ml-auto">
									<Button
										href={selectedBookingUrl}
										variant="outlined"
										target="_blank"
										rel="noopener noreferrer"
										size="small"
									>
										Book Room
									</Button>
								</div>
							)}
						</div>
						<Typography variant="caption" color="textSecondary">
							Click a chip to pin a room on the calendar. Hover to preview
							without pinning.
						</Typography>

						{effectiveSelectedRoomIds.length > 1 && (
							<Typography variant="caption" color="error">
								<br />
								You can only book one room at a time
							</Typography>
						)}
					</div>
				)}

				{roomState.status === "empty" && (
					<Typography
						variant="caption"
						color="textSecondary"
						className="italic"
					>
						{rawRooms.length === 0
							? "No available study rooms for the selected times."
							: "No rooms match your current filters."}
					</Typography>
				)}

				{roomState.status === "results" && (
					<div
						className={
							isSheet
								? "flex max-h-60 flex-wrap gap-2 overflow-y-auto"
								: "flex max-h-40 flex-wrap gap-2 overflow-y-auto"
						}
					>
						{roomState.rooms.map((room) => {
							const isSelected = effectiveSelectedRoomIds.includes(room.id);
							const label = [
								formatRoomChipLabel(room.location, room.label),
								room.capacity != null ? `· ${room.capacity} cap` : null,
								room.techEnhanced ? "· Tech" : null,
							]
								.filter(Boolean)
								.join(" ");

							return (
								<Chip
									key={room.id}
									label={label}
									clickable
									variant="outlined"
									color={isSelected ? "primary" : "default"}
									onClick={() => handleToggleRoom(room)}
									onMouseEnter={() => handleRoomChipMouseEnter(room)}
									onMouseLeave={handleRoomChipMouseLeave}
									sx={{ maxWidth: "100%" }}
								/>
							);
						})}
					</div>
				)}
			</div>
		</div>
	);

	if (isSheet) {
		return (
			<div className="min-w-0">
				<div className="mb-4">
					<Typography variant="h6">Room Recommendations</Typography>
					<Typography variant="caption" color="textSecondary">
						Auto-generate the rooms that are most compatible with the Attendee
						Responder results.
					</Typography>
				</div>
				{settingsContent}
			</div>
		);
	}

	return (
		<div className="min-w-0 lg:shrink-0">
			<div className="w-full rounded-xl border border-divider bg-paper lg:w-96">
				<button
					type="button"
					className="flex w-full items-center justify-between px-4 py-3 text-left"
					onClick={() => setIsOpen((v) => !v)}
					aria-expanded={isOpen}
				>
					<div>
						<Typography variant="h6">Room Recommendation Settings</Typography>
						<Typography variant="caption" color="textSecondary">
							Auto-generate the rooms that are most compatible with the Attendee
							Responder results.
						</Typography>
					</div>
					<span className="ml-2 shrink-0 text-slate-400">
						{isOpen ? (
							<ChevronUpIcon size={20} />
						) : (
							<ChevronDownIcon size={20} />
						)}
					</span>
				</button>
				<Collapse in={isOpen} timeout="auto" unmountOnExit>
					{settingsContent}
				</Collapse>
			</div>
		</div>
	);
}
