import { PgColumn } from "./common.js";
import { PgDateColumnBuilder } from "./date.common.js";
import { entityKind } from "../../entity.js";
import { getColumnNameAndConfig } from "../../utils.js";

//#region src/pg-core/columns/date.ts
var PgDateBuilder = class extends PgDateColumnBuilder {
	static [entityKind] = "PgDateBuilder";
	constructor(name) {
		super(name, "object date", "PgDate");
	}
	/** @internal */
	build(table) {
		return new PgDate(table, this.config);
	}
};
var PgDate = class extends PgColumn {
	static [entityKind] = "PgDate";
	getSQLType() {
		return "date";
	}
	mapFromDriverValue(value) {
		if (typeof value === "string") return new Date(value);
		return value;
	}
	mapToDriverValue(value) {
		if (typeof value === "string") return value;
		return value.toISOString();
	}
};
var PgDateStringBuilder = class extends PgDateColumnBuilder {
	static [entityKind] = "PgDateStringBuilder";
	constructor(name) {
		super(name, "string date", "PgDateString");
	}
	/** @internal */
	build(table) {
		return new PgDateString(table, this.config);
	}
};
var PgDateString = class extends PgColumn {
	static [entityKind] = "PgDateString";
	getSQLType() {
		return "date";
	}
	mapFromDriverValue(value) {
		if (typeof value === "string") return value;
		return value.toISOString().slice(0, -14);
	}
	mapToDriverValue(value) {
		if (typeof value === "string") return value;
		return value.toISOString();
	}
};
function date(a, b) {
	const { name, config } = getColumnNameAndConfig(a, b);
	if (config?.mode === "date") return new PgDateBuilder(name);
	return new PgDateStringBuilder(name);
}

//#endregion
export { PgDate, PgDateBuilder, PgDateString, PgDateStringBuilder, date };
//# sourceMappingURL=date.js.map