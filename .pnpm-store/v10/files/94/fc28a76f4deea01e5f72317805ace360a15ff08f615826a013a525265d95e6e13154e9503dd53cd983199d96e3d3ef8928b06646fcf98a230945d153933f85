const require_rolldown_runtime = require('../../_virtual/rolldown_runtime.cjs');
const require_pg_core_query_builders_refresh_materialized_view = require('../query-builders/refresh-materialized-view.cjs');
let __entity_ts = require("../../entity.cjs");
let __tracing_ts = require("../../tracing.cjs");
let __utils_ts = require("../../utils.cjs");
let __query_promise_ts = require("../../query-promise.cjs");

//#region src/pg-core/async/refresh-materialized-view.ts
var PgAsyncRefreshMaterializedView = class extends require_pg_core_query_builders_refresh_materialized_view.PgRefreshMaterializedView {
	static [__entity_ts.entityKind] = "PgAsyncRefreshMaterializedView";
	/** @internal */
	_prepare(name) {
		return __tracing_ts.tracer.startActiveSpan("drizzle.prepareQuery", () => {
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
		return __tracing_ts.tracer.startActiveSpan("drizzle.operation", () => {
			return this._prepare().execute(placeholderValues);
		});
	};
};
(0, __utils_ts.applyMixins)(PgAsyncRefreshMaterializedView, [__query_promise_ts.QueryPromise]);

//#endregion
exports.PgAsyncRefreshMaterializedView = PgAsyncRefreshMaterializedView;
//# sourceMappingURL=refresh-materialized-view.cjs.map