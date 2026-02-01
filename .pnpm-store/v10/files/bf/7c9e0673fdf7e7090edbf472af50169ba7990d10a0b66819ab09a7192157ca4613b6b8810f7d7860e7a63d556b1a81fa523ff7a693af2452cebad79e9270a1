const require_rolldown_runtime = require('../../_virtual/rolldown_runtime.cjs');
const require_mysql_core_columns_common = require('./common.cjs');
let __entity_ts = require("../../entity.cjs");
let __utils_ts = require("../../utils.cjs");

//#region src/mysql-core/columns/decimal.ts
var MySqlDecimalBuilder = class extends require_mysql_core_columns_common.MySqlColumnBuilderWithAutoIncrement {
	static [__entity_ts.entityKind] = "MySqlDecimalBuilder";
	constructor(name, config) {
		super(name, config?.unsigned ? "string unumeric" : "string numeric", "MySqlDecimal");
		this.config.precision = config?.precision;
		this.config.scale = config?.scale;
		this.config.unsigned = config?.unsigned;
	}
	/** @internal */
	build(table) {
		return new MySqlDecimal(table, this.config);
	}
};
var MySqlDecimal = class extends require_mysql_core_columns_common.MySqlColumnWithAutoIncrement {
	static [__entity_ts.entityKind] = "MySqlDecimal";
	precision = this.config.precision;
	scale = this.config.scale;
	unsigned = this.config.unsigned;
	mapFromDriverValue(value) {
		if (typeof value === "string") return value;
		return String(value);
	}
	getSQLType() {
		let type = "";
		if (this.precision !== void 0 && this.scale !== void 0) type += `decimal(${this.precision},${this.scale})`;
		else if (this.precision === void 0) type += "decimal";
		else type += `decimal(${this.precision})`;
		type = type === "decimal(10,0)" || type === "decimal(10)" ? "decimal" : type;
		return this.unsigned ? `${type} unsigned` : type;
	}
};
var MySqlDecimalNumberBuilder = class extends require_mysql_core_columns_common.MySqlColumnBuilderWithAutoIncrement {
	static [__entity_ts.entityKind] = "MySqlDecimalNumberBuilder";
	constructor(name, config) {
		super(name, config?.unsigned ? "number unsigned" : "number", "MySqlDecimalNumber");
		this.config.precision = config?.precision;
		this.config.scale = config?.scale;
		this.config.unsigned = config?.unsigned;
	}
	/** @internal */
	build(table) {
		return new MySqlDecimalNumber(table, this.config);
	}
};
var MySqlDecimalNumber = class extends require_mysql_core_columns_common.MySqlColumnWithAutoIncrement {
	static [__entity_ts.entityKind] = "MySqlDecimalNumber";
	precision = this.config.precision;
	scale = this.config.scale;
	unsigned = this.config.unsigned;
	mapFromDriverValue(value) {
		if (typeof value === "number") return value;
		return Number(value);
	}
	mapToDriverValue = String;
	getSQLType() {
		let type = "";
		if (this.precision !== void 0 && this.scale !== void 0) type += `decimal(${this.precision},${this.scale})`;
		else if (this.precision === void 0) type += "decimal";
		else type += `decimal(${this.precision})`;
		type = type === "decimal(10,0)" || type === "decimal(10)" ? "decimal" : type;
		return this.unsigned ? `${type} unsigned` : type;
	}
};
var MySqlDecimalBigIntBuilder = class extends require_mysql_core_columns_common.MySqlColumnBuilderWithAutoIncrement {
	static [__entity_ts.entityKind] = "MySqlDecimalBigIntBuilder";
	constructor(name, config) {
		super(name, config?.unsigned ? "bigint uint64" : "bigint int64", "MySqlDecimalBigInt");
		this.config.precision = config?.precision;
		this.config.scale = config?.scale;
		this.config.unsigned = config?.unsigned;
	}
	/** @internal */
	build(table) {
		return new MySqlDecimalBigInt(table, this.config);
	}
};
var MySqlDecimalBigInt = class extends require_mysql_core_columns_common.MySqlColumnWithAutoIncrement {
	static [__entity_ts.entityKind] = "MySqlDecimalBigInt";
	precision = this.config.precision;
	scale = this.config.scale;
	unsigned = this.config.unsigned;
	mapFromDriverValue = BigInt;
	mapToDriverValue = String;
	getSQLType() {
		let type = "";
		if (this.precision !== void 0 && this.scale !== void 0) type += `decimal(${this.precision},${this.scale})`;
		else if (this.precision === void 0) type += "decimal";
		else type += `decimal(${this.precision})`;
		type = type === "decimal(10,0)" || type === "decimal(10)" ? "decimal" : type;
		return this.unsigned ? `${type} unsigned` : type;
	}
};
function decimal(a, b = {}) {
	const { name, config } = (0, __utils_ts.getColumnNameAndConfig)(a, b);
	const mode = config?.mode;
	return mode === "number" ? new MySqlDecimalNumberBuilder(name, config) : mode === "bigint" ? new MySqlDecimalBigIntBuilder(name, config) : new MySqlDecimalBuilder(name, config);
}

//#endregion
exports.MySqlDecimal = MySqlDecimal;
exports.MySqlDecimalBigInt = MySqlDecimalBigInt;
exports.MySqlDecimalBigIntBuilder = MySqlDecimalBigIntBuilder;
exports.MySqlDecimalBuilder = MySqlDecimalBuilder;
exports.MySqlDecimalNumber = MySqlDecimalNumber;
exports.MySqlDecimalNumberBuilder = MySqlDecimalNumberBuilder;
exports.decimal = decimal;
//# sourceMappingURL=decimal.cjs.map