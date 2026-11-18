import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
	firstVideoLink,
	SCHEDULE_MESSAGE_MAX,
	saveMeetingScheduleSchema,
	splitMessageLinks,
} from "./schedule";

const text = (value: string) => ({ kind: "text", value }) as const;
const link = (value: string) => ({ kind: "link", value }) as const;

describe("splitMessageLinks", () => {
	it("returns plain text untouched, and nothing for an empty string", () => {
		assert.deepEqual(splitMessageLinks("see you there"), [
			text("see you there"),
		]);
		assert.deepEqual(splitMessageLinks(""), []);
	});

	it("pulls a link out of the middle and keeps trailing punctuation as text", () => {
		assert.deepEqual(
			splitMessageLinks("Join https://meet.google.com/abc-defg-hij. Thanks!"),
			[
				text("Join "),
				link("https://meet.google.com/abc-defg-hij"),
				text(". Thanks!"),
			],
		);
	});

	it("ignores non-http schemes", () => {
		assert.deepEqual(splitMessageLinks("javascript:alert(1) ftp://x.y"), [
			text("javascript:alert(1) ftp://x.y"),
		]);
	});

	// TODO(human): G2 — write these two cases, then turn `it.todo` into `it`.
	it.todo("handles a link at the very end of the string");
	it.todo("handles two links back-to-back separated by one space");
});

describe("firstVideoLink", () => {
	it("skips non-video links and finds Zoom subdomains", () => {
		assert.equal(
			firstVideoLink([
				link("https://example.com/agenda"),
				text(" and "),
				link("https://uci.zoom.us/j/123"),
			]),
			"https://uci.zoom.us/j/123",
		);
		assert.equal(firstVideoLink([link("https://notzoom.us.evil.com")]), null);
	});
});

describe("saveMeetingScheduleSchema", () => {
	const base = {
		meetingId: "6f1c2b9e-3d4a-4b5c-8d9e-0f1a2b3c4d5e",
		adds: [],
		removals: [],
	};

	it("trims the message and treats blank as no message", () => {
		assert.equal(
			saveMeetingScheduleSchema.parse({ ...base, message: "  hi  " }).message,
			"hi",
		);
		assert.equal(
			saveMeetingScheduleSchema.parse({ ...base, message: "   " }).message,
			undefined,
		);
	});

	it("rejects a message over the limit", () => {
		const long = "x".repeat(SCHEDULE_MESSAGE_MAX + 1);
		assert.equal(
			saveMeetingScheduleSchema.safeParse({ ...base, message: long }).success,
			false,
		);
	});
});
