import { MySqlColumn, MySqlColumnBuilder } from "./common.js";
import { entityKind } from "../../entity.js";

//#region src/mysql-core/columns/year.ts
var MySqlYearBuilder = class extends MySqlColumnBuilder {
	static [entityKind] = "MySqlYearBuilder";
	constructor(name) {
		super(name, "number year", "MySqlYear");
	}
	/** @internal */
	build(table) {
		return new MySqlYear(table, this.config);
	}
};
var MySqlYear = class extends MySqlColumn {
	static [entityKind] = "MySqlYear";
	getSQLType() {
		return `year`;
	}
	mapFromDriverValue(value) {
		if (typeof value === "number") return value;
		return Number(value);
	}
};
function year(name) {
	return new MySqlYearBuilder(name ?? "");
}

//#endregion
export { MySqlYear, MySqlYearBuilder, year };
//# sourceMappingURL=year.js.map