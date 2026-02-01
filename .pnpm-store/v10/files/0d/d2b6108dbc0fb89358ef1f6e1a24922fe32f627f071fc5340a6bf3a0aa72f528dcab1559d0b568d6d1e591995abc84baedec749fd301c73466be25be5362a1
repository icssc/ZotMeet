import { GelColumn, GelColumnBuilder } from "./common.js";
import { entityKind } from "../../entity.js";

//#region src/gel-core/columns/duration.ts
var GelDurationBuilder = class extends GelColumnBuilder {
	static [entityKind] = "GelDurationBuilder";
	constructor(name) {
		super(name, "object duration", "GelDuration");
	}
	/** @internal */
	build(table) {
		return new GelDuration(table, this.config);
	}
};
var GelDuration = class extends GelColumn {
	static [entityKind] = "GelDuration";
	getSQLType() {
		return `duration`;
	}
};
function duration(name) {
	return new GelDurationBuilder(name ?? "");
}

//#endregion
export { GelDuration, GelDurationBuilder, duration };
//# sourceMappingURL=duration.js.map