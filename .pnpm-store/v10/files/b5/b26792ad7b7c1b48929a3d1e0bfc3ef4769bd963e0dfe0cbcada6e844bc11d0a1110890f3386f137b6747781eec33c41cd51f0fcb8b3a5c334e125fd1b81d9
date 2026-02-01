const require_rolldown_runtime = require('../../_virtual/rolldown_runtime.cjs');
const require_gel_core_columns_common = require('./common.cjs');
let __entity_ts = require("../../entity.cjs");

//#region src/gel-core/columns/decimal.ts
var GelDecimalBuilder = class extends require_gel_core_columns_common.GelColumnBuilder {
	static [__entity_ts.entityKind] = "GelDecimalBuilder";
	constructor(name) {
		super(name, "string numeric", "GelDecimal");
	}
	/** @internal */
	build(table) {
		return new GelDecimal(table, this.config);
	}
};
var GelDecimal = class extends require_gel_core_columns_common.GelColumn {
	static [__entity_ts.entityKind] = "GelDecimal";
	constructor(table, config) {
		super(table, config);
	}
	getSQLType() {
		return "numeric";
	}
};
function decimal(name) {
	return new GelDecimalBuilder(name ?? "");
}

//#endregion
exports.GelDecimal = GelDecimal;
exports.GelDecimalBuilder = GelDecimalBuilder;
exports.decimal = decimal;
//# sourceMappingURL=decimal.cjs.map