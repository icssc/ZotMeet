import { entityKind } from "../../entity.js";
import { QueryPromise } from "../../query-promise.js";

//#region src/gel-core/query-builders/raw.ts
var GelRaw = class extends QueryPromise {
	static [entityKind] = "GelRaw";
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
export { GelRaw };
//# sourceMappingURL=raw.js.map