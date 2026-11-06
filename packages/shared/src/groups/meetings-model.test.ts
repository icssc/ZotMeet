import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { ANCHOR_DATES } from "../chrono/types";
import {
	buildGroupMeetingsModel,
	formatGroupMeetingDates,
	groupMeetingStatus,
} from "./meetings-model";
import type { GroupMeetingItem } from "./schema";

const TODAY = new Date(2026, 0, 20).getTime();
const day = (offset: number) => new Date(TODAY + offset * 86_400_000);

function meeting(overrides: Partial<GroupMeetingItem>): GroupMeetingItem {
	return {
		id: "m",
		title: "Meeting",
		hostId: "host",
		hostName: "Host",
		meetingType: "dates",
		dates: [day(10).toISOString()],
		scheduledDate: null,
		totalMembers: 12,
		respondedCount: 0,
		userHasResponded: false,
		...overrides,
	};
}

describe("groupMeetingStatus", () => {
	it("needs availability until the member responds, unless scheduled", () => {
		assert.equal(groupMeetingStatus(meeting({})), "availability-needed");
		assert.equal(
			groupMeetingStatus(meeting({ userHasResponded: true })),
			"responded",
		);
		assert.equal(
			groupMeetingStatus(meeting({ scheduledDate: day(1).toISOString() })),
			null,
		);
	});
});

describe("formatGroupMeetingDates", () => {
	it("shows a consecutive run as a range", () => {
		const dates = [20, 21, 22, 23, 24].map((d) =>
			new Date(Date.UTC(2026, 0, d)).toISOString(),
		);
		assert.equal(
			formatGroupMeetingDates({ meetingType: "dates", dates }),
			"1/20/26 - 1/24/26",
		);
	});

	it("shows gaps as Multiple Dates and one day on its own", () => {
		const iso = (d: number) => new Date(Date.UTC(2026, 0, d)).toISOString();
		assert.equal(
			formatGroupMeetingDates({
				meetingType: "dates",
				dates: [iso(20), iso(22)],
			}),
			"Multiple Dates",
		);
		assert.equal(
			formatGroupMeetingDates({ meetingType: "dates", dates: [iso(20)] }),
			"1/20/26",
		);
	});

	it("lists weekdays for a days-of-week meeting", () => {
		assert.equal(
			formatGroupMeetingDates({
				meetingType: "days",
				dates: [1, 2, 3].map((i) => ANCHOR_DATES[i].toISOString()),
			}),
			"Mon - Wed",
		);
	});
});

describe("buildGroupMeetingsModel", () => {
	const meetings = [
		meeting({ id: "needs", title: "Social", hostId: "me" }),
		meeting({
			id: "soon",
			title: "Standup",
			userHasResponded: true,
			scheduledDate: day(1).toISOString(),
		}),
		meeting({ id: "later", title: "Retreat", userHasResponded: true }),
	];
	const build = (filter: "all" | "created" | "upcoming", search = "") =>
		buildGroupMeetingsModel({
			meetings,
			memberId: "me",
			filter,
			search,
			todayMs: TODAY,
		});
	const ids = (list: GroupMeetingItem[]) => list.map((m) => m.id);

	it("splits into action required, upcoming and the rest", () => {
		const model = build("all");
		assert.deepEqual(ids(model.actionRequired), ["needs"]);
		assert.deepEqual(ids(model.upcoming), ["soon"]);
		assert.deepEqual(ids(model.rest), ["later"]);
	});

	it("filters by creator, upcoming and title", () => {
		assert.deepEqual(ids(build("created").actionRequired), ["needs"]);
		assert.deepEqual(ids(build("created").rest), []);
		assert.deepEqual(ids(build("upcoming").upcoming), ["soon"]);
		assert.deepEqual(ids(build("upcoming").actionRequired), []);
		assert.deepEqual(ids(build("all", "retr").rest), ["later"]);
		assert.deepEqual(ids(build("all", "retr").actionRequired), []);
	});
});
