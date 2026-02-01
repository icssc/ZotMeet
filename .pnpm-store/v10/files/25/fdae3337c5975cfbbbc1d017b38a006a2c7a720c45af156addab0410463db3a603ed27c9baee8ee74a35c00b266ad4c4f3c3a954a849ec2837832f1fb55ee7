import { mysqlTableWithSchema } from "./table.js";
import { mysqlViewWithSchema } from "./view.js";
import { entityKind, is } from "../entity.js";

//#region src/mysql-core/schema.ts
var MySqlSchema = class {
	static [entityKind] = "MySqlSchema";
	constructor(schemaName) {
		this.schemaName = schemaName;
	}
	table = (name, columns, extraConfig) => {
		return mysqlTableWithSchema(name, columns, extraConfig, this.schemaName);
	};
	view = ((name, columns) => {
		return mysqlViewWithSchema(name, columns, this.schemaName);
	});
};
/** @deprecated - use `instanceof MySqlSchema` */
function isMySqlSchema(obj) {
	return is(obj, MySqlSchema);
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
export { MySqlSchema, isMySqlSchema, mysqlDatabase, mysqlSchema };
//# sourceMappingURL=schema.js.map