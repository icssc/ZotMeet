import { GelColumn, GelColumnBuilder } from "./common.js";
import { entityKind } from "../../entity.js";

//#region src/gel-core/columns/text.ts
var GelTextBuilder = class extends GelColumnBuilder {
	static [entityKind] = "GelTextBuilder";
	constructor(name) {
		super(name, "string", "GelText");
	}
	/** @internal */
	build(table) {
		return new GelText(table, this.config);
	}
};
var GelText = class extends GelColumn {
	static [entityKind] = "GelText";
	enumValues = this.config.enumValues;
	getSQLType() {
		return "text";
	}
};
function text(name) {
	return new GelTextBuilder(name ?? "");
}

//#endregion
export { GelText, GelTextBuilder, text };
//# sourceMappingURL=text.js.map