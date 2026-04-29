"use client";

import { Button, Chip, Collapse, Divider, Typography } from "@mui/material";
import { ChevronDownIcon, ChevronUpIcon, SparklesIcon } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import type { paths } from "@/lib/types/anteater-api-types";
import type { Building, Capacity, MeetingLength } from "@/lib/types/studyrooms";
import {
	BUILDINGS,
	CAPACITIES,
	MEETING_LENGTHS,
	MeetingLengthSchema,
} from "@/lib/types/studyrooms";
import { cn } from "@/lib/utils";

export type StudyRoomApiEntry = NonNullable<
	paths["/v2/rest/studyRooms"]["get"]["responses"]["200"]["content"]["application/json"]
>["data"][number];
interface RoomResult {
	id: string;
	label: string;
	location: string;
	capacity: number | null;
	description: string | null;
	//techEnhanced is currently not a filter on the front end.
	//I added it if we implement anything with that in the future
	techEnhanced: boolean | null;
	bookingUrl: string;
	durations: MeetingLength[];
}

function toggle<T>(arr: T[], val: T): T[] {
	return arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val];
}

// Collapse multiple duration variants of the same physical room into one entry.
export function deduplicateRooms(rooms: StudyRoomApiEntry[]): RoomResult[] {
	const seen = new Map<string, RoomResult & { availableCount: number }>();

	for (const room of rooms) {
		const baseName = room.name.replace(/\s*\(\d+\s*hours?\)/i, "").trim();

		const key = `${baseName}|${room.location}`;

		const availableCount = room.slots.filter((s) => s.isAvailable).length;
		const firstAvailableSlot = room.slots.find((s) => s.isAvailable);
		const bookingUrl = firstAvailableSlot?.url ?? room.url;
		const durationMatch = room.name.match(/\((\d+)\s*hours?\)/i);
		const rawDuration = durationMatch ? Number(durationMatch[1]) * 60 : null;
		const parsed = MeetingLengthSchema.safeParse(rawDuration);
		const duration = parsed.success ? parsed.data : null;
		const existing = seen.get(key);
		if (!existing) {
			seen.set(key, {
				id: room.id,
				label: baseName || room.name,
				location: room.location,
				capacity: room.capacity,
				description: room.description ?? null,
				techEnhanced: room.techEnhanced,
				bookingUrl,
				durations: duration ? [duration] : [],
				availableCount,
			});
		} else {
			const updatedDurations = new Set(existing.durations);
			if (duration) updatedDurations.add(duration);

			// Replace if this variant is better
			if (availableCount > existing.availableCount && firstAvailableSlot) {
				seen.set(key, {
					...existing,
					bookingUrl,
					durations: Array.from(updatedDurations),
					availableCount,
				});
			} else {
				// Still merge durations
				seen.set(key, {
					...existing,
					durations: Array.from(updatedDurations),
				});
			}
		}
	}

	return Array.from(seen.values());
}

interface RoomRecommendationSettingsProps {
	onShowBestRooms?: () => void;
	onRoomSelect?: (room: RoomResult, selected: boolean) => void;
	rawRooms?: StudyRoomApiEntry[];
	filters: {
		capacities: Capacity[];
		buildings: Building[];
		lengths: MeetingLength[];
	};
	onFiltersChange: (filters: {
		capacities: Capacity[];
		buildings: Building[];
		lengths: MeetingLength[];
	}) => void;
}

function FilterChipGroup<T extends string | number>({
	options,
	selected,
	onToggle,
	onClear,
}: {
	options: readonly T[];
	selected: T[];
	onToggle: (value: T) => void;
	onClear: () => void;
}) {
	return (
		<div className="flex flex-col gap-2">
			<div className="flex flex-wrap gap-2">
				{options.map((opt) => (
					<Chip
						key={String(opt)}
						label={String(opt)}
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
	onShowBestRooms,
	onRoomSelect,
	onFiltersChange,
	filters,
	rawRooms = [],
}: RoomRecommendationSettingsProps) {
	const [isOpen, setIsOpen] = useState(false);

	const roomResults = useMemo(() => deduplicateRooms(rawRooms), [rawRooms]);
	const {
		lengths: selectedLengths,
		capacities: selectedCapacities,
		buildings: selectedBuildings,
	} = filters;

	const [selectedRooms, setSelectedRooms] = useState<string[]>([]);

	const filteredRooms = useMemo(() => {
		return roomResults.filter((room) => {
			if (selectedCapacities.length > 0 && room.capacity != null) {
				const capacity = room.capacity;

				if (selectedCapacities.length > 0 && capacity != null) {
					const matchesCapacity = selectedCapacities.some((range) => {
						if (range === "13+") return capacity >= 13;

						const [min, max] = range.split("-").map(Number);
						return capacity >= min && capacity <= max;
					});
					if (!matchesCapacity) return false;
				}
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
		if (!rawRooms.length) {
			return { status: "initial" as const };
		}

		if (!filteredRooms.length) {
			return { status: "empty" as const };
		}

		return {
			status: "results" as const,
			rooms: filteredRooms,
		};
	}, [rawRooms.length, roomResults.length, filteredRooms]);

	const handleToggleLength = useCallback(
		(v: MeetingLength) => {
			onFiltersChange({
				...filters,
				lengths: toggle(selectedLengths, v),
			});
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
			setSelectedRooms((prev) => {
				const next = toggle(prev, room.id);
				onRoomSelect?.(room, next.includes(room.id));
				return next;
			});
		},
		[onRoomSelect],
	);

	return (
		<div className="min-w-0 lg:shrink-0">
			<div
				className={cn(
					"w-full rounded-xl border border-divider bg-paper transition-all duration-300 lg:w-96",
				)}
			>
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
					<div className="flex flex-col gap-4 px-4 pb-5">
						<Button
							variant="contained"
							color="primary"
							fullWidth
							startIcon={<SparklesIcon size={16} />}
							onClick={onShowBestRooms}
							sx={{ borderRadius: "8px", py: 1.25 }}
						>
							Show Best Rooms
						</Button>

						<Divider />

						<div className="flex flex-col gap-4">
							<Typography variant="h6">Room Filters</Typography>

							<div className="flex flex-col gap-1">
								<Typography variant="subtitle2" color="textSecondary">
									Meeting Length
								</Typography>
								<FilterChipGroup
									options={MEETING_LENGTHS}
									selected={selectedLengths}
									onToggle={handleToggleLength}
									onClear={() =>
										onFiltersChange({
											...filters,
											lengths: [],
										})
									}
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
									onClear={() =>
										onFiltersChange({
											...filters,
											capacities: [],
										})
									}
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
									onClear={() =>
										onFiltersChange({
											...filters,
											buildings: [],
										})
									}
								/>
							</div>
						</div>

						<Divider />

						<div className="flex flex-col gap-2">
							<div>
								<Typography variant="h6">Room Results</Typography>
								<Typography variant="caption" color="textSecondary">
									Select a specific room to see its availability overlaid on the
									calendar. Click the chip label to open the booking page.
								</Typography>
							</div>

							{roomState.status === "initial" && (
								<Typography
									variant="caption"
									color="textSecondary"
									className="italic"
								>
									Click "Show Best Rooms" to search for available study rooms.
								</Typography>
							)}

							{roomState.status === "empty" && (
								<Typography
									variant="caption"
									color="textSecondary"
									className="italic"
								>
									No rooms match your current filters.
								</Typography>
							)}

							{roomState.status === "results" && (
								<div className="flex flex-wrap gap-2">
									{roomState.rooms.map((room) => {
										const isSelected = selectedRooms.includes(room.id);
										const label = [
											room.label,
											room.capacity != null
												? `· ${room.capacity} people`
												: null,
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
												onDoubleClick={() =>
													window.open(
														room.bookingUrl,
														"_blank",
														"noopener,noreferrer",
													)
												}
												title={`${room.location}${room.description ? ` — ${room.description}` : ""}\nDouble-click to book`}
												sx={{ maxWidth: "100%" }}
											/>
										);
									})}
								</div>
							)}
						</div>
					</div>
				</Collapse>
			</div>
		</div>
	);
}
