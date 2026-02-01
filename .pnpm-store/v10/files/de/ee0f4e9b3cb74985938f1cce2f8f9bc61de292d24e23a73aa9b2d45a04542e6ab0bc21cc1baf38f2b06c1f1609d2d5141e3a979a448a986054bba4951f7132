const require_rolldown_runtime = require('../../_virtual/rolldown_runtime.cjs');
const require_gel_core_columns_common = require('./common.cjs');
const require_gel_core_columns_date_common = require('./date.common.cjs');
let __entity_ts = require("../../entity.cjs");

//#region src/gel-core/columns/localdate.ts
var GelLocalDateStringBuilder = class extends require_gel_core_columns_date_common.GelLocalDateColumnBaseBuilder {
	static [__entity_ts.entityKind] = "GelLocalDateStringBuilder";
	constructor(name) {
		super(name, "object localDate", "GelLocalDateString");
	}
	/** @internal */
	build(table) {
		return new GelLocalDateString(table, this.config);
	}
};
var GelLocalDateString = class extends require_gel_core_columns_common.GelColumn {
	static [__entity_ts.entityKind] = "GelLocalDateString";
	getSQLType() {
		return "cal::local_date";
	}
};
function localDate(name) {
	return new GelLocalDateStringBuilder(name ?? "");
}

//#endregion
exports.GelLocalDateString = GelLocalDateString;
exports.GelLocalDateStringBuilder = GelLocalDateStringBuilder;
exports.localDate = localDate;
//# sourceMappingURL=localdate.cjs.map