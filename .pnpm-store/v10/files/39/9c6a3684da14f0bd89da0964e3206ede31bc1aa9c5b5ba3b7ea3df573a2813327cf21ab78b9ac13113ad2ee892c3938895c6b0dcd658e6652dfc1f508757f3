const require_rolldown_runtime = require('../../_virtual/rolldown_runtime.cjs');
const require_gel_core_columns_common = require('./common.cjs');
let __entity_ts = require("../../entity.cjs");
let __utils_ts = require("../../utils.cjs");

//#region src/gel-core/columns/custom.ts
var GelCustomColumnBuilder = class extends require_gel_core_columns_common.GelColumnBuilder {
	static [__entity_ts.entityKind] = "GelCustomColumnBuilder";
	constructor(name, fieldConfig, customTypeParams) {
		super(name, "custom", "GelCustomColumn");
		this.config.fieldConfig = fieldConfig;
		this.config.customTypeParams = customTypeParams;
	}
	/** @internal */
	build(table) {
		return new GelCustomColumn(table, this.config);
	}
};
var GelCustomColumn = class extends require_gel_core_columns_common.GelColumn {
	static [__entity_ts.entityKind] = "GelCustomColumn";
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
	jsonSelectIdentifier(identifier, sql, arrayDimensions) {
		if (typeof this.forJsonSelect === "function") return this.forJsonSelect(identifier, sql, arrayDimensions);
		return identifier;
	}
	mapToDriverValue(value) {
		return typeof this.mapTo === "function" ? this.mapTo(value) : value;
	}
};
/**
* Custom gel database data type generator
*/
function customType(customTypeParams) {
	return (a, b) => {
		const { name, config } = (0, __utils_ts.getColumnNameAndConfig)(a, b);
		return new GelCustomColumnBuilder(name, config, customTypeParams);
	};
}

//#endregion
exports.GelCustomColumn = GelCustomColumn;
exports.GelCustomColumnBuilder = GelCustomColumnBuilder;
exports.customType = customType;
//# sourceMappingURL=custom.cjs.map