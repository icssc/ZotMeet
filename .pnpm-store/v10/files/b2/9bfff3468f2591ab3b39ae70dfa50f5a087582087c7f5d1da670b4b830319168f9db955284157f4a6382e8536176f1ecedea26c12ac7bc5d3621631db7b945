const require_rolldown_runtime = require('../_virtual/rolldown_runtime.cjs');
const require_mssql_core_table = require('./table.cjs');
const require_mssql_core_view = require('./view.cjs');
let __entity_ts = require("../entity.cjs");

//#region src/mssql-core/schema.ts
var MsSqlSchema = class {
	static [__entity_ts.entityKind] = "MsSqlSchema";
	isExisting = false;
	constructor(schemaName) {
		this.schemaName = schemaName;
	}
	table = (name, columns, extraConfig) => {
		return require_mssql_core_table.mssqlTableWithSchema(name, columns, extraConfig, this.schemaName);
	};
	view = ((name, columns) => {
		return require_mssql_core_view.mssqlViewWithSchema(name, columns, this.schemaName);
	});
	existing() {
		this.isExisting = true;
		return this;
	}
};
function mssqlSchema(name) {
	return new MsSqlSchema(name);
}

//#endregion
exports.MsSqlSchema = MsSqlSchema;
exports.mssqlSchema = mssqlSchema;
//# sourceMappingURL=schema.cjs.map