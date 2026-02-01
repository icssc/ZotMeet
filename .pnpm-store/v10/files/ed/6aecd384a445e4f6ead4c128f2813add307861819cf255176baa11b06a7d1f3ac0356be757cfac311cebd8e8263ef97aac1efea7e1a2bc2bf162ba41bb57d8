import { GelColumn, GelColumnBuilder } from "./common.js";
import { entityKind } from "../../entity.js";

//#region src/gel-core/columns/double-precision.ts
var GelDoublePrecisionBuilder = class extends GelColumnBuilder {
	static [entityKind] = "GelDoublePrecisionBuilder";
	constructor(name) {
		super(name, "number double", "GelDoublePrecision");
	}
	/** @internal */
	build(table) {
		return new GelDoublePrecision(table, this.config);
	}
};
var GelDoublePrecision = class extends GelColumn {
	static [entityKind] = "GelDoublePrecision";
	getSQLType() {
		return "double precision";
	}
	mapFromDriverValue(value) {
		if (typeof value === "string") return Number.parseFloat(value);
		return value;
	}
};
function doublePrecision(name) {
	return new GelDoublePrecisionBuilder(name ?? "");
}

//#endregion
export { GelDoublePrecision, GelDoublePrecisionBuilder, doublePrecision };
//# sourceMappingURL=double-precision.js.map