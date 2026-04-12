export const formatISOToLocalTime = (isoString: string): string => {
	return new Date(isoString)
		.toLocaleTimeString("en-US", {
			hour: "numeric",
			minute: "2-digit",
			hour12: true,
			//timeZone: "UTC",
		})
		.toLowerCase();
};

// returns an array of formatted times in 30 min intervals
export const buildTimeArray = (
	slotStart: string,
	slotEnd: string,
): string[] => {
	const timestamps = [];

	const start = new Date(slotStart);
	const end = new Date(slotEnd);

	let current = start;
	while (current < end) {
		timestamps.push(formatISOToLocalTime(current.toISOString()));
		current = new Date(current.getTime() + 30 * 60 * 1000);
	}

	return timestamps;
};
