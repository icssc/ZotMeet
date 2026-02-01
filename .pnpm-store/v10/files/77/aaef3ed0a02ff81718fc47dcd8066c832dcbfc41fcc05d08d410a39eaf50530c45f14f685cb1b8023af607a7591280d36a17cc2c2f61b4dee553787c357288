const require_rolldown_runtime = require('../../_virtual/rolldown_runtime.cjs');
const require_gel_core_columns_common = require('./common.cjs');
const require_gel_core_columns_int_common = require('./int.common.cjs');
let __entity_ts = require("../../entity.cjs");

//#region src/gel-core/columns/bigint.ts
var GelInt53Builder = class extends require_gel_core_columns_int_common.GelIntColumnBaseBuilder {
	static [__entity_ts.entityKind] = "GelInt53Builder";
	constructor(name) {
		super(name, "number int53", "GelInt53");
	}
	/** @internal */
	build(table) {
		return new GelInt53(table, this.config);
	}
};
var GelInt53 = class extends require_gel_core_columns_common.GelColumn {
	static [__entity_ts.entityKind] = "GelInt53";
	getSQLType() {
		return "bigint";
	}
};
function bigint(name) {
	return new GelInt53Builder(name ?? "");
}

//#endregion
exports.GelInt53 = GelInt53;
exports.GelInt53Builder = GelInt53Builder;
exports.bigint = bigint;
//# sourceMappingURL=bigint.cjs.map