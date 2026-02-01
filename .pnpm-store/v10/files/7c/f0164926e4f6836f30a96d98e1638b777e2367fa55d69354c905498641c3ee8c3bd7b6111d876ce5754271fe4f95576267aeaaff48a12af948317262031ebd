import { GelColumn, GelColumnBuilder } from "./common.js";
import { entityKind } from "../../entity.js";

//#region src/gel-core/columns/json.ts
var GelJsonBuilder = class extends GelColumnBuilder {
	static [entityKind] = "GelJsonBuilder";
	constructor(name) {
		super(name, "object json", "GelJson");
	}
	/** @internal */
	build(table) {
		return new GelJson(table, this.config);
	}
};
var GelJson = class extends GelColumn {
	static [entityKind] = "GelJson";
	constructor(table, config) {
		super(table, config);
	}
	getSQLType() {
		return "json";
	}
};
function json(name) {
	return new GelJsonBuilder(name ?? "");
}

//#endregion
export { GelJson, GelJsonBuilder, json };
//# sourceMappingURL=json.js.map