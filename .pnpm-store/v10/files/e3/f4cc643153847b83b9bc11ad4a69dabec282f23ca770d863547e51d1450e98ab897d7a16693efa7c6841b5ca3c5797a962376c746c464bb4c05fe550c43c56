const require_rolldown_runtime = require('../../_virtual/rolldown_runtime.cjs');
const require_mysql_core_columns_date_common = require('./date.common.cjs');
let __entity_ts = require("../../entity.cjs");
let __utils_ts = require("../../utils.cjs");

//#region src/mysql-core/columns/datetime.ts
var MySqlDateTimeBuilder = class extends require_mysql_core_columns_date_common.MySqlDateColumnBaseBuilder {
	static [__entity_ts.entityKind] = "MySqlDateTimeBuilder";
	constructor(name, config) {
		super(name, "object date", "MySqlDateTime");
		this.config.fsp = config?.fsp;
	}
	/** @internal */
	build(table) {
		return new MySqlDateTime(table, this.config);
	}
};
var MySqlDateTime = class extends require_mysql_core_columns_date_common.MySqlDateBaseColumn {
	static [__entity_ts.entityKind] = "MySqlDateTime";
	fsp;
	constructor(table, config) {
		super(table, config);
		this.fsp = config.fsp;
	}
	getSQLType() {
		return `datetime${this.fsp === void 0 ? "" : `(${this.fsp})`}`;
	}
	mapToDriverValue(value) {
		if (typeof value === "string") return value;
		return value.toISOString().replace("T", " ").replace("Z", "");
	}
	mapFromDriverValue(value) {
		if (typeof value === "string") return /* @__PURE__ */ new Date(value.replace(" ", "T") + "Z");
		return value;
	}
};
var MySqlDateTimeStringBuilder = class extends require_mysql_core_columns_date_common.MySqlDateColumnBaseBuilder {
	static [__entity_ts.entityKind] = "MySqlDateTimeStringBuilder";
	constructor(name, config) {
		super(name, "string datetime", "MySqlDateTimeString");
		this.config.fsp = config?.fsp;
	}
	/** @internal */
	build(table) {
		return new MySqlDateTimeString(table, this.config);
	}
};
var MySqlDateTimeString = class extends require_mysql_core_columns_date_common.MySqlDateBaseColumn {
	static [__entity_ts.entityKind] = "MySqlDateTimeString";
	fsp;
	constructor(table, config) {
		super(table, config);
		this.fsp = config.fsp;
	}
	getSQLType() {
		return `datetime${this.fsp === void 0 ? "" : `(${this.fsp})`}`;
	}
	mapFromDriverValue(value) {
		if (typeof value === "string") return value;
		return value.toISOString().slice(0, -5).replace("T", " ");
	}
	mapToDriverValue(value) {
		if (typeof value === "string") return value;
		return value.toISOString().replace("T", " ").replace("Z", "");
	}
};
function datetime(a, b) {
	const { name, config } = (0, __utils_ts.getColumnNameAndConfig)(a, b);
	if (config?.mode === "string") return new MySqlDateTimeStringBuilder(name, config);
	return new MySqlDateTimeBuilder(name, config);
}

//#endregion
exports.MySqlDateTime = MySqlDateTime;
exports.MySqlDateTimeBuilder = MySqlDateTimeBuilder;
exports.MySqlDateTimeString = MySqlDateTimeString;
exports.MySqlDateTimeStringBuilder = MySqlDateTimeStringBuilder;
exports.datetime = datetime;
//# sourceMappingURL=datetime.cjs.map