import { PgRefreshMaterializedView } from "../query-builders/refresh-materialized-view.js";
import { entityKind } from "../../entity.js";
import { tracer } from "../../tracing.js";
import { applyMixins } from "../../utils.js";
import { QueryPromise } from "../../query-promise.js";

//#region src/pg-core/async/refresh-materialized-view.ts
var PgAsyncRefreshMaterializedView = class extends PgRefreshMaterializedView {
	static [entityKind] = "PgAsyncRefreshMaterializedView";
	/** @internal */
	_prepare(name) {
		return tracer.startActiveSpan("drizzle.prepareQuery", () => {
			return this.session.prepareQuery(this.dialect.sqlToQuery(this.getSQL()), void 0, name, true).setToken(this.authToken);
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
applyMixins(PgAsyncRefreshMaterializedView, [QueryPromise]);

//#endregion
export { PgAsyncRefreshMaterializedView };
//# sourceMappingURL=refresh-materialized-view.js.map