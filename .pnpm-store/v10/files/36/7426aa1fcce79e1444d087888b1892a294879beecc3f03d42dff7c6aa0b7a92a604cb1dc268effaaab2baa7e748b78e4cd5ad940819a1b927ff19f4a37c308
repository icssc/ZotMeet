const require_rolldown_runtime = require('../../_virtual/rolldown_runtime.cjs');
const require_gel_core_columns_common = require('./common.cjs');
const require_gel_core_columns_int_common = require('./int.common.cjs');
let __entity_ts = require("../../entity.cjs");

//#region src/gel-core/columns/bigintT.ts
var GelBigInt64Builder = class extends require_gel_core_columns_int_common.GelIntColumnBaseBuilder {
	static [__entity_ts.entityKind] = "GelBigInt64Builder";
	constructor(name) {
		super(name, "bigint int64", "GelBigInt64");
	}
	/** @internal */
	build(table) {
		return new GelBigInt64(table, this.config);
	}
};
var GelBigInt64 = class extends require_gel_core_columns_common.GelColumn {
	static [__entity_ts.entityKind] = "GelBigInt64";
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
exports.GelBigInt64 = GelBigInt64;
exports.GelBigInt64Builder = GelBigInt64Builder;
exports.bigintT = bigintT;
//# sourceMappingURL=bigintT.cjs.map