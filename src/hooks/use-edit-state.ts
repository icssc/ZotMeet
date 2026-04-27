"use client";

import { useEffect, useMemo, useState } from "react";
import type { ZotDate } from "@/lib/zotdate";
import { useAvailabilityStore } from "@/store/useAvailabilityStore";

interface UseAvailabilityEditorProps {
	currentAvailabilityDates: ZotDate[];
	currentIfNeededDates: ZotDate[];
}

function signature(dates: ZotDate[]): string {
	return JSON.stringify(dates.map((d) => d.availability));
}

export function useEditState({
	currentAvailabilityDates,
	currentIfNeededDates,
}: UseAvailabilityEditorProps) {
	const availabilityView = useAvailabilityStore(
		(state) => state.availabilityView,
	);

	const [originalAvailabilityDates, setOriginalAvailabilityDates] = useState<
		ZotDate[]
	>([]);
	const [originalIfNeededDates, setOriginalIfNeededDates] = useState<ZotDate[]>(
		[],
	);
	const [isEditingAvailability, setIsEditingAvailability] = useState(false);

	useEffect(() => {
		if (availabilityView === "personal" && !isEditingAvailability) {
			setOriginalAvailabilityDates(
				currentAvailabilityDates.map((date) => date.clone()),
			);
			setOriginalIfNeededDates(
				currentIfNeededDates.map((date) => date.clone()),
			);
			setIsEditingAvailability(true);
		} else if (availabilityView === "group" && isEditingAvailability) {
			setIsEditingAvailability(false);
		}
	}, [
		availabilityView,
		isEditingAvailability,
		currentAvailabilityDates,
		currentIfNeededDates,
	]);

	const cancelEdit = () => {
		setIsEditingAvailability(false);
		return [
			originalAvailabilityDates.map((date) => date.clone()),
			originalIfNeededDates.map((date) => date.clone()),
		];
	};

	const confirmSave = () => {
		setOriginalAvailabilityDates(
			currentAvailabilityDates.map((date) => date.clone()),
		);
		setOriginalIfNeededDates(currentIfNeededDates.map((date) => date.clone()));
		setIsEditingAvailability(false);
	};

	const isDirty = useMemo(() => {
		if (!isEditingAvailability) return false;
		if (
			signature(currentAvailabilityDates) !==
			signature(originalAvailabilityDates)
		) {
			return true;
		}
		return signature(currentIfNeededDates) !== signature(originalIfNeededDates);
	}, [
		isEditingAvailability,
		currentAvailabilityDates,
		currentIfNeededDates,
		originalAvailabilityDates,
		originalIfNeededDates,
	]);

	return {
		isEditingAvailability,
		isDirty,
		cancelEdit,
		confirmSave,
	};
}
