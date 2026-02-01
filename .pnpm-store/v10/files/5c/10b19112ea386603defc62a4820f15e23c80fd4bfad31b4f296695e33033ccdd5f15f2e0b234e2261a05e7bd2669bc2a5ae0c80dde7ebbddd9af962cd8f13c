import { PgRaw } from "../query-builders/raw.js";
import { entityKind } from "../../entity.js";
import { applyMixins } from "../../utils.js";
import { QueryPromise } from "../../query-promise.js";

//#region src/pg-core/async/raw.ts
var PgAsyncRaw = class extends PgRaw {
	static [entityKind] = "PgAsyncRaw";
	constructor(execute, sql, query, mapBatchResult) {
		super(sql, query, mapBatchResult);
		this.execute = execute;
	}
	_prepare() {
		return this;
	}
};
applyMixins(PgAsyncRaw, [QueryPromise]);

//#endregion
export { PgAsyncRaw };
//# sourceMappingURL=raw.js.map