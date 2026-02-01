import { GelColumn } from "./common.js";
import { GelIntColumnBaseBuilder } from "./int.common.js";
import { entityKind } from "../../entity.js";

//#region src/gel-core/columns/bigint.ts
var GelInt53Builder = class extends GelIntColumnBaseBuilder {
	static [entityKind] = "GelInt53Builder";
	constructor(name) {
		super(name, "number int53", "GelInt53");
	}
	/** @internal */
	build(table) {
		return new GelInt53(table, this.config);
	}
};
var GelInt53 = class extends GelColumn {
	static [entityKind] = "GelInt53";
	getSQLType() {
		return "bigint";
	}
};
function bigint(name) {
	return new GelInt53Builder(name ?? "");
}

//#endregion
export { GelInt53, GelInt53Builder, bigint };
//# sourceMappingURL=bigint.js.map