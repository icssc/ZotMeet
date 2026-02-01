const require_rolldown_runtime = require('../../_virtual/rolldown_runtime.cjs');
let __entity_ts = require("../../entity.cjs");
let __query_promise_ts = require("../../query-promise.cjs");

//#region src/sqlite-core/query-builders/raw.ts
var SQLiteRaw = class extends __query_promise_ts.QueryPromise {
	static [__entity_ts.entityKind] = "SQLiteRaw";
	/** @internal */
	config;
	constructor(execute, getSQL, action, dialect, mapBatchResult) {
		super();
		this.execute = execute;
		this.getSQL = getSQL;
		this.dialect = dialect;
		this.mapBatchResult = mapBatchResult;
		this.config = { action };
	}
	getQuery() {
		return {
			...this.dialect.sqlToQuery(this.getSQL()),
			method: this.config.action
		};
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
exports.SQLiteRaw = SQLiteRaw;
//# sourceMappingURL=raw.cjs.map