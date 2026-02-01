import { GelColumn, GelColumnBuilder } from "./common.js";
import { entityKind } from "../../entity.js";

//#region src/gel-core/columns/decimal.ts
var GelDecimalBuilder = class extends GelColumnBuilder {
	static [entityKind] = "GelDecimalBuilder";
	constructor(name) {
		super(name, "string numeric", "GelDecimal");
	}
	/** @internal */
	build(table) {
		return new GelDecimal(table, this.config);
	}
};
var GelDecimal = class extends GelColumn {
	static [entityKind] = "GelDecimal";
	constructor(table, config) {
		super(table, config);
	}
	getSQLType() {
		return "numeric";
	}
};
function decimal(name) {
	return new GelDecimalBuilder(name ?? "");
}

//#endregion
export { GelDecimal, GelDecimalBuilder, decimal };
//# sourceMappingURL=decimal.js.map