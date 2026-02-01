import { GelColumn, GelColumnBuilder } from "./common.js";
import { entityKind } from "../../entity.js";

//#region src/gel-core/columns/relative-duration.ts
var GelRelDurationBuilder = class extends GelColumnBuilder {
	static [entityKind] = "GelRelDurationBuilder";
	constructor(name) {
		super(name, "object relDuration", "GelRelDuration");
	}
	/** @internal */
	build(table) {
		return new GelRelDuration(table, this.config);
	}
};
var GelRelDuration = class extends GelColumn {
	static [entityKind] = "GelRelDuration";
	getSQLType() {
		return `edgedbt.relative_duration_t`;
	}
};
function relDuration(name) {
	return new GelRelDurationBuilder(name ?? "");
}

//#endregion
export { GelRelDuration, GelRelDurationBuilder, relDuration };
//# sourceMappingURL=relative-duration.js.map