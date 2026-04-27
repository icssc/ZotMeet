"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { ZotDate } from "@/lib/zotdate";
import { useAvailabilityStore } from "@/store/useAvailabilityStore";

interface UseAvailabilityEditorProps {
	currentAvailabilityDates: ZotDate[];
	currentIfNeededDates: ZotDate[];
}

function availabilityEqual(a: ZotDate[], b: ZotDate[]): boolean {
	if (a.length !== b.length) return false;
	for (let i = 0; i < a.length; i++) {
		const av = a[i].availability;
		const bv = b[i].availability;
		if (av.length !== bv.length) return false;
		const aSet = new Set(av);
		for (const t of bv) if (!aSet.has(t)) return false;
	}
	return true;
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
	const prevViewRef = useRef(availabilityView);

	useEffect(() => {
		const prev = prevViewRef.current;
		prevViewRef.current = availabilityView;
		if (prev !== "personal" && availabilityView === "personal") {
			setOriginalAvailabilityDates(
				currentAvailabilityDates.map((date) => date.clone()),
			);
			setOriginalIfNeededDates(
				currentIfNeededDates.map((date) => date.clone()),
			);
		}
	}, [availabilityView, currentAvailabilityDates, currentIfNeededDates]);

	const cancelEdit = (): {
		availabilityDates: ZotDate[];
		ifNeededDates: ZotDate[];
	} => {
		return {
			availabilityDates: originalAvailabilityDates.map((date) => date.clone()),
			ifNeededDates: originalIfNeededDates.map((date) => date.clone()),
		};
	};

	const confirmSave = () => {
		setOriginalAvailabilityDates(
			currentAvailabilityDates.map((date) => date.clone()),
		);
		setOriginalIfNeededDates(currentIfNeededDates.map((date) => date.clone()));
	};

	const isDirty = useMemo(() => {
		if (availabilityView !== "personal") return false;
		return (
			!availabilityEqual(currentAvailabilityDates, originalAvailabilityDates) ||
			!availabilityEqual(currentIfNeededDates, originalIfNeededDates)
		);
	}, [
		availabilityView,
		currentAvailabilityDates,
		currentIfNeededDates,
		originalAvailabilityDates,
		originalIfNeededDates,
	]);

	return {
		isDirty,
		cancelEdit,
		confirmSave,
	};
}
