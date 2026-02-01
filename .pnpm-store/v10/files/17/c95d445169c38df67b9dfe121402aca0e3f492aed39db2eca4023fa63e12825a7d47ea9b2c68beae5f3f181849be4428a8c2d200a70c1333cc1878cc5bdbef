import { extractUsedTable } from "../utils.js";
import { PgDeleteBase } from "../query-builders/delete.js";
import { entityKind } from "../../entity.js";
import { tracer } from "../../tracing.js";
import { applyMixins } from "../../utils.js";
import { QueryPromise } from "../../query-promise.js";

//#region src/pg-core/async/delete.ts
var PgAsyncDeleteBase = class extends PgDeleteBase {
	static [entityKind] = "PgAsyncDelete";
	/** @internal */
	_prepare(name) {
		return tracer.startActiveSpan("drizzle.prepareQuery", () => {
			return this.session.prepareQuery(this.dialect.sqlToQuery(this.getSQL()), this.config.returning, name, true, void 0, {
				type: "delete",
				tables: extractUsedTable(this.config.table)
			}, this.cacheConfig).setToken(this.authToken);
		});
	}
	prepare(name) {
		return this._prepare(name);
	}
	/** @internal */
	authToken;
	/** @internal */
	setToken(token) {
		this.authToken = token;
		return this;
	}
	execute = (placeholderValues) => {
		return tracer.startActiveSpan("drizzle.operation", () => {
			return this._prepare().execute(placeholderValues);
		});
	};
};
applyMixins(PgAsyncDeleteBase, [QueryPromise]);

//#endregion
export { PgAsyncDeleteBase };
//# sourceMappingURL=delete.js.map