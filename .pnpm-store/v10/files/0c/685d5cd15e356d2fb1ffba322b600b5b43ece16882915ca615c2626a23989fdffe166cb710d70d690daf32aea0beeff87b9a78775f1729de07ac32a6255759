import { GelColumn } from "./common.js";
import { GelLocalDateColumnBaseBuilder } from "./date.common.js";
import { entityKind } from "../../entity.js";

//#region src/gel-core/columns/timestamptz.ts
var GelTimestampTzBuilder = class extends GelLocalDateColumnBaseBuilder {
	static [entityKind] = "GelTimestampTzBuilder";
	constructor(name) {
		super(name, "object date", "GelTimestampTz");
	}
	/** @internal */
	build(table) {
		return new GelTimestampTz(table, this.config);
	}
};
var GelTimestampTz = class extends GelColumn {
	static [entityKind] = "GelTimestampTz";
	constructor(table, config) {
		super(table, config);
	}
	mapFromDriverValue(value) {
		if (typeof value === "string") return new Date(value);
		return value;
	}
	getSQLType() {
		return "datetime";
	}
};
function timestamptz(name) {
	return new GelTimestampTzBuilder(name ?? "");
}

//#endregion
export { GelTimestampTz, GelTimestampTzBuilder, timestamptz };
//# sourceMappingURL=timestamptz.js.map