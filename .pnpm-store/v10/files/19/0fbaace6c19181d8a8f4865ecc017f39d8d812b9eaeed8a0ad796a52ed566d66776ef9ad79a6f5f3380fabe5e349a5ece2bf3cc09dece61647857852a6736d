import { entityKind } from "../../entity.js";
import { tracer } from "../../tracing.js";
import { QueryPromise } from "../../query-promise.js";

//#region src/cockroach-core/query-builders/refresh-materialized-view.ts
var CockroachRefreshMaterializedView = class extends QueryPromise {
	static [entityKind] = "CockroachRefreshMaterializedView";
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
		return tracer.startActiveSpan("drizzle.prepareQuery", () => {
			return this.session.prepareQuery(this.dialect.sqlToQuery(this.getSQL()), void 0, name, true);
		});
	}
	prepare(name) {
		return this._prepare(name);
	}
	authToken;
	/** @internal */
	setToken(token) {
		this.authToken = token;
		return this;
	}
	execute = (placeholderValues) => {
		return tracer.startActiveSpan("drizzle.operation", () => {
			return this._prepare().execute(placeholderValues, this.authToken);
		});
	};
};

//#endregion
export { CockroachRefreshMaterializedView };
//# sourceMappingURL=refresh-materialized-view.js.map