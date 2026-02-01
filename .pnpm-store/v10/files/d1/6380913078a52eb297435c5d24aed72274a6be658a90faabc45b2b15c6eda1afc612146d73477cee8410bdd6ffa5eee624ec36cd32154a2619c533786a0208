const require_rolldown_runtime = require('../../_virtual/rolldown_runtime.cjs');
let __entity_ts = require("../../entity.cjs");
let __query_promise_ts = require("../../query-promise.cjs");

//#region src/gel-core/query-builders/raw.ts
var GelRaw = class extends __query_promise_ts.QueryPromise {
	static [__entity_ts.entityKind] = "GelRaw";
	constructor(execute, sql, query, mapBatchResult) {
		super();
		this.execute = execute;
		this.sql = sql;
		this.query = query;
		this.mapBatchResult = mapBatchResult;
	}
	/** @internal */
	getSQL() {
		return this.sql;
	}
	getQuery() {
		return this.query;
	}
	mapResult(result, isFromBatch) {
		return isFromBatch ? this.mapBatchResult(result) : result;
	}
	_prepare() {
		return this;
	}
	/** @internal */
	isResponseInArrayMode() {
		return false;
	}
};

//#endregion
exports.GelRaw = GelRaw;
//# sourceMappingURL=raw.cjs.map