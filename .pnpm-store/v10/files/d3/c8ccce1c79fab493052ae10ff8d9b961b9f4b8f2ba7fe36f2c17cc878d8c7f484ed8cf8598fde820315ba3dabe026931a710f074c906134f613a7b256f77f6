import { PgColumn } from "./common.js";
import { PgIntColumnBuilder } from "./int.common.js";
import { entityKind } from "../../entity.js";

//#region src/pg-core/columns/integer.ts
var PgIntegerBuilder = class extends PgIntColumnBuilder {
	static [entityKind] = "PgIntegerBuilder";
	constructor(name) {
		super(name, "number int32", "PgInteger");
	}
	/** @internal */
	build(table) {
		return new PgInteger(table, this.config);
	}
};
var PgInteger = class extends PgColumn {
	static [entityKind] = "PgInteger";
	getSQLType() {
		return "integer";
	}
	mapFromDriverValue(value) {
		if (typeof value === "string") return Number.parseInt(value);
		return value;
	}
};
function integer(name) {
	return new PgIntegerBuilder(name ?? "");
}

//#endregion
export { PgInteger, PgIntegerBuilder, integer };
//# sourceMappingURL=integer.js.map