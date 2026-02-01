import { GelColumnBuilder } from "./common.js";
import { entityKind } from "../../entity.js";
import { sql } from "../../sql/sql.js";

//#region src/gel-core/columns/date.common.ts
var GelLocalDateColumnBaseBuilder = class extends GelColumnBuilder {
	static [entityKind] = "GelLocalDateColumnBaseBuilder";
	defaultNow() {
		return this.default(sql`now()`);
	}
};

//#endregion
export { GelLocalDateColumnBaseBuilder };
//# sourceMappingURL=date.common.js.map