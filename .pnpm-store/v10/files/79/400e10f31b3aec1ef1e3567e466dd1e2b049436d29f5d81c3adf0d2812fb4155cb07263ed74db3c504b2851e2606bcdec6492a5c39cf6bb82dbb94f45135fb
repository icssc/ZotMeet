import { singlestoreTableWithSchema } from "./table.js";
import { entityKind, is } from "../entity.js";

//#region src/singlestore-core/schema.ts
var SingleStoreSchema = class {
	static [entityKind] = "SingleStoreSchema";
	constructor(schemaName) {
		this.schemaName = schemaName;
	}
	table = (name, columns, extraConfig) => {
		return singlestoreTableWithSchema(name, columns, extraConfig, this.schemaName);
	};
};
/** @deprecated - use `instanceof SingleStoreSchema` */
function isSingleStoreSchema(obj) {
	return is(obj, SingleStoreSchema);
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
export { SingleStoreSchema, isSingleStoreSchema, singlestoreDatabase, singlestoreSchema };
//# sourceMappingURL=schema.js.map