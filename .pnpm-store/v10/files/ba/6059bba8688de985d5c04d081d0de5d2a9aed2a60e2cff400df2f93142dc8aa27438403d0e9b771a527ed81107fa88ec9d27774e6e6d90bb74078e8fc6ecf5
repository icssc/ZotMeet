import { GelColumn } from "./common.js";
import { GelLocalDateColumnBaseBuilder } from "./date.common.js";
import { entityKind } from "../../entity.js";

//#region src/gel-core/columns/localtime.ts
var GelLocalTimeBuilder = class extends GelLocalDateColumnBaseBuilder {
	static [entityKind] = "GelLocalTimeBuilder";
	constructor(name) {
		super(name, "object localTime", "GelLocalTime");
	}
	/** @internal */
	build(table) {
		return new GelLocalTime(table, this.config);
	}
};
var GelLocalTime = class extends GelColumn {
	static [entityKind] = "GelLocalTime";
	getSQLType() {
		return "cal::local_time";
	}
};
function localTime(name) {
	return new GelLocalTimeBuilder(name ?? "");
}

//#endregion
export { GelLocalTime, GelLocalTimeBuilder, localTime };
//# sourceMappingURL=localtime.js.map