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
		const weekdayData = dates
			.map((dateStr) => {
				const dateString = dateStr.split("T")[0];

				if (!isAnchorDateString(dateString)) {
					return null;
				}

				const date = new Date(dateStr);
				const dayIndex = date.getUTCDay();

				return {
					dayIndex,
					name: WEEKDAYS[dayIndex],
				};
			})
			.filter(Boolean) as {
			dayIndex: number;
			name: string;
		}[];

		if (weekdayData.length > 0) {
			return (
				<>
					{weekdayData
						.sort((a, b) => a.dayIndex - b.dayIndex)
						.map((d) => d.name)
						.join(", ")}
				</>
			);
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
