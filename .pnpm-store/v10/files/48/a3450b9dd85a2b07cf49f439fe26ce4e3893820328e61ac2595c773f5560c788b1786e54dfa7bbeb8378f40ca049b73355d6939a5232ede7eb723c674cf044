const require_rolldown_runtime = require('../../_virtual/rolldown_runtime.cjs');
const require_gel_core_columns_common = require('./common.cjs');
const require_gel_core_columns_date_common = require('./date.common.cjs');
let __entity_ts = require("../../entity.cjs");

//#region src/gel-core/columns/timestamptz.ts
var GelTimestampTzBuilder = class extends require_gel_core_columns_date_common.GelLocalDateColumnBaseBuilder {
	static [__entity_ts.entityKind] = "GelTimestampTzBuilder";
	constructor(name) {
		super(name, "object date", "GelTimestampTz");
	}
	/** @internal */
	build(table) {
		return new GelTimestampTz(table, this.config);
	}
};
var GelTimestampTz = class extends require_gel_core_columns_common.GelColumn {
	static [__entity_ts.entityKind] = "GelTimestampTz";
	constructor(table, config) {
		super(table, config);
	}
	mapFromDriverValue(value) {
		if (typeof value === "string") return new Date(value);
		return value;
	}
	getSQLType() {
		return "datetime";
	}
};
function timestamptz(name) {
	return new GelTimestampTzBuilder(name ?? "");
}

//#endregion
exports.GelTimestampTz = GelTimestampTz;
exports.GelTimestampTzBuilder = GelTimestampTzBuilder;
exports.timestamptz = timestamptz;
//# sourceMappingURL=timestamptz.cjs.map