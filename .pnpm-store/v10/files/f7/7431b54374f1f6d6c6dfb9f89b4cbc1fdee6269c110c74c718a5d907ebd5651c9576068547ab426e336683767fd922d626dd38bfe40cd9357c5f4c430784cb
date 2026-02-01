import { EnableRLS, cockroachTableWithSchema } from "./table.js";
import { cockroachSequenceWithSchema } from "./sequence.js";
import { cockroachEnumObjectWithSchema, cockroachEnumWithSchema } from "./columns/enum.js";
import { cockroachMaterializedViewWithSchema, cockroachViewWithSchema } from "./view.js";
import { entityKind, is } from "../entity.js";
import { SQL, sql } from "../sql/sql.js";

//#region src/cockroach-core/schema.ts
var CockroachSchema = class {
	static [entityKind] = "CockroachSchema";
	isExisting = false;
	constructor(schemaName) {
		this.schemaName = schemaName;
		this.table = Object.assign(this.table, { withRLS: ((name, columns, extraConfig) => {
			const table = cockroachTableWithSchema(name, columns, extraConfig, this.schemaName);
			table[EnableRLS] = true;
			return table;
		}) });
	}
	table = ((name, columns, extraConfig) => {
		return cockroachTableWithSchema(name, columns, extraConfig, this.schemaName);
	});
	view = ((name, columns) => {
		return cockroachViewWithSchema(name, columns, this.schemaName);
	});
	materializedView = ((name, columns) => {
		return cockroachMaterializedViewWithSchema(name, columns, this.schemaName);
	});
	enum(enumName, input) {
		return Array.isArray(input) ? cockroachEnumWithSchema(enumName, [...input], this.schemaName) : cockroachEnumObjectWithSchema(enumName, input, this.schemaName);
	}
	sequence = ((name, options) => {
		return cockroachSequenceWithSchema(name, options, this.schemaName);
	});
	getSQL() {
		return new SQL([sql.identifier(this.schemaName)]);
	}
	shouldOmitSQLParens() {
		return true;
	}
	existing() {
		this.isExisting = true;
		return this;
	}
};
function isCockroachSchema(obj) {
	return is(obj, CockroachSchema);
}
function cockroachSchema(name) {
	if (name === "public") throw new Error(`You can't specify 'public' as schema name. Postgres is using public schema by default. If you want to use 'public' schema, just use cockroachTable() instead of creating a schema`);
	return new CockroachSchema(name);
}

//#endregion
export { CockroachSchema, cockroachSchema, isCockroachSchema };
//# sourceMappingURL=schema.js.map