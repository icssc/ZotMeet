const require_rolldown_runtime = require('../../_virtual/rolldown_runtime.cjs');
const require_mysql_core_columns_common = require('./common.cjs');
let __entity_ts = require("../../entity.cjs");
let __utils_ts = require("../../utils.cjs");

//#region src/mysql-core/columns/time.ts
var MySqlTimeBuilder = class extends require_mysql_core_columns_common.MySqlColumnBuilder {
	static [__entity_ts.entityKind] = "MySqlTimeBuilder";
	constructor(name, config) {
		super(name, "string time", "MySqlTime");
		this.config.fsp = config?.fsp;
	}
	/** @internal */
	build(table) {
		return new MySqlTime(table, this.config);
	}
};
var MySqlTime = class extends require_mysql_core_columns_common.MySqlColumn {
	static [__entity_ts.entityKind] = "MySqlTime";
	fsp = this.config.fsp;
	getSQLType() {
		return `time${this.fsp === void 0 ? "" : `(${this.fsp})`}`;
	}
	mapFromDriverValue(value) {
		if (typeof value === "string") return value;
		return value.toTimeString().split(" ").shift();
	}
};
function time(a, b) {
	const { name, config } = (0, __utils_ts.getColumnNameAndConfig)(a, b);
	return new MySqlTimeBuilder(name, config);
}

//#endregion
exports.MySqlTime = MySqlTime;
exports.MySqlTimeBuilder = MySqlTimeBuilder;
exports.time = time;
//# sourceMappingURL=time.cjs.map