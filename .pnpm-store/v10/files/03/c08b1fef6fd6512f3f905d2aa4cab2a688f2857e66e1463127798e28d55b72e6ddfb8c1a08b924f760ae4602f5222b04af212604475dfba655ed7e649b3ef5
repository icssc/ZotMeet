const require_rolldown_runtime = require('../../_virtual/rolldown_runtime.cjs');
const require_mysql_core_columns_common = require('./common.cjs');
let __entity_ts = require("../../entity.cjs");
let __utils_ts = require("../../utils.cjs");

//#region src/mysql-core/columns/float.ts
var MySqlFloatBuilder = class extends require_mysql_core_columns_common.MySqlColumnBuilderWithAutoIncrement {
	static [__entity_ts.entityKind] = "MySqlFloatBuilder";
	constructor(name, config) {
		super(name, config?.unsigned ? "number ufloat" : "number float", "MySqlFloat");
		this.config.precision = config?.precision;
		this.config.scale = config?.scale;
		this.config.unsigned = config?.unsigned;
	}
	/** @internal */
	build(table) {
		return new MySqlFloat(table, this.config);
	}
};
var MySqlFloat = class extends require_mysql_core_columns_common.MySqlColumnWithAutoIncrement {
	static [__entity_ts.entityKind] = "MySqlFloat";
	precision = this.config.precision;
	scale = this.config.scale;
	unsigned = this.config.unsigned;
	mapFromDriverValue(value) {
		if (typeof value === "string") return Number(value);
		return value;
	}
	getSQLType() {
		let type = "";
		if (this.precision !== void 0 && this.scale !== void 0) type += `float(${this.precision},${this.scale})`;
		else if (this.precision === void 0) type += "float";
		else type += `float(${this.precision})`;
		return this.unsigned ? `${type} unsigned` : type;
	}
};
function float(a, b) {
	const { name, config } = (0, __utils_ts.getColumnNameAndConfig)(a, b);
	return new MySqlFloatBuilder(name, config);
}

//#endregion
exports.MySqlFloat = MySqlFloat;
exports.MySqlFloatBuilder = MySqlFloatBuilder;
exports.float = float;
//# sourceMappingURL=float.cjs.map