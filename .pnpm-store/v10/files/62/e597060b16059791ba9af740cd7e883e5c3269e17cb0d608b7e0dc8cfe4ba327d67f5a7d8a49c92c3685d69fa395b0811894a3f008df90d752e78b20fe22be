import { extractUsedTable } from "../utils.js";
import { PgDeleteBase } from "../query-builders/delete.js";
import { entityKind } from "../../entity.js";
import { tracer } from "../../tracing.js";
import { applyEffectWrapper } from "../../effect-core/query-effect.js";

//#region src/pg-core/effect/delete.ts
var PgEffectDeleteBase = class extends PgDeleteBase {
	static [entityKind] = "PgEffectDelete";
	/** @internal */
	_prepare(name) {
		return tracer.startActiveSpan("drizzle.prepareQuery", () => {
			return this.session.prepareQuery(this.dialect.sqlToQuery(this.getSQL()), this.config.returning, name, true, void 0, {
				type: "delete",
				tables: extractUsedTable(this.config.table)
			}, this.cacheConfig);
		});
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
applyEffectWrapper(PgEffectDeleteBase);

//#endregion
export { PgEffectDeleteBase };
//# sourceMappingURL=delete.js.map