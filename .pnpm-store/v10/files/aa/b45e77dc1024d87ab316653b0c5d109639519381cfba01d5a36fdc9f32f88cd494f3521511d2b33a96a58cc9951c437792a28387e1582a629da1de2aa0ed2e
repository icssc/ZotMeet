import { PgColumn, PgColumnBuilder } from "./common.js";
import { entityKind } from "../../entity.js";

//#region src/pg-core/columns/json.ts
var PgJsonBuilder = class extends PgColumnBuilder {
	static [entityKind] = "PgJsonBuilder";
	constructor(name) {
		super(name, "object json", "PgJson");
	}
	/** @internal */
	build(table) {
		return new PgJson(table, this.config);
	}
};
var PgJson = class extends PgColumn {
	static [entityKind] = "PgJson";
	constructor(table, config) {
		super(table, config);
	}
	getSQLType() {
		return "json";
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
function json(name) {
	return new PgJsonBuilder(name ?? "");
}

//#endregion
export { PgJson, PgJsonBuilder, json };
//# sourceMappingURL=json.js.map