import { PgSelectBase } from "../query-builders/select.js";
import { entityKind } from "../../entity.js";
import { tracer } from "../../tracing.js";
import { applyMixins, orderSelectedFields } from "../../utils.js";
import { QueryPromise } from "../../query-promise.js";

//#region src/pg-core/async/select.ts
var PgAsyncSelectBase = class extends PgSelectBase {
	static [entityKind] = "PgAsyncSelectQueryBuilder";
	/** @internal */
	_prepare(name) {
		const { session, config, dialect, joinsNotNullableMap, authToken, cacheConfig, usedTables } = this;
		const { fields } = config;
		return tracer.startActiveSpan("drizzle.prepareQuery", () => {
			const fieldsList = orderSelectedFields(fields);
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
		return tracer.startActiveSpan("drizzle.operation", () => {
			return this._prepare().execute(placeholderValues);
		});
	}
};
applyMixins(PgAsyncSelectBase, [QueryPromise]);

//#endregion
export { PgAsyncSelectBase };
//# sourceMappingURL=select.js.map