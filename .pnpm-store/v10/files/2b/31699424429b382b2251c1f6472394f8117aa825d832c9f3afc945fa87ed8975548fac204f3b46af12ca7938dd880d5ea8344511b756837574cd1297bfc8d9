const require_rolldown_runtime = require('../../_virtual/rolldown_runtime.cjs');
const require_pg_core_query_builders_raw = require('../query-builders/raw.cjs');
let __entity_ts = require("../../entity.cjs");
let __utils_ts = require("../../utils.cjs");
let __query_promise_ts = require("../../query-promise.cjs");

//#region src/pg-core/async/raw.ts
var PgAsyncRaw = class extends require_pg_core_query_builders_raw.PgRaw {
	static [__entity_ts.entityKind] = "PgAsyncRaw";
	constructor(execute, sql, query, mapBatchResult) {
		super(sql, query, mapBatchResult);
		this.execute = execute;
	}
	_prepare() {
		return this;
	}
};
(0, __utils_ts.applyMixins)(PgAsyncRaw, [__query_promise_ts.QueryPromise]);

//#endregion
exports.PgAsyncRaw = PgAsyncRaw;
//# sourceMappingURL=raw.cjs.map