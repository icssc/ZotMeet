import { GelColumn, GelColumnBuilder } from "./common.js";
import { entityKind } from "../../entity.js";

//#region src/gel-core/columns/date-duration.ts
var GelDateDurationBuilder = class extends GelColumnBuilder {
	static [entityKind] = "GelDateDurationBuilder";
	constructor(name) {
		super(name, "object dateDuration", "GelDateDuration");
	}
	/** @internal */
	build(table) {
		return new GelDateDuration(table, this.config);
	}
};
var GelDateDuration = class extends GelColumn {
	static [entityKind] = "GelDateDuration";
	getSQLType() {
		return `dateDuration`;
	}
};
function dateDuration(name) {
	return new GelDateDurationBuilder(name ?? "");
}

//#endregion
export { GelDateDuration, GelDateDurationBuilder, dateDuration };
//# sourceMappingURL=date-duration.js.map