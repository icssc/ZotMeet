import { GelColumn } from "./common.js";
import { GelIntColumnBaseBuilder } from "./int.common.js";
import { entityKind } from "../../entity.js";

//#region src/gel-core/columns/bigintT.ts
var GelBigInt64Builder = class extends GelIntColumnBaseBuilder {
	static [entityKind] = "GelBigInt64Builder";
	constructor(name) {
		super(name, "bigint int64", "GelBigInt64");
	}
	/** @internal */
	build(table) {
		return new GelBigInt64(table, this.config);
	}
};
var GelBigInt64 = class extends GelColumn {
	static [entityKind] = "GelBigInt64";
	getSQLType() {
		return "edgedbt.bigint_t";
	}
	mapFromDriverValue(value) {
		return BigInt(value);
	}
};
function bigintT(name) {
	return new GelBigInt64Builder(name ?? "");
}

//#endregion
export { GelBigInt64, GelBigInt64Builder, bigintT };
//# sourceMappingURL=bigintT.js.map