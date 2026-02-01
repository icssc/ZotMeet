const require_rolldown_runtime = require('../../_virtual/rolldown_runtime.cjs');
const require_gel_core_columns_common = require('./common.cjs');
let __entity_ts = require("../../entity.cjs");

//#region src/gel-core/columns/double-precision.ts
var GelDoublePrecisionBuilder = class extends require_gel_core_columns_common.GelColumnBuilder {
	static [__entity_ts.entityKind] = "GelDoublePrecisionBuilder";
	constructor(name) {
		super(name, "number double", "GelDoublePrecision");
	}
	/** @internal */
	build(table) {
		return new GelDoublePrecision(table, this.config);
	}
};
var GelDoublePrecision = class extends require_gel_core_columns_common.GelColumn {
	static [__entity_ts.entityKind] = "GelDoublePrecision";
	getSQLType() {
		return "double precision";
	}
	mapFromDriverValue(value) {
		if (typeof value === "string") return Number.parseFloat(value);
		return value;
	}
};
function doublePrecision(name) {
	return new GelDoublePrecisionBuilder(name ?? "");
}

//#endregion
exports.GelDoublePrecision = GelDoublePrecision;
exports.GelDoublePrecisionBuilder = GelDoublePrecisionBuilder;
exports.doublePrecision = doublePrecision;
//# sourceMappingURL=double-precision.cjs.map