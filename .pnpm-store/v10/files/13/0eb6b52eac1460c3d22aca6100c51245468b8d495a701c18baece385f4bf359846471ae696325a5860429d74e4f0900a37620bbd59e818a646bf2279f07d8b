import { PgRelationalQuery } from "../query-builders/query.js";
import { entityKind } from "../../entity.js";
import { tracer } from "../../tracing.js";
import { mapRelationalRow } from "../../relations.js";
import { applyEffectWrapper } from "../../effect-core/query-effect.js";

//#region src/pg-core/effect/query.ts
var PgEffectRelationalQuery = class extends PgRelationalQuery {
	static [entityKind] = "PgEffectRelationalQueryV2";
	/** @internal */
	_prepare(name) {
		return tracer.startActiveSpan("drizzle.prepareQuery", () => {
			const { query, builtQuery } = this._toSQL();
			return this.session.prepareRelationalQuery(builtQuery, void 0, name, (rawRows, mapColumnValue) => {
				const rows = rawRows.map((row) => mapRelationalRow(row, query.selection, mapColumnValue, this.parseJson));
				if (this.mode === "first") return rows[0];
				return rows;
			});
		});
	}
	prepare(name) {
		return this._prepare(name);
	}
	execute(placeholderValues) {
		return this._prepare().execute(placeholderValues);
	}
};
applyEffectWrapper(PgEffectRelationalQuery);

//#endregion
export { PgEffectRelationalQuery };
//# sourceMappingURL=query.js.map