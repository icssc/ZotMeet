const require_rolldown_runtime = require('../../_virtual/rolldown_runtime.cjs');
let __entity_ts = require("../../entity.cjs");
let __tracing_ts = require("../../tracing.cjs");
let __query_promise_ts = require("../../query-promise.cjs");

//#region src/gel-core/query-builders/refresh-materialized-view.ts
var GelRefreshMaterializedView = class extends __query_promise_ts.QueryPromise {
	static [__entity_ts.entityKind] = "GelRefreshMaterializedView";
	config;
	constructor(view, session, dialect) {
		super();
		this.session = session;
		this.dialect = dialect;
		this.config = { view };
	}
	concurrently() {
		if (this.config.withNoData !== void 0) throw new Error("Cannot use concurrently and withNoData together");
		this.config.concurrently = true;
		return this;
	}
	withNoData() {
		if (this.config.concurrently !== void 0) throw new Error("Cannot use concurrently and withNoData together");
		this.config.withNoData = true;
		return this;
	}
	/** @internal */
	getSQL() {
		return this.dialect.buildRefreshMaterializedViewQuery(this.config);
	}
	toSQL() {
		const { typings: _typings, ...rest } = this.dialect.sqlToQuery(this.getSQL());
		return rest;
	}
	/** @internal */
	_prepare(name) {
		return __tracing_ts.tracer.startActiveSpan("drizzle.prepareQuery", () => {
			return this.session.prepareQuery(this.dialect.sqlToQuery(this.getSQL()), void 0, name, true);
		});
	}
	prepare(name) {
		return this._prepare(name);
	}
	execute = (placeholderValues) => {
		return __tracing_ts.tracer.startActiveSpan("drizzle.operation", () => {
			return this._prepare().execute(placeholderValues);
		});
	};
};

//#endregion
exports.GelRefreshMaterializedView = GelRefreshMaterializedView;
//# sourceMappingURL=refresh-materialized-view.cjs.map