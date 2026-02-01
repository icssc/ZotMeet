import { GelColumn, GelColumnBuilder } from "./common.js";
import { entityKind } from "../../entity.js";

//#region src/gel-core/columns/boolean.ts
var GelBooleanBuilder = class extends GelColumnBuilder {
	static [entityKind] = "GelBooleanBuilder";
	constructor(name) {
		super(name, "boolean", "GelBoolean");
	}
	/** @internal */
	build(table) {
		return new GelBoolean(table, this.config);
	}
};
var GelBoolean = class extends GelColumn {
	static [entityKind] = "GelBoolean";
	getSQLType() {
		return "boolean";
	}
};
function boolean(name) {
	return new GelBooleanBuilder(name ?? "");
}

//#endregion
export { GelBoolean, GelBooleanBuilder, boolean };
//# sourceMappingURL=boolean.js.map