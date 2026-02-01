import { GelColumn, GelColumnBuilder } from "./common.js";
import { entityKind } from "../../entity.js";

//#region src/gel-core/columns/bytes.ts
var GelBytesBuilder = class extends GelColumnBuilder {
	static [entityKind] = "GelBytesBuilder";
	constructor(name) {
		super(name, "object buffer", "GelBytes");
	}
	/** @internal */
	build(table) {
		return new GelBytes(table, this.config);
	}
};
var GelBytes = class extends GelColumn {
	static [entityKind] = "GelBytes";
	getSQLType() {
		return "bytea";
	}
};
function bytes(name) {
	return new GelBytesBuilder(name ?? "");
}

//#endregion
export { GelBytes, GelBytesBuilder, bytes };
//# sourceMappingURL=bytes.js.map