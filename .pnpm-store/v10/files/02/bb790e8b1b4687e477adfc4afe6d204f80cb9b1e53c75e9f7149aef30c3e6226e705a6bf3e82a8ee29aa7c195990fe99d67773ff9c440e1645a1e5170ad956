import { GelColumn, GelColumnBuilder } from "./common.js";
import { entityKind } from "../../entity.js";

//#region src/gel-core/columns/uuid.ts
var GelUUIDBuilder = class extends GelColumnBuilder {
	static [entityKind] = "GelUUIDBuilder";
	constructor(name) {
		super(name, "string uuid", "GelUUID");
	}
	/** @internal */
	build(table) {
		return new GelUUID(table, this.config);
	}
};
var GelUUID = class extends GelColumn {
	static [entityKind] = "GelUUID";
	getSQLType() {
		return "uuid";
	}
};
function uuid(name) {
	return new GelUUIDBuilder(name ?? "");
}

//#endregion
export { GelUUID, GelUUIDBuilder, uuid };
//# sourceMappingURL=uuid.js.map