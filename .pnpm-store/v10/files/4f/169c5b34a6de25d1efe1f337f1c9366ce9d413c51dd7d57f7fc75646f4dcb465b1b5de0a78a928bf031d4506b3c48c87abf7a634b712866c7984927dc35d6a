const require_rolldown_runtime = require('../_virtual/rolldown_runtime.cjs');
const require_mysql_core_table = require('./table.cjs');
const require_mysql_core_view = require('./view.cjs');
let __entity_ts = require("../entity.cjs");

//#region src/mysql-core/schema.ts
var MySqlSchema = class {
	static [__entity_ts.entityKind] = "MySqlSchema";
	constructor(schemaName) {
		this.schemaName = schemaName;
	}
	table = (name, columns, extraConfig) => {
		return require_mysql_core_table.mysqlTableWithSchema(name, columns, extraConfig, this.schemaName);
	};
	view = ((name, columns) => {
		return require_mysql_core_view.mysqlViewWithSchema(name, columns, this.schemaName);
	});
};
/** @deprecated - use `instanceof MySqlSchema` */
function isMySqlSchema(obj) {
	return (0, __entity_ts.is)(obj, MySqlSchema);
}
/**
* Create a MySQL schema.
* https://dev.mysql.com/doc/refman/8.0/en/create-database.html
*
* @param name mysql use schema name
* @returns MySQL schema
*/
function mysqlDatabase(name) {
	return new MySqlSchema(name);
}
/**
* @see mysqlDatabase
*/
const mysqlSchema = mysqlDatabase;

//#endregion
exports.MySqlSchema = MySqlSchema;
exports.isMySqlSchema = isMySqlSchema;
exports.mysqlDatabase = mysqlDatabase;
exports.mysqlSchema = mysqlSchema;
//# sourceMappingURL=schema.cjs.map