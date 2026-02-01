const require_rolldown_runtime = require('../../_virtual/rolldown_runtime.cjs');
const require_gel_core_columns_common = require('./common.cjs');
let __entity_ts = require("../../entity.cjs");

//#region src/gel-core/columns/real.ts
var GelRealBuilder = class extends require_gel_core_columns_common.GelColumnBuilder {
	static [__entity_ts.entityKind] = "GelRealBuilder";
	constructor(name, length) {
		super(name, "number float", "GelReal");
		this.config.length = length;
	}
	/** @internal */
	build(table) {
		return new GelReal(table, this.config);
	}
};
var GelReal = class extends require_gel_core_columns_common.GelColumn {
	static [__entity_ts.entityKind] = "GelReal";
	constructor(table, config) {
		super(table, config);
	}
	getSQLType() {
		return "real";
	}
};
function real(name) {
	return new GelRealBuilder(name ?? "");
}

//#endregion
exports.GelReal = GelReal;
exports.GelRealBuilder = GelRealBuilder;
exports.real = real;
//# sourceMappingURL=real.cjs.map