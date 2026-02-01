import { GelColumn } from "./common.js";
import { GelLocalDateColumnBaseBuilder } from "./date.common.js";
import { entityKind } from "../../entity.js";

//#region src/gel-core/columns/timestamp.ts
var GelTimestampBuilder = class extends GelLocalDateColumnBaseBuilder {
	static [entityKind] = "GelTimestampBuilder";
	constructor(name) {
		super(name, "object localDateTime", "GelTimestamp");
	}
	/** @internal */
	build(table) {
		return new GelTimestamp(table, this.config);
	}
};
var GelTimestamp = class extends GelColumn {
	static [entityKind] = "GelTimestamp";
	constructor(table, config) {
		super(table, config);
	}
	getSQLType() {
		return "cal::local_datetime";
	}
};
function timestamp(name) {
	return new GelTimestampBuilder(name ?? "");
}

//#endregion
export { GelTimestamp, GelTimestampBuilder, timestamp };
//# sourceMappingURL=timestamp.js.map