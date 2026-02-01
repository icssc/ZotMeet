const require_rolldown_runtime = require('../../_virtual/rolldown_runtime.cjs');
let __entity_ts = require("../../entity.cjs");

//#region src/pg-core/query-builders/raw.ts
var PgRaw = class {
	static [__entity_ts.entityKind] = "PgRaw";
	constructor(sql, query, mapBatchResult) {
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
	/** @internal */
	isResponseInArrayMode() {
		return false;
	}
};

//#endregion
exports.PgRaw = PgRaw;
//# sourceMappingURL=raw.cjs.map