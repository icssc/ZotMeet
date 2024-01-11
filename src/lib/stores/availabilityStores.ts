import { writable } from "svelte/store";

import type { Availability } from "$lib/components/availability/Availability";

export const selectedAvailability = writable<Availability[]>([]);
