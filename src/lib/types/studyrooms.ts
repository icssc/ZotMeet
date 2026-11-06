import type { StudyRoomLike } from "@zotmeet/shared";
import type { paths } from "@/lib/types/anteater-api-types";

// Room naming lives in `@zotmeet/shared`; re-exported so imports stay put.
export {
	BUILDINGS,
	type Building,
	extractRoomNumber,
	formatLocation,
	formatRoomChipLabel,
	LOCATION_DISPLAY_NAMES,
	stripRoomDurationSuffix,
} from "@zotmeet/shared";

export type StudyRoomsByFilters =
	paths["/v2/rest/studyRooms"]["get"]["parameters"]["query"];

export type StudyRooms =
	paths["/v2/rest/studyRooms"]["get"]["responses"]["200"]["content"]["application/json"];

/**
 * `@zotmeet/shared` matches rooms against a structural copy of an API entry;
 * this fails the typecheck if the generated API types drift from it.
 */
const _apiRoomMatchesShared: StudyRoomLike =
	null as unknown as StudyRooms["data"][number];
void _apiRoomMatchesShared;

// Structured capacity ranges so consumers never have to parse the label string.
// `max` is omitted for the open-ended bucket ("13+").
export const CAPACITY_RANGES = [
	{ label: "1-2", min: 1, max: 2 },
	{ label: "3-4", min: 3, max: 4 },
	{ label: "5-6", min: 5, max: 6 },
	{ label: "7-8", min: 7, max: 8 },
	{ label: "9-12", min: 9, max: 12 },
	{ label: "13+", min: 13 },
] as const;
export type Capacity = (typeof CAPACITY_RANGES)[number]["label"];
