"use client";

import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import { Button, Chip, IconButton, Paper, Typography } from "@mui/material";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
	deduplicateRooms,
	filterRoomResults,
	getRoomBookingUrl,
	type StudyRoomApiEntry,
} from "@/components/availability/room-recommendations";
import { useStudyRoomHover } from "@/components/availability/table/study-room-hover-context";
import { formatRoomChipLabel, type RoomFilters } from "@/lib/types/studyrooms";

export interface MobileRoomWheelPickerProps {
	rawRooms: StudyRoomApiEntry[];
	rawRoomsByKey: Map<string, StudyRoomApiEntry[]>;
	filters: RoomFilters;
	selectedRoomIds: string[];
	onSelectedRoomIdsChange: (ids: string[]) => void;
}

export function MobileRoomWheelPicker({
	rawRooms,
	rawRoomsByKey,
	filters,
	selectedRoomIds,
	onSelectedRoomIdsChange,
}: MobileRoomWheelPickerProps) {
	const { setHoveredRoom } = useStudyRoomHover();
	const [activeIndex, setActiveIndex] = useState(0);
	const chipRefs = useRef<(HTMLDivElement | null)[]>([]);

	const rooms = useMemo(() => {
		return filterRoomResults(deduplicateRooms(rawRooms), filters);
	}, [rawRooms, filters]);

	// Clamp activeIndex when room list shrinks
	useEffect(() => {
		if (rooms.length === 0) return;
		setActiveIndex((prev) => Math.min(prev, rooms.length - 1));
	}, [rooms.length]);

	// Drive the heatmap preview whenever the active room changes
	useEffect(() => {
		if (rooms.length === 0) {
			setHoveredRoom(null);
			return;
		}
		const activeRoom = rooms[activeIndex];
		if (!activeRoom) return;

		setHoveredRoom(rawRoomsByKey.get(activeRoom.id) ?? null);

		chipRefs.current[activeIndex]?.scrollIntoView({
			behavior: "smooth",
			block: "nearest",
			inline: "center",
		});
	}, [activeIndex, rooms, rawRoomsByKey, setHoveredRoom]);

	// Clear preview when the picker unmounts
	useEffect(() => {
		return () => {
			setHoveredRoom(null);
		};
	}, [setHoveredRoom]);

	const handlePrev = useCallback(() => {
		setActiveIndex((i) => Math.max(0, i - 1));
	}, []);

	const handleNext = useCallback(() => {
		setActiveIndex((i) => Math.min(rooms.length - 1, i + 1));
	}, [rooms.length]);

	const handleChipClick = useCallback(
		(index: number, roomId: string) => {
			if (index !== activeIndex) {
				// Navigate to this room, which triggers the hover preview
				setActiveIndex(index);
				return;
			}
			// Toggle pin on the currently-active room
			const next = selectedRoomIds.includes(roomId)
				? selectedRoomIds.filter((id) => id !== roomId)
				: [...selectedRoomIds, roomId];
			onSelectedRoomIdsChange(next);
		},
		[activeIndex, selectedRoomIds, onSelectedRoomIdsChange],
	);

	const activeRoom = rooms[activeIndex];
	const activeRoomIsPinned =
		activeRoom != null && selectedRoomIds.includes(activeRoom.id);
	const activeBookingUrl = useMemo(() => {
		if (!activeRoomIsPinned || !activeRoom) return null;
		return getRoomBookingUrl(rawRoomsByKey.get(activeRoom.id), filters.lengths);
	}, [activeRoomIsPinned, activeRoom, rawRoomsByKey, filters.lengths]);

	if (rooms.length === 0) return null;

	return (
		<div
			className="pointer-events-none fixed inset-x-0 z-[1000] flex justify-center px-2"
			style={{
				bottom: "calc(max(4rem, env(safe-area-inset-bottom)) + 4.5rem)",
			}}
		>
			<Paper
				elevation={3}
				sx={{
					pointerEvents: "auto",
					borderRadius: 3,
					px: 0.5,
					py: 0.75,
					width: "90vw",
					maxWidth: "100%",
					boxSizing: "border-box",
				}}
			>
				<div className="flex items-center gap-0.5">
					<IconButton
						size="small"
						onClick={handlePrev}
						disabled={activeIndex === 0}
						aria-label="Previous room"
					>
						<ChevronLeft fontSize="small" />
					</IconButton>

					{/* Scrollable chip track */}
					<div
						className="flex min-w-0 flex-1 items-center gap-2 overflow-x-auto py-0.5"
						style={{ scrollbarWidth: "none", scrollSnapType: "x mandatory" }}
					>
						{rooms.map((room, i) => {
							const chipLabel = [
								formatRoomChipLabel(room.location, room.label),
								room.capacity != null ? `· ${room.capacity} cap` : null,
								room.techEnhanced ? "· Tech" : null,
							]
								.filter(Boolean)
								.join(" ");
							const isActive = i === activeIndex;
							const isSelected = selectedRoomIds.includes(room.id);

							return (
								<div
									key={room.id}
									ref={(el) => {
										chipRefs.current[i] = el;
									}}
									style={{ scrollSnapAlign: "center", flexShrink: 0 }}
								>
									<Chip
										label={chipLabel}
										clickable
										variant={isActive ? "filled" : "outlined"}
										color={isActive || isSelected ? "primary" : "default"}
										onClick={() => handleChipClick(i, room.id)}
										size="small"
										sx={isActive ? { fontWeight: 600 } : { opacity: 0.6 }}
									/>
								</div>
							);
						})}
					</div>

					<IconButton
						size="small"
						onClick={handleNext}
						disabled={activeIndex === rooms.length - 1}
						aria-label="Next room"
					>
						<ChevronRight fontSize="small" />
					</IconButton>
				</div>

				{activeBookingUrl && (
					<div className="px-1 pt-0.5 pb-1">
						<Button
							href={activeBookingUrl}
							target="_blank"
							rel="noopener noreferrer"
							variant="contained"
							color="primary"
							size="small"
							fullWidth
							sx={{ borderRadius: "8px" }}
						>
							Book Room
						</Button>
					</div>
				)}

				<Typography
					variant="caption"
					color="textSecondary"
					sx={{
						display: "block",
						textAlign: "center",
						lineHeight: 1.2,
						pb: 0.25,
					}}
				>
					{activeIndex + 1} / {rooms.length}
					{" · "}
					{activeRoomIsPinned ? "Pinned" : "Tap to pin"}
				</Typography>
			</Paper>
		</div>
	);
}
