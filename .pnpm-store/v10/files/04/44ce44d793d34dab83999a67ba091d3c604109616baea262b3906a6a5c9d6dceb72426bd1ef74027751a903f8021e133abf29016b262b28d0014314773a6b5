const require_rolldown_runtime = require('../../_virtual/rolldown_runtime.cjs');
const require_gel_core_columns_common = require('./common.cjs');
const require_gel_core_columns_date_common = require('./date.common.cjs');
let __entity_ts = require("../../entity.cjs");

//#region src/gel-core/columns/timestamp.ts
var GelTimestampBuilder = class extends require_gel_core_columns_date_common.GelLocalDateColumnBaseBuilder {
	static [__entity_ts.entityKind] = "GelTimestampBuilder";
	constructor(name) {
		super(name, "object localDateTime", "GelTimestamp");
	}
	/** @internal */
	build(table) {
		return new GelTimestamp(table, this.config);
	}
};
var GelTimestamp = class extends require_gel_core_columns_common.GelColumn {
	static [__entity_ts.entityKind] = "GelTimestamp";
	constructor(table, config) {
		super(table, config);
	}
	getSQLType() {
		return "cal::local_datetime";
	}
};
function timestamp(name) {
	return new GelTimestampBuilder(name ?? "");
}

//#endregion
exports.GelTimestamp = GelTimestamp;
exports.GelTimestampBuilder = GelTimestampBuilder;
exports.timestamp = timestamp;
//# sourceMappingURL=timestamp.cjs.map