const require_rolldown_runtime = require('../../_virtual/rolldown_runtime.cjs');
const require_gel_core_columns_common = require('./common.cjs');
const require_gel_core_columns_date_common = require('./date.common.cjs');
let __entity_ts = require("../../entity.cjs");

//#region src/gel-core/columns/localtime.ts
var GelLocalTimeBuilder = class extends require_gel_core_columns_date_common.GelLocalDateColumnBaseBuilder {
	static [__entity_ts.entityKind] = "GelLocalTimeBuilder";
	constructor(name) {
		super(name, "object localTime", "GelLocalTime");
	}
	/** @internal */
	build(table) {
		return new GelLocalTime(table, this.config);
	}
};
var GelLocalTime = class extends require_gel_core_columns_common.GelColumn {
	static [__entity_ts.entityKind] = "GelLocalTime";
	getSQLType() {
		return "cal::local_time";
	}
};
function localTime(name) {
	return new GelLocalTimeBuilder(name ?? "");
}

//#endregion
exports.GelLocalTime = GelLocalTime;
exports.GelLocalTimeBuilder = GelLocalTimeBuilder;
exports.localTime = localTime;
//# sourceMappingURL=localtime.cjs.map