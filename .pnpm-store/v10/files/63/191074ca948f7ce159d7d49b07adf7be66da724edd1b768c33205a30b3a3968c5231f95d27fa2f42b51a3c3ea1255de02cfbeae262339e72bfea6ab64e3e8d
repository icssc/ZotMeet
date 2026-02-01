const require_rolldown_runtime = require('../../_virtual/rolldown_runtime.cjs');
const require_gel_core_columns_common = require('./common.cjs');
let __entity_ts = require("../../entity.cjs");

//#region src/gel-core/columns/duration.ts
var GelDurationBuilder = class extends require_gel_core_columns_common.GelColumnBuilder {
	static [__entity_ts.entityKind] = "GelDurationBuilder";
	constructor(name) {
		super(name, "object duration", "GelDuration");
	}
	/** @internal */
	build(table) {
		return new GelDuration(table, this.config);
	}
};
var GelDuration = class extends require_gel_core_columns_common.GelColumn {
	static [__entity_ts.entityKind] = "GelDuration";
	getSQLType() {
		return `duration`;
	}
};
function duration(name) {
	return new GelDurationBuilder(name ?? "");
}

//#endregion
exports.GelDuration = GelDuration;
exports.GelDurationBuilder = GelDurationBuilder;
exports.duration = duration;
//# sourceMappingURL=duration.cjs.map