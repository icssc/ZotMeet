import { GelColumn, GelColumnBuilder } from "./common.js";
import { entityKind } from "../../entity.js";

//#region src/gel-core/columns/real.ts
var GelRealBuilder = class extends GelColumnBuilder {
	static [entityKind] = "GelRealBuilder";
	constructor(name, length) {
		super(name, "number float", "GelReal");
		this.config.length = length;
	}
	/** @internal */
	build(table) {
		return new GelReal(table, this.config);
	}
};
var GelReal = class extends GelColumn {
	static [entityKind] = "GelReal";
	constructor(table, config) {
		super(table, config);
	}
	getSQLType() {
		return "real";
	}
};
function real(name) {
	return new GelRealBuilder(name ?? "");
}

//#endregion
export { GelReal, GelRealBuilder, real };
//# sourceMappingURL=real.js.map