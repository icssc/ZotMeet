const require_rolldown_runtime = require('../../_virtual/rolldown_runtime.cjs');
const require_pg_core_query_builders_query = require('../query-builders/query.cjs');
let __entity_ts = require("../../entity.cjs");
let __tracing_ts = require("../../tracing.cjs");
let __utils_ts = require("../../utils.cjs");
let __query_promise_ts = require("../../query-promise.cjs");
let __relations_ts = require("../../relations.cjs");

//#region src/pg-core/async/query.ts
var PgAsyncRelationalQuery = class extends require_pg_core_query_builders_query.PgRelationalQuery {
	static [__entity_ts.entityKind] = "PgAsyncRelationalQueryV2";
	/** @internal */
	_prepare(name) {
		return __tracing_ts.tracer.startActiveSpan("drizzle.prepareQuery", () => {
			const { query, builtQuery } = this._toSQL();
			return this.session.prepareRelationalQuery(builtQuery, void 0, name, (rawRows, mapColumnValue) => {
				const rows = rawRows.map((row) => (0, __relations_ts.mapRelationalRow)(row, query.selection, mapColumnValue, this.parseJson));
				if (this.mode === "first") return rows[0];
				return rows;
			}).setToken(this.authToken);
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
	execute(placeholderValues) {
		return __tracing_ts.tracer.startActiveSpan("drizzle.operation", () => {
			return this._prepare().execute(placeholderValues);
		});
	}
};
(0, __utils_ts.applyMixins)(PgAsyncRelationalQuery, [__query_promise_ts.QueryPromise]);

//#endregion
exports.PgAsyncRelationalQuery = PgAsyncRelationalQuery;
//# sourceMappingURL=query.cjs.map