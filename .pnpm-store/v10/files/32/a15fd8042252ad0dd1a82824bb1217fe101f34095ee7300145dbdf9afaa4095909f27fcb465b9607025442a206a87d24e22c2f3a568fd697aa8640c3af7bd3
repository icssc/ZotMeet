import { gelTableWithSchema } from "./table.js";
import { gelSequenceWithSchema } from "./sequence.js";
import { entityKind, is } from "../entity.js";
import { SQL, sql } from "../sql/sql.js";

//#region src/gel-core/schema.ts
var GelSchema = class {
	static [entityKind] = "GelSchema";
	constructor(schemaName) {
		this.schemaName = schemaName;
	}
	table = ((name, columns, extraConfig) => {
		return gelTableWithSchema(name, columns, extraConfig, this.schemaName);
	});
	sequence = ((name, options) => {
		return gelSequenceWithSchema(name, options, this.schemaName);
	});
	getSQL() {
		return new SQL([sql.identifier(this.schemaName)]);
	}
	shouldOmitSQLParens() {
		return true;
	}
};
function isGelSchema(obj) {
	return is(obj, GelSchema);
}
function gelSchema(name) {
	if (name === "public") throw new Error(`You can't specify 'public' as schema name. Postgres is using public schema by default. If you want to use 'public' schema, just use GelTable() instead of creating a schema`);
	return new GelSchema(name);
}

//#endregion
export { GelSchema, gelSchema, isGelSchema };
//# sourceMappingURL=schema.js.map