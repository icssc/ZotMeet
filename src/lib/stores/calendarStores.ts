import { writable } from "svelte/store";

import type { CalendarDay } from "$lib/components/Calendar/CalendarDay";

export const selectedDays = writable<CalendarDay[]>([]);
