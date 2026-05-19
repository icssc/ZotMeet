"use client";
import { useIsStudyRoomUnavailable } from "@/components/availability/table/study-room-hover-context";

interface StudyRoomsBlockProps {
	dateIndex: number;
	blockIndex: number;
}

export function StudyRoomsBlock({
	dateIndex,
	blockIndex,
}: StudyRoomsBlockProps) {
	const isUnavailable = useIsStudyRoomUnavailable(dateIndex, blockIndex);
	// console.log("StudyRoomsBlock fired", { dateIndex, blockIndex, isUnavailable });

	if (!isUnavailable) {
		return null;
	}

	return (
		<div
			aria-hidden
			className="pointer-events-none absolute inset-0"
			style={{
				backgroundColor: "rgba(0, 0, 0, 0.18)",
				zIndex: 5,
			}}
		/>
	);
}
