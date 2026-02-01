const require_rolldown_runtime = require('../../_virtual/rolldown_runtime.cjs');
const require_gel_core_columns_common = require('./common.cjs');
let __entity_ts = require("../../entity.cjs");

//#region src/gel-core/columns/relative-duration.ts
var GelRelDurationBuilder = class extends require_gel_core_columns_common.GelColumnBuilder {
	static [__entity_ts.entityKind] = "GelRelDurationBuilder";
	constructor(name) {
		super(name, "object relDuration", "GelRelDuration");
	}
	/** @internal */
	build(table) {
		return new GelRelDuration(table, this.config);
	}
};
var GelRelDuration = class extends require_gel_core_columns_common.GelColumn {
	static [__entity_ts.entityKind] = "GelRelDuration";
	getSQLType() {
		return `edgedbt.relative_duration_t`;
	}
};
function relDuration(name) {
	return new GelRelDurationBuilder(name ?? "");
}

//#endregion
exports.GelRelDuration = GelRelDuration;
exports.GelRelDurationBuilder = GelRelDurationBuilder;
exports.relDuration = relDuration;
//# sourceMappingURL=relative-duration.cjs.map