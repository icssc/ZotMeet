import { entityKind } from "../../entity.js";
import { QueryPromise } from "../../query-promise.js";

//#region src/sqlite-core/query-builders/raw.ts
var SQLiteRaw = class extends QueryPromise {
	static [entityKind] = "SQLiteRaw";
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
export { SQLiteRaw };
//# sourceMappingURL=raw.js.map