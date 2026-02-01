import { PgColumn, PgColumnBuilder } from "./common.js";
import { entityKind } from "../../entity.js";

//#region src/pg-core/columns/jsonb.ts
var PgJsonbBuilder = class extends PgColumnBuilder {
	static [entityKind] = "PgJsonbBuilder";
	constructor(name) {
		super(name, "object json", "PgJsonb");
	}
	/** @internal */
	build(table) {
		return new PgJsonb(table, this.config);
	}
};
var PgJsonb = class extends PgColumn {
	static [entityKind] = "PgJsonb";
	constructor(table, config) {
		super(table, config);
	}
	getSQLType() {
		return "jsonb";
	}
	mapToDriverValue(value) {
		return JSON.stringify(value);
	}
	mapFromDriverValue(value) {
		if (typeof value === "string") try {
			return JSON.parse(value);
		} catch {
			return value;
		}
		return value;
	}
};
function jsonb(name) {
	return new PgJsonbBuilder(name ?? "");
}

//#endregion
export { PgJsonb, PgJsonbBuilder, jsonb };
//# sourceMappingURL=jsonb.js.map