import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { generateTimeBlocks } from "./time";

describe("generateTimeBlocks", () => {
	it("lists rows in order for a window inside a single day", () => {
		assert.deepEqual(generateTimeBlocks(540, 600), [540, 555, 570, 585]);
	});

	it("treats a 12 AM end time as the end of the day", () => {
		assert.deepEqual(
			generateTimeBlocks(1320, 0),
			[1320, 1335, 1350, 1365, 1380, 1395, 1410, 1425],
		);
	});

	it("keeps rows in order when the window crosses midnight", () => {
		assert.deepEqual(generateTimeBlocks(1425, 45), [1425, 1440, 1455, 1470]);
		assert.deepEqual(
			generateTimeBlocks(1380, 120),
			[1380, 1395, 1410, 1425, 1440, 1455, 1470, 1485, 1500, 1515, 1530, 1545],
		);
	});
});
