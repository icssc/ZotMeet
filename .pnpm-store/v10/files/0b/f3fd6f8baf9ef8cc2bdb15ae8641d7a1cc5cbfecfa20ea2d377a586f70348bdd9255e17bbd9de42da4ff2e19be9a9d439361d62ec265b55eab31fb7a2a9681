import { PgRelationalQuery } from "../query-builders/query.js";
import { entityKind } from "../../entity.js";
import { tracer } from "../../tracing.js";
import { applyMixins } from "../../utils.js";
import { QueryPromise } from "../../query-promise.js";
import { mapRelationalRow } from "../../relations.js";

//#region src/pg-core/async/query.ts
var PgAsyncRelationalQuery = class extends PgRelationalQuery {
	static [entityKind] = "PgAsyncRelationalQueryV2";
	/** @internal */
	_prepare(name) {
		return tracer.startActiveSpan("drizzle.prepareQuery", () => {
			const { query, builtQuery } = this._toSQL();
			return this.session.prepareRelationalQuery(builtQuery, void 0, name, (rawRows, mapColumnValue) => {
				const rows = rawRows.map((row) => mapRelationalRow(row, query.selection, mapColumnValue, this.parseJson));
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
		return tracer.startActiveSpan("drizzle.operation", () => {
			return this._prepare().execute(placeholderValues);
		});
	}
};
applyMixins(PgAsyncRelationalQuery, [QueryPromise]);

//#endregion
export { PgAsyncRelationalQuery };
//# sourceMappingURL=query.js.map