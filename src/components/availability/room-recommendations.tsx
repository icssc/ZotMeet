"use client";

import { Button, Chip, Collapse, Divider, Typography } from "@mui/material";
import { ChevronDownIcon, ChevronUpIcon, SparklesIcon } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";

export interface StudyRoomApiEntry {
	id: string;
	name: string;
	capacity: number | null;
	location: string;
	description: string;
	directions: string;
	techEnhanced: boolean | null;
	url: string;
	slots: {
		studyRoomId: string;
		start: string;
		end: string;
		url: string;
		isAvailable: boolean;
	}[];
}

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
	durations: number[];
}

function toggle<T>(arr: T[], val: T): T[] {
	return arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val];
}

// Collapse multiple duration variants of the same physical room into one entry.
export function deduplicateRooms(rooms: StudyRoomApiEntry[]): RoomResult[] {
	const seen = new Map<string, RoomResult>();

	for (const room of rooms) {
		const baseName = room.name.replace(/\s*\(\d+\s*hours?\)/i, "").trim();

		const key = `${baseName}|${room.location}`;

		const availableCount = room.slots.filter((s) => s.isAvailable).length;
		const firstAvailableSlot = room.slots.find((s) => s.isAvailable);
		const bookingUrl = firstAvailableSlot?.url ?? room.url;
		const durationMatch = room.name.match(/\((\d+)\s*hours?\)/i);
		const duration = durationMatch ? Number(durationMatch[1]) * 60 : null;

		const existing = seen.get(key);
		if (!existing) {
			seen.set(key, {
				id: room.id,
				label: baseName || room.name,
				location: room.location,
				capacity: room.capacity,
				description: room.description,
				techEnhanced: room.techEnhanced,
				bookingUrl,
				durations: duration ? [duration] : [],
			});
		} else {
			const updatedDurations = new Set(existing.durations);
			if (duration) updatedDurations.add(duration);

			// Replace if this variant has more available slots (better booking URL)
			const existingCount = 0;
			if (availableCount > existingCount && firstAvailableSlot) {
				seen.set(key, { ...existing, durations: Array.from(updatedDurations) });
			}
		}
	}

	return Array.from(seen.values());
}

interface RoomRecommendationSettingsProps {
	onShowBestRooms?: () => void;
	onRoomSelect?: (room: RoomResult, selected: boolean) => void;
	rawRooms?: StudyRoomApiEntry[];
	onFiltersChange?: (filters: {
		capacities: string[];
		buildings: string[];
		lengths: number[];
	}) => void;
}

const MEETING_LENGTHS = [30, 60, 90, 120] as const;
type MeetingLength = (typeof MEETING_LENGTHS)[number];

const CAPACITIES = ["1-2", "3-4", "5-6", "7-8", "9-12", "13+"] as const;
type Capacity = (typeof CAPACITIES)[number];

const BUILDINGS = [
	"Anteater Learning Pavilion",
	"Science Library",
	"Langson Library",
	"Gateway Study Center",
	"Courtyard Study Lounge",
] as const;
type Building = (typeof BUILDINGS)[number];

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
	rawRooms = [],
}: RoomRecommendationSettingsProps) {
	const [isOpen, setIsOpen] = useState(false);

	const roomResults = useMemo(
		() => deduplicateRooms(rawRooms ?? []),
		[rawRooms],
	);

	const [selectedLengths, setSelectedLengths] = useState<MeetingLength[]>([60]);
	const [selectedCapacities, setSelectedCapacities] = useState<Capacity[]>([
		"3-4",
	]);
	const [selectedBuildings, setSelectedBuildings] = useState<Building[]>([]);
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
					selectedLengths.includes(d as MeetingLength),
				);
				if (!matchesLength) return false;
			}

			return true;
		});
	}, [roomResults, selectedCapacities, selectedBuildings, selectedLengths]);

	const handleToggleLength = useCallback((v: MeetingLength) => {
		setSelectedLengths((prev) => toggle(prev, v));
	}, []);

	const handleToggleCapacity = useCallback((v: Capacity) => {
		setSelectedCapacities((prev) => toggle(prev, v));
	}, []);

	const handleToggleBuilding = useCallback((v: Building) => {
		setSelectedBuildings((prev) => toggle(prev, v));
	}, []);

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
	useEffect(() => {
		onFiltersChange?.({
			capacities: selectedCapacities,
			buildings: selectedBuildings,
			lengths: selectedLengths,
		});
	}, [selectedCapacities, selectedBuildings, selectedLengths, onFiltersChange]);

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
									onClear={() => setSelectedLengths([])}
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
									onClear={() => setSelectedCapacities([])}
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
									onClear={() => setSelectedBuildings([])}
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

							{filteredRooms.length === 0 ? (
								<Typography
									variant="caption"
									color="textSecondary"
									className="italic"
								>
									No rooms found. Click "Show Best Rooms" to search.
								</Typography>
							) : (
								<div className="flex flex-wrap gap-2">
									{filteredRooms.map((room) => {
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
													window.open(room.bookingUrl, "_blank")
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
