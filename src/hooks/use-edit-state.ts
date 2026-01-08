"use client";

import { useEffect, useState } from "react";
import type { ZotDate } from "@/lib/zotdate";
import { useAvailabilityViewStore } from "@/store/useAvailabilityViewStore";

interface UseAvailabilityEditorProps {
	currentAvailabilityDates: ZotDate[];
}

export function useEditState({
	currentAvailabilityDates,
}: UseAvailabilityEditorProps) {
	const { availabilityView } = useAvailabilityViewStore();

	const [originalAvailabilityDates, setOriginalAvailabilityDates] = useState<
		ZotDate[]
	>([]);
	const [isEditingAvailability, setIsEditingAvailability] = useState(false);

	useEffect(() => {
		if (availabilityView === "personal" && !isEditingAvailability) {
			setOriginalAvailabilityDates(
				currentAvailabilityDates.map((date) => date.clone()),
			);
			setIsEditingAvailability(true);
		} else if (availabilityView === "group" && isEditingAvailability) {
			setIsEditingAvailability(false);
		}
	}, [availabilityView, isEditingAvailability, currentAvailabilityDates]);

	const cancelEdit = () => {
		setIsEditingAvailability(false);
		return originalAvailabilityDates.map((date) => date.clone());
	};

	const confirmSave = () => {
		setOriginalAvailabilityDates(
			currentAvailabilityDates.map((date) => date.clone()),
		);
		setIsEditingAvailability(false);
	};

	return {
		isEditingAvailability,
		cancelEdit,
		confirmSave,
	};
}
