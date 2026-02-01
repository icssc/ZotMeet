import { extractUsedTable } from "../utils.js";
import { PgInsertBase } from "../query-builders/insert.js";
import { entityKind } from "../../entity.js";
import { tracer } from "../../tracing.js";
import { applyEffectWrapper } from "../../effect-core/query-effect.js";

//#region src/pg-core/effect/insert.ts
var PgEffectInsertBase = class extends PgInsertBase {
	static [entityKind] = "PgEffectInsert";
	/** @internal */
	_prepare(name) {
		return this.session.prepareQuery(this.dialect.sqlToQuery(this.getSQL()), this.config.returning, name, true, void 0, {
			type: "insert",
			tables: extractUsedTable(this.config.table)
		}, this.cacheConfig);
	}
	prepare(name) {
		return this._prepare(name);
	}
	execute = (placeholderValues) => {
		return tracer.startActiveSpan("drizzle.operation", () => {
			return this._prepare().execute(placeholderValues);
		});
	};
};
applyEffectWrapper(PgEffectInsertBase);

//#endregion
export { PgEffectInsertBase };
//# sourceMappingURL=insert.js.map