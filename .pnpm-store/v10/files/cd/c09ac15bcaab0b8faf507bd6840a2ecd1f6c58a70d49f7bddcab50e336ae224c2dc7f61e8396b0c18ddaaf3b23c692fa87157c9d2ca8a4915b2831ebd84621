import { PgRaw } from "../query-builders/raw.js";
import { entityKind } from "../../entity.js";
import { applyEffectWrapper } from "../../effect-core/query-effect.js";

//#region src/pg-core/effect/raw.ts
var PgEffectRaw = class extends PgRaw {
	static [entityKind] = "PgEffectRaw";
	constructor(execute, sql, query, mapBatchResult) {
		super(sql, query, mapBatchResult);
		this.execute = execute;
	}
	_prepare() {
		return this;
	}
};
applyEffectWrapper(PgEffectRaw);

//#endregion
export { PgEffectRaw };
//# sourceMappingURL=raw.js.map