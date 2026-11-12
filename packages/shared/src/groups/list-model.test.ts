import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { buildGroupsListModel, type GroupForList } from "./list-model";

type Group = GroupForList & { id: string };

function group(id: string, overrides: Partial<Group> = {}): Group {
	return {
		id,
		name: id,
		isCreator: false,
		upcomingMeetingName: null,
		needsAvailability: false,
		...overrides,
	};
}

const groups = [
	group("ICSSC Internal", { needsAvailability: true, isCreator: true }),
	group("DAUCI Retreat", { upcomingMeetingName: "Packing Party" }),
	group("WICS Mentorship"),
	group("Capstone", { isCreator: true, upcomingMeetingName: "Demo" }),
];

const ids = (list: Group[]) => list.map((g) => g.id);

describe("buildGroupsListModel", () => {
	it("splits Action Required from the rest", () => {
		const model = buildGroupsListModel({ groups, search: "", filter: "all" });
		assert.deepEqual(ids(model.actionRequired), ["ICSSC Internal"]);
		assert.deepEqual(ids(model.rest), [
			"DAUCI Retreat",
			"WICS Mentorship",
			"Capstone",
		]);
	});

	it("searches names case-insensitively, ignoring surrounding spaces", () => {
		const model = buildGroupsListModel({
			groups,
			search: "  dauci ",
			filter: "all",
		});
		assert.deepEqual(ids(model.rest), ["DAUCI Retreat"]);
		assert.deepEqual(ids(model.actionRequired), []);
	});

	it("filters By You and Upcoming", () => {
		const byYou = buildGroupsListModel({
			groups,
			search: "",
			filter: "created",
		});
		assert.deepEqual(ids(byYou.actionRequired), ["ICSSC Internal"]);
		assert.deepEqual(ids(byYou.rest), ["Capstone"]);

		const upcoming = buildGroupsListModel({
			groups,
			search: "",
			filter: "upcoming",
		});
		assert.deepEqual(ids(upcoming.rest), ["DAUCI Retreat", "Capstone"]);
		assert.deepEqual(ids(upcoming.actionRequired), []);
	});

	it("combines search with a filter", () => {
		const model = buildGroupsListModel({
			groups,
			search: "cap",
			filter: "created",
		});
		assert.deepEqual(ids(model.rest), ["Capstone"]);
	});

	it("tells no groups apart from no matches", () => {
		const none = buildGroupsListModel({
			groups: [],
			search: "",
			filter: "all",
		});
		assert.equal(none.isEmpty, true);
		assert.equal(none.isFilteredEmpty, false);

		const noMatch = buildGroupsListModel({
			groups,
			search: "nothing",
			filter: "all",
		});
		assert.equal(noMatch.isEmpty, false);
		assert.equal(noMatch.isFilteredEmpty, true);
	});
});
