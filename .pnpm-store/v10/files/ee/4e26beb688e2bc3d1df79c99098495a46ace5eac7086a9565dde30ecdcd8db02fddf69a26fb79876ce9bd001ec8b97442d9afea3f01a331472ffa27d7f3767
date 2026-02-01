import { GelColumn } from "./common.js";
import { GelIntColumnBaseBuilder } from "./int.common.js";
import { entityKind } from "../../entity.js";

//#region src/gel-core/columns/integer.ts
var GelIntegerBuilder = class extends GelIntColumnBaseBuilder {
	static [entityKind] = "GelIntegerBuilder";
	constructor(name) {
		super(name, "number int32", "GelInteger");
	}
	/** @internal */
	build(table) {
		return new GelInteger(table, this.config);
	}
};
var GelInteger = class extends GelColumn {
	static [entityKind] = "GelInteger";
	getSQLType() {
		return "integer";
	}
};
function integer(name) {
	return new GelIntegerBuilder(name ?? "");
}

//#endregion
export { GelInteger, GelIntegerBuilder, integer };
//# sourceMappingURL=integer.js.map