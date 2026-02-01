import { MySqlColumn, MySqlColumnBuilder } from "./common.js";
import { entityKind } from "../../entity.js";
import { getColumnNameAndConfig } from "../../utils.js";

//#region src/mysql-core/columns/date.ts
var MySqlDateBuilder = class extends MySqlColumnBuilder {
	static [entityKind] = "MySqlDateBuilder";
	constructor(name) {
		super(name, "object date", "MySqlDate");
	}
	/** @internal */
	build(table) {
		return new MySqlDate(table, this.config);
	}
};
var MySqlDate = class extends MySqlColumn {
	static [entityKind] = "MySqlDate";
	constructor(table, config) {
		super(table, config);
	}
	getSQLType() {
		return `date`;
	}
	mapFromDriverValue(value) {
		return new Date(value);
	}
};
var MySqlDateStringBuilder = class extends MySqlColumnBuilder {
	static [entityKind] = "MySqlDateStringBuilder";
	constructor(name) {
		super(name, "string date", "MySqlDateString");
	}
	/** @internal */
	build(table) {
		return new MySqlDateString(table, this.config);
	}
};
var MySqlDateString = class extends MySqlColumn {
	static [entityKind] = "MySqlDateString";
	constructor(table, config) {
		super(table, config);
	}
	getSQLType() {
		return `date`;
	}
	mapFromDriverValue(value) {
		if (typeof value === "string") return value;
		return value.toISOString().slice(0, -14);
	}
};
function date(a, b) {
	const { name, config } = getColumnNameAndConfig(a, b);
	if (config?.mode === "string") return new MySqlDateStringBuilder(name);
	return new MySqlDateBuilder(name);
}

//#endregion
export { MySqlDate, MySqlDateBuilder, MySqlDateString, MySqlDateStringBuilder, date };
//# sourceMappingURL=date.js.map