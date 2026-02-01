const require_rolldown_runtime = require('../../_virtual/rolldown_runtime.cjs');
const require_gel_core_columns_common = require('./common.cjs');
const require_gel_core_columns_int_common = require('./int.common.cjs');
let __entity_ts = require("../../entity.cjs");

//#region src/gel-core/columns/smallint.ts
var GelSmallIntBuilder = class extends require_gel_core_columns_int_common.GelIntColumnBaseBuilder {
	static [__entity_ts.entityKind] = "GelSmallIntBuilder";
	constructor(name) {
		super(name, "number int16", "GelSmallInt");
	}
	/** @internal */
	build(table) {
		return new GelSmallInt(table, this.config);
	}
};
var GelSmallInt = class extends require_gel_core_columns_common.GelColumn {
	static [__entity_ts.entityKind] = "GelSmallInt";
	getSQLType() {
		return "smallint";
	}
};
function smallint(name) {
	return new GelSmallIntBuilder(name ?? "");
}

//#endregion
exports.GelSmallInt = GelSmallInt;
exports.GelSmallIntBuilder = GelSmallIntBuilder;
exports.smallint = smallint;
//# sourceMappingURL=smallint.cjs.map