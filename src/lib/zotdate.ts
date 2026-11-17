/**
 * `ZotDate` lives in `@zotmeet/shared` so the Expo app computes availability
 * cells from the same model; this module keeps the web's import path stable
 * and holds the one helper that needs the DOM.
 */
import { ZotDate } from "@zotmeet/shared";

export { ZotDate };

/**
 * Extracts data attributes from a DOM element in the calendar that represents a day
 * @param element a DOM element in the calendar that represents a day
 * @returns a ZotDate object that is represented by the DOM element
 */
export function extractZotDateFromElement(element: Element): ZotDate | null {
	const day = parseInt(element.getAttribute("data-day") ?? "", 10);
	const month = parseInt(element.getAttribute("data-month") ?? "", 10);
	const year = parseInt(element.getAttribute("data-year") ?? "", 10);
	const isSelected = element.getAttribute("data-selected") === "true";

	if (
		[day, month, year, isSelected].every(
			(attr) => !Number.isNaN(attr) && attr !== null,
		)
	) {
		const newDay = new Date(year, month, day);
		return new ZotDate(newDay, undefined, undefined, isSelected);
	}

	return null;
}
