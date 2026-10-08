import { isValid, set, startOfDay } from "date-fns";

// Convert invalid times from MUI pickers to the 12 AM hour, keeping the minutes
export function timeOrHourZero(value: Date, previous: Date | null): Date {
	if (isValid(value)) return value;
	if (!previous) return startOfDay(new Date());
	return set(previous, { hours: 0, seconds: 0, milliseconds: 0 });
}
