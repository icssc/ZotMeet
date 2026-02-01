import { GelColumn } from "./common.js";
import { GelIntColumnBaseBuilder } from "./int.common.js";
import { entityKind } from "../../entity.js";

//#region src/gel-core/columns/smallint.ts
var GelSmallIntBuilder = class extends GelIntColumnBaseBuilder {
	static [entityKind] = "GelSmallIntBuilder";
	constructor(name) {
		super(name, "number int16", "GelSmallInt");
	}
	/** @internal */
	build(table) {
		return new GelSmallInt(table, this.config);
	}
};
var GelSmallInt = class extends GelColumn {
	static [entityKind] = "GelSmallInt";
	getSQLType() {
		return "smallint";
	}
};
function smallint(name) {
	return new GelSmallIntBuilder(name ?? "");
}

//#endregion
export { GelSmallInt, GelSmallIntBuilder, smallint };
//# sourceMappingURL=smallint.js.map