import { PgColumn, PgColumnBuilder } from "./common.js";
import { entityKind } from "../../entity.js";

//#region src/pg-core/columns/real.ts
var PgRealBuilder = class extends PgColumnBuilder {
	static [entityKind] = "PgRealBuilder";
	constructor(name, length) {
		super(name, "number float", "PgReal");
		this.config.length = length;
	}
	/** @internal */
	build(table) {
		return new PgReal(table, this.config);
	}
};
var PgReal = class extends PgColumn {
	static [entityKind] = "PgReal";
	constructor(table, config) {
		super(table, config);
	}
	getSQLType() {
		return "real";
	}
	mapFromDriverValue(value) {
		if (typeof value === "string") return Number.parseFloat(value);
		return value;
	}
};
function real(name) {
	return new PgRealBuilder(name ?? "");
}

//#endregion
export { PgReal, PgRealBuilder, real };
//# sourceMappingURL=real.js.map