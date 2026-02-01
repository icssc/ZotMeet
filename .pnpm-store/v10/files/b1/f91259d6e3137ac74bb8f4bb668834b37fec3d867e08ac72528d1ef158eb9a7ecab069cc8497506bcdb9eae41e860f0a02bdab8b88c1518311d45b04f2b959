const require_rolldown_runtime = require('../../_virtual/rolldown_runtime.cjs');
let __entity_ts = require("../../entity.cjs");

//#region src/pg-core/query-builders/refresh-materialized-view.ts
var PgRefreshMaterializedView = class {
	static [__entity_ts.entityKind] = "PgRefreshMaterializedView";
	config;
	constructor(view, session, dialect) {
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
};

//#endregion
exports.PgRefreshMaterializedView = PgRefreshMaterializedView;
//# sourceMappingURL=refresh-materialized-view.cjs.map