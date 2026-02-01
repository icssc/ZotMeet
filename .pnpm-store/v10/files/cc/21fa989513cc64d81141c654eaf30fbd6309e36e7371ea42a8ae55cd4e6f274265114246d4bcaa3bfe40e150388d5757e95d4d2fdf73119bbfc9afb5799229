import { extractUsedTable } from "../utils.js";
import { PgUpdateBase } from "../query-builders/update.js";
import { entityKind } from "../../entity.js";
import { applyEffectWrapper } from "../../effect-core/query-effect.js";

//#region src/pg-core/effect/update.ts
var PgEffectUpdateBase = class extends PgUpdateBase {
	static [entityKind] = "PgEffectUpdate";
	/** @internal */
	_prepare(name) {
		const query = this.session.prepareQuery(this.dialect.sqlToQuery(this.getSQL()), this.config.returning, name, true, void 0, {
			type: "insert",
			tables: extractUsedTable(this.config.table)
		}, this.cacheConfig);
		query.joinsNotNullableMap = this.joinsNotNullableMap;
		return query;
	}
	prepare(name) {
		return this._prepare(name);
	}
	execute = (placeholderValues = {}) => {
		return this._prepare().execute(placeholderValues);
	};
};
applyEffectWrapper(PgEffectUpdateBase);

//#endregion
export { PgEffectUpdateBase };
//# sourceMappingURL=update.js.map