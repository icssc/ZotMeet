export function convertIsoToDate(isoDateString: string): string {
  const options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
  };

  const date = new Date(isoDateString);
  return date.toLocaleDateString("en-US", { ...options, timeZone: "UTC" });
}

export function convertIsoToWeekdayDate(isoDateString: string): string {
  const options: Intl.DateTimeFormatOptions = {
    weekday: "short",
    month: "short",
    day: "numeric",
  };

  const date = new Date(isoDateString);
  return date.toLocaleDateString("en-US", { ...options, timeZone: "UTC" });
}

export function convertTo12HourFormat(time: string): string {
  const [hours, minutes] = time.split(":");
  let period = "am";

  let hours12 = parseInt(hours, 10);

  if (hours12 >= 12) {
    period = "pm";
    if (hours12 > 12) {
      hours12 -= 12;
    }
  }

  return `${hours12}:${minutes} ${period}`;
}
