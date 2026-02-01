import { GelColumn } from "./common.js";
import { GelLocalDateColumnBaseBuilder } from "./date.common.js";
import { entityKind } from "../../entity.js";

//#region src/gel-core/columns/localdate.ts
var GelLocalDateStringBuilder = class extends GelLocalDateColumnBaseBuilder {
	static [entityKind] = "GelLocalDateStringBuilder";
	constructor(name) {
		super(name, "object localDate", "GelLocalDateString");
	}
	/** @internal */
	build(table) {
		return new GelLocalDateString(table, this.config);
	}
};
var GelLocalDateString = class extends GelColumn {
	static [entityKind] = "GelLocalDateString";
	getSQLType() {
		return "cal::local_date";
	}
};
function localDate(name) {
	return new GelLocalDateStringBuilder(name ?? "");
}

//#endregion
export { GelLocalDateString, GelLocalDateStringBuilder, localDate };
//# sourceMappingURL=localdate.js.map