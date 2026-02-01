const require_rolldown_runtime = require('../../_virtual/rolldown_runtime.cjs');
const require_mysql_core_columns_common = require('./common.cjs');
let __entity_ts = require("../../entity.cjs");
let __utils_ts = require("../../utils.cjs");

//#region src/mysql-core/columns/date.ts
var MySqlDateBuilder = class extends require_mysql_core_columns_common.MySqlColumnBuilder {
	static [__entity_ts.entityKind] = "MySqlDateBuilder";
	constructor(name) {
		super(name, "object date", "MySqlDate");
	}
	/** @internal */
	build(table) {
		return new MySqlDate(table, this.config);
	}
};
var MySqlDate = class extends require_mysql_core_columns_common.MySqlColumn {
	static [__entity_ts.entityKind] = "MySqlDate";
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
var MySqlDateStringBuilder = class extends require_mysql_core_columns_common.MySqlColumnBuilder {
	static [__entity_ts.entityKind] = "MySqlDateStringBuilder";
	constructor(name) {
		super(name, "string date", "MySqlDateString");
	}
	/** @internal */
	build(table) {
		return new MySqlDateString(table, this.config);
	}
};
var MySqlDateString = class extends require_mysql_core_columns_common.MySqlColumn {
	static [__entity_ts.entityKind] = "MySqlDateString";
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
	const { name, config } = (0, __utils_ts.getColumnNameAndConfig)(a, b);
	if (config?.mode === "string") return new MySqlDateStringBuilder(name);
	return new MySqlDateBuilder(name);
}

//#endregion
exports.MySqlDate = MySqlDate;
exports.MySqlDateBuilder = MySqlDateBuilder;
exports.MySqlDateString = MySqlDateString;
exports.MySqlDateStringBuilder = MySqlDateStringBuilder;
exports.date = date;
//# sourceMappingURL=date.cjs.map