import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { ANCHOR_DATES } from "../chrono/types";
import { formatMeetingWeekdays } from "./card";

/** Anchor-date ISO strings for weekday indices, Sunday = 0. */
const days = (...indices: number[]) =>
	indices.map((i) => ANCHOR_DATES[i].toISOString());

const SUN = 0;
const MON = 1;
const TUE = 2;
const WED = 3;
const THU = 4;
const FRI = 5;
const SAT = 6;

describe("formatMeetingWeekdays", () => {
	it("collapses runs of three or more, Sunday first", () => {
		assert.equal(
			formatMeetingWeekdays(days(MON, TUE, WED, FRI)),
			"Mon - Wed, Fri",
		);
		assert.equal(formatMeetingWeekdays(days(MON, WED, FRI)), "Mon, Wed, Fri");
		assert.equal(formatMeetingWeekdays(days(SUN, MON)), "Sun, Mon");
		assert.equal(formatMeetingWeekdays(days(THU)), "Thu");
	});

	it("ignores input order and duplicates", () => {
		assert.equal(formatMeetingWeekdays(days(WED, MON, TUE, MON)), "Mon - Wed");
	});

	it("keeps a run through Saturday into Sunday together", () => {
		assert.equal(formatMeetingWeekdays(days(SUN, FRI, SAT)), "Fri - Sun");
		assert.equal(formatMeetingWeekdays(days(SUN, SAT)), "Sat, Sun");
		assert.equal(
			formatMeetingWeekdays(days(SUN, MON, WED, SAT)),
			"Wed, Sat - Mon",
		);
	});

	it("does not rotate without both Saturday and Sunday", () => {
		assert.equal(formatMeetingWeekdays(days(SUN, WED)), "Sun, Wed");
		assert.equal(formatMeetingWeekdays(days(FRI, SAT)), "Fri, Sat");
	});

	it("does not rotate when every day is selected", () => {
		assert.equal(
			formatMeetingWeekdays(days(SUN, MON, TUE, WED, THU, FRI, SAT)),
			"Sun - Sat",
		);
	});
});
