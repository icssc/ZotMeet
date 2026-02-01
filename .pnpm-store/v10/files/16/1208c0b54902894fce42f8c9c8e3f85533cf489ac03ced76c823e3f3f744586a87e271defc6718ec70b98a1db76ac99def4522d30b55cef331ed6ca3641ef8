import { PgSelectBase } from "../query-builders/select.js";
import { entityKind } from "../../entity.js";
import { orderSelectedFields } from "../../utils.js";
import { applyEffectWrapper } from "../../effect-core/query-effect.js";

//#region src/pg-core/effect/select.ts
var PgEffectSelectBase = class extends PgSelectBase {
	static [entityKind] = "PgEffectSelectQueryBuilder";
	/** @internal */
	_prepare(name) {
		const { session, config, dialect, joinsNotNullableMap, cacheConfig, usedTables } = this;
		const { fields } = config;
		const fieldsList = orderSelectedFields(fields);
		const query = session.prepareQuery(dialect.sqlToQuery(this.getSQL()), fieldsList, name, true, void 0, {
			type: "select",
			tables: [...usedTables]
		}, cacheConfig);
		query.joinsNotNullableMap = joinsNotNullableMap;
		return query;
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
	execute = (placeholderValues) => {
		return this._prepare().execute(placeholderValues);
	};
};
applyEffectWrapper(PgEffectSelectBase);

//#endregion
export { PgEffectSelectBase };
//# sourceMappingURL=select.js.map