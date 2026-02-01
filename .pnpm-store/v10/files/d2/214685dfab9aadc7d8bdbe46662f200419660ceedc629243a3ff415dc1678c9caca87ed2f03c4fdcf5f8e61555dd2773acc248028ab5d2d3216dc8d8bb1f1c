const require_rolldown_runtime = require('../../_virtual/rolldown_runtime.cjs');
const require_pg_core_query_builders_select = require('../query-builders/select.cjs');
let __entity_ts = require("../../entity.cjs");
let __tracing_ts = require("../../tracing.cjs");
let __utils_ts = require("../../utils.cjs");
let __query_promise_ts = require("../../query-promise.cjs");

//#region src/pg-core/async/select.ts
var PgAsyncSelectBase = class extends require_pg_core_query_builders_select.PgSelectBase {
	static [__entity_ts.entityKind] = "PgAsyncSelectQueryBuilder";
	/** @internal */
	_prepare(name) {
		const { session, config, dialect, joinsNotNullableMap, authToken, cacheConfig, usedTables } = this;
		const { fields } = config;
		return __tracing_ts.tracer.startActiveSpan("drizzle.prepareQuery", () => {
			const fieldsList = (0, __utils_ts.orderSelectedFields)(fields);
			const query = session.prepareQuery(dialect.sqlToQuery(this.getSQL()), fieldsList, name, true, void 0, {
				type: "select",
				tables: [...usedTables]
			}, cacheConfig);
			query.joinsNotNullableMap = joinsNotNullableMap;
			return query.setToken(authToken);
		});
	}
	/**
	* Create a prepared statement for this query. This allows
	* the database to remember this query for the given session
	* and call it by name, rather than specifying the full query.
	*
	* {@link https://www.postgresql.org/docs/current/sql-prepare.html | Postgres prepare documentation}
	*/
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
	execute(placeholderValues) {
		return __tracing_ts.tracer.startActiveSpan("drizzle.operation", () => {
			return this._prepare().execute(placeholderValues);
		});
	}
};
(0, __utils_ts.applyMixins)(PgAsyncSelectBase, [__query_promise_ts.QueryPromise]);

//#endregion
exports.PgAsyncSelectBase = PgAsyncSelectBase;
//# sourceMappingURL=select.cjs.map