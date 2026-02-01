const require_rolldown_runtime = require('../../_virtual/rolldown_runtime.cjs');
const require_mysql_core_columns_common = require('./common.cjs');
let __entity_ts = require("../../entity.cjs");
let __utils_ts = require("../../utils.cjs");

//#region src/mysql-core/columns/custom.ts
var MySqlCustomColumnBuilder = class extends require_mysql_core_columns_common.MySqlColumnBuilder {
	static [__entity_ts.entityKind] = "MySqlCustomColumnBuilder";
	constructor(name, fieldConfig, customTypeParams) {
		super(name, "custom", "MySqlCustomColumn");
		this.config.fieldConfig = fieldConfig;
		this.config.customTypeParams = customTypeParams;
	}
	/** @internal */
	build(table) {
		return new MySqlCustomColumn(table, this.config);
	}
};
var MySqlCustomColumn = class extends require_mysql_core_columns_common.MySqlColumn {
	static [__entity_ts.entityKind] = "MySqlCustomColumn";
	sqlName;
	mapTo;
	mapFrom;
	mapJson;
	forJsonSelect;
	constructor(table, config) {
		super(table, config);
		this.sqlName = config.customTypeParams.dataType(config.fieldConfig);
		this.mapTo = config.customTypeParams.toDriver;
		this.mapFrom = config.customTypeParams.fromDriver;
		this.mapJson = config.customTypeParams.fromJson;
		this.forJsonSelect = config.customTypeParams.forJsonSelect;
	}
	getSQLType() {
		return this.sqlName;
	}
	mapFromDriverValue(value) {
		return typeof this.mapFrom === "function" ? this.mapFrom(value) : value;
	}
	mapFromJsonValue(value) {
		return typeof this.mapJson === "function" ? this.mapJson(value) : this.mapFromDriverValue(value);
	}
	jsonSelectIdentifier(identifier, sql) {
		if (typeof this.forJsonSelect === "function") return this.forJsonSelect(identifier, sql);
		const rawType = this.getSQLType().toLowerCase();
		const parenPos = rawType.indexOf("(");
		switch (parenPos + 1 ? rawType.slice(0, parenPos) : rawType) {
			case "binary":
			case "varbinary": return sql`hex(${identifier})`;
			case "time":
			case "datetime":
			case "decimal":
			case "float":
			case "bigint": return sql`cast(${identifier} as char)`;
			default: return identifier;
		}
	}
	mapToDriverValue(value) {
		return typeof this.mapTo === "function" ? this.mapTo(value) : value;
	}
};
/**
* Custom mysql database data type generator
*/
function customType(customTypeParams) {
	return (a, b) => {
		const { name, config } = (0, __utils_ts.getColumnNameAndConfig)(a, b);
		return new MySqlCustomColumnBuilder(name, config, customTypeParams);
	};
}

//#endregion
exports.MySqlCustomColumn = MySqlCustomColumn;
exports.MySqlCustomColumnBuilder = MySqlCustomColumnBuilder;
exports.customType = customType;
//# sourceMappingURL=custom.cjs.map