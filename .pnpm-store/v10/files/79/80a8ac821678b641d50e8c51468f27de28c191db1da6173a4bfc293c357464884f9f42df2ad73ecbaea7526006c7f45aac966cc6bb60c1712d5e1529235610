const require_rolldown_runtime = require('../../_virtual/rolldown_runtime.cjs');
const require_gel_core_columns_common = require('./common.cjs');
let __entity_ts = require("../../entity.cjs");
let __sql_sql_ts = require("../../sql/sql.cjs");

//#region src/gel-core/columns/date.common.ts
var GelLocalDateColumnBaseBuilder = class extends require_gel_core_columns_common.GelColumnBuilder {
	static [__entity_ts.entityKind] = "GelLocalDateColumnBaseBuilder";
	defaultNow() {
		return this.default(__sql_sql_ts.sql`now()`);
	}
};

//#endregion
exports.GelLocalDateColumnBaseBuilder = GelLocalDateColumnBaseBuilder;
//# sourceMappingURL=date.common.cjs.map