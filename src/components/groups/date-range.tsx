import { formatDateToUSNumeric } from "@/lib/availability/utils";
import { isAnchorDateString, WEEKDAYS } from "@/lib/types/chrono";

export function DateRange({
	dates,
	meetingType,
}: {
	dates: string[];
	meetingType: "dates" | "days";
}) {
	if (!dates.length) return <>No dates specified</>;

	if (meetingType === "days") {
		const weekdayData = dates.flatMap((dateStr) => {
			const dateString = dateStr.split("T")[0];
			if (!isAnchorDateString(dateString)) return [];

			const dayIndex = new Date(dateStr).getUTCDay();
			return [{ dayIndex, name: WEEKDAYS[dayIndex] }];
		});

		if (weekdayData.length > 0) {
			const sortedNames = [...weekdayData]
				.sort((a, b) => a.dayIndex - b.dayIndex)
				.map((d) => d.name);
			return <>{sortedNames.join(", ")}</>;
		}
	}

	if (dates.length === 1) {
		return <>{formatDateToUSNumeric(new Date(dates[0]))}</>;
	}

	const sorted = [...dates].sort(
		(a, b) => new Date(a).getTime() - new Date(b).getTime(),
	);

	return (
		<>
			{formatDateToUSNumeric(new Date(sorted[0]))} -{" "}
			{formatDateToUSNumeric(new Date(sorted[sorted.length - 1]))}
		</>
	);
}
