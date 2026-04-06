// Formats minutes since midnight back to a display string like "1:00pm".
export const formatMinutes = (mins: number): string => {
	const totalMins = mins % (24 * 60);
	const hours = Math.floor(totalMins / 60);
	const minutes = totalMins % 60;
	const period = hours >= 12 ? "pm" : "am";
	const displayHour = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
	return `${displayHour}:${String(minutes).padStart(2, "0")}${period}`;
};
