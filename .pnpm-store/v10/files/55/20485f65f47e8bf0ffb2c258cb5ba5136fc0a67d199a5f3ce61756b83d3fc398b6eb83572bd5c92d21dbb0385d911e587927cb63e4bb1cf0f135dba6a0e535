const require_rolldown_runtime = require('../../_virtual/rolldown_runtime.cjs');
const require_gel_core_columns_common = require('./common.cjs');
let __entity_ts = require("../../entity.cjs");

//#region src/gel-core/columns/date-duration.ts
var GelDateDurationBuilder = class extends require_gel_core_columns_common.GelColumnBuilder {
	static [__entity_ts.entityKind] = "GelDateDurationBuilder";
	constructor(name) {
		super(name, "object dateDuration", "GelDateDuration");
	}
	/** @internal */
	build(table) {
		return new GelDateDuration(table, this.config);
	}
};
var GelDateDuration = class extends require_gel_core_columns_common.GelColumn {
	static [__entity_ts.entityKind] = "GelDateDuration";
	getSQLType() {
		return `dateDuration`;
	}
};
function dateDuration(name) {
	return new GelDateDurationBuilder(name ?? "");
}

//#endregion
exports.GelDateDuration = GelDateDuration;
exports.GelDateDurationBuilder = GelDateDurationBuilder;
exports.dateDuration = dateDuration;
//# sourceMappingURL=date-duration.cjs.map