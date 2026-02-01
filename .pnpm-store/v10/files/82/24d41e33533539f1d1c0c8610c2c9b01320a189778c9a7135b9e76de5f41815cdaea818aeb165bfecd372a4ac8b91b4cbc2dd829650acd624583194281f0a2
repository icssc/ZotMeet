import { MySqlColumn, MySqlColumnBuilder } from "./common.js";
import { entityKind } from "../../entity.js";

//#region src/mysql-core/columns/boolean.ts
var MySqlBooleanBuilder = class extends MySqlColumnBuilder {
	static [entityKind] = "MySqlBooleanBuilder";
	constructor(name) {
		super(name, "boolean", "MySqlBoolean");
	}
	/** @internal */
	build(table) {
		return new MySqlBoolean(table, this.config);
	}
};
var MySqlBoolean = class extends MySqlColumn {
	static [entityKind] = "MySqlBoolean";
	getSQLType() {
		return "boolean";
	}
	mapFromDriverValue(value) {
		if (typeof value === "boolean") return value;
		return value === 1;
	}
};
function boolean(name) {
	return new MySqlBooleanBuilder(name ?? "");
}

//#endregion
export { MySqlBoolean, MySqlBooleanBuilder, boolean };
//# sourceMappingURL=boolean.js.map