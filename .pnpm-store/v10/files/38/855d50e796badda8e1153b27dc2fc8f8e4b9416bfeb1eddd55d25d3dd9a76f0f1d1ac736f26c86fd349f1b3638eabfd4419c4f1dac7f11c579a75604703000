const require_rolldown_runtime = require('../../_virtual/rolldown_runtime.cjs');
const require_gel_core_columns_common = require('./common.cjs');
const require_gel_core_columns_int_common = require('./int.common.cjs');
let __entity_ts = require("../../entity.cjs");

//#region src/gel-core/columns/integer.ts
var GelIntegerBuilder = class extends require_gel_core_columns_int_common.GelIntColumnBaseBuilder {
	static [__entity_ts.entityKind] = "GelIntegerBuilder";
	constructor(name) {
		super(name, "number int32", "GelInteger");
	}
	/** @internal */
	build(table) {
		return new GelInteger(table, this.config);
	}
};
var GelInteger = class extends require_gel_core_columns_common.GelColumn {
	static [__entity_ts.entityKind] = "GelInteger";
	getSQLType() {
		return "integer";
	}
};
function integer(name) {
	return new GelIntegerBuilder(name ?? "");
}

//#endregion
exports.GelInteger = GelInteger;
exports.GelIntegerBuilder = GelIntegerBuilder;
exports.integer = integer;
//# sourceMappingURL=integer.cjs.map