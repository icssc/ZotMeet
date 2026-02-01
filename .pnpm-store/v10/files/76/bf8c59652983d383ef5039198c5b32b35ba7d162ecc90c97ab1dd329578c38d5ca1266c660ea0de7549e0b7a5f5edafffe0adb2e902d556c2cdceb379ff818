import { entityKind } from "../../entity.js";

//#region src/pg-core/query-builders/raw.ts
var PgRaw = class {
	static [entityKind] = "PgRaw";
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
export { PgRaw };
//# sourceMappingURL=raw.js.map