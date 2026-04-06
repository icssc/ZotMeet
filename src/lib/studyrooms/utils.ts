// Converts a time string like "11:00am" or "5:00pm" to minutes since midnight (UTC).
export const parseTimeStringToMinutes = (time: string): number => {
	const isPM = time.endsWith("pm");
	const isAM = time.endsWith("am");
	const cleaned = time.replace("am", "").replace("pm", "");
	const [h, m] = cleaned.split(":").map(Number);
	let hours = h;
	if (isPM && h !== 12) hours += 12;
	if (isAM && h === 12) hours = 0;
	return hours * 60 + (m || 0);
};

// Extracts the UTC time from an ISO string as minutes since midnight.
export const slotUTCMinutes = (isoString: string): number => {
	const d = new Date(isoString);
	return d.getUTCHours() * 60 + d.getUTCMinutes();
};

// Formats minutes since midnight back to a display string like "1:00pm".
export const formatMinutes = (mins: number): string => {
	const totalMins = mins % (24 * 60);
	const hours = Math.floor(totalMins / 60);
	const minutes = totalMins % 60;
	const period = hours >= 12 ? "pm" : "am";
	const displayHour = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
	return `${displayHour}:${String(minutes).padStart(2, "0")}${period}`;
};
