import { PgRefreshMaterializedView } from "../query-builders/refresh-materialized-view.js";
import { entityKind } from "../../entity.js";
import { tracer } from "../../tracing.js";
import { applyEffectWrapper } from "../../effect-core/query-effect.js";

//#region src/pg-core/effect/refresh-materialized-view.ts
var PgEffectRefreshMaterializedView = class extends PgRefreshMaterializedView {
	static [entityKind] = "PgEffectRefreshMaterializedView";
	/** @internal */
	_prepare(name) {
		return tracer.startActiveSpan("drizzle.prepareQuery", () => {
			return this.session.prepareQuery(this.dialect.sqlToQuery(this.getSQL()), void 0, name, true);
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
applyEffectWrapper(PgEffectRefreshMaterializedView);

//#endregion
export { PgEffectRefreshMaterializedView };
//# sourceMappingURL=refresh-materialized-view.js.map