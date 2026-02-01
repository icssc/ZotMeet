const require_rolldown_runtime = require('../../_virtual/rolldown_runtime.cjs');
const require_pg_core_columns_common = require('./common.cjs');
const require_pg_core_columns_date_common = require('./date.common.cjs');
let __entity_ts = require("../../entity.cjs");
let __utils_ts = require("../../utils.cjs");

//#region src/pg-core/columns/date.ts
var PgDateBuilder = class extends require_pg_core_columns_date_common.PgDateColumnBuilder {
	static [__entity_ts.entityKind] = "PgDateBuilder";
	constructor(name) {
		super(name, "object date", "PgDate");
	}
	/** @internal */
	build(table) {
		return new PgDate(table, this.config);
	}
};
var PgDate = class extends require_pg_core_columns_common.PgColumn {
	static [__entity_ts.entityKind] = "PgDate";
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
var PgDateStringBuilder = class extends require_pg_core_columns_date_common.PgDateColumnBuilder {
	static [__entity_ts.entityKind] = "PgDateStringBuilder";
	constructor(name) {
		super(name, "string date", "PgDateString");
	}
	/** @internal */
	build(table) {
		return new PgDateString(table, this.config);
	}
};
var PgDateString = class extends require_pg_core_columns_common.PgColumn {
	static [__entity_ts.entityKind] = "PgDateString";
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
	const { name, config } = (0, __utils_ts.getColumnNameAndConfig)(a, b);
	if (config?.mode === "date") return new PgDateBuilder(name);
	return new PgDateStringBuilder(name);
}

//#endregion
exports.PgDate = PgDate;
exports.PgDateBuilder = PgDateBuilder;
exports.PgDateString = PgDateString;
exports.PgDateStringBuilder = PgDateStringBuilder;
exports.date = date;
//# sourceMappingURL=date.cjs.map