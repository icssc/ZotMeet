const require_rolldown_runtime = require('../_virtual/rolldown_runtime.cjs');
const require_singlestore_core_table = require('./table.cjs');
let __entity_ts = require("../entity.cjs");

//#region src/singlestore-core/schema.ts
var SingleStoreSchema = class {
	static [__entity_ts.entityKind] = "SingleStoreSchema";
	constructor(schemaName) {
		this.schemaName = schemaName;
	}
	table = (name, columns, extraConfig) => {
		return require_singlestore_core_table.singlestoreTableWithSchema(name, columns, extraConfig, this.schemaName);
	};
};
/** @deprecated - use `instanceof SingleStoreSchema` */
function isSingleStoreSchema(obj) {
	return (0, __entity_ts.is)(obj, SingleStoreSchema);
}
/**
* Create a SingleStore schema.
* https://docs.singlestore.com/cloud/create-a-database/
*
* @param name singlestore use schema name
* @returns SingleStore schema
*/
function singlestoreDatabase(name) {
	return new SingleStoreSchema(name);
}
/**
* @see singlestoreDatabase
*/
const singlestoreSchema = singlestoreDatabase;

//#endregion
exports.SingleStoreSchema = SingleStoreSchema;
exports.isSingleStoreSchema = isSingleStoreSchema;
exports.singlestoreDatabase = singlestoreDatabase;
exports.singlestoreSchema = singlestoreSchema;
//# sourceMappingURL=schema.cjs.map