import { mssqlTableWithSchema } from "./table.js";
import { mssqlViewWithSchema } from "./view.js";
import { entityKind } from "../entity.js";

//#region src/mssql-core/schema.ts
var MsSqlSchema = class {
	static [entityKind] = "MsSqlSchema";
	isExisting = false;
	constructor(schemaName) {
		this.schemaName = schemaName;
	}
	table = (name, columns, extraConfig) => {
		return mssqlTableWithSchema(name, columns, extraConfig, this.schemaName);
	};
	view = ((name, columns) => {
		return mssqlViewWithSchema(name, columns, this.schemaName);
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
export { MsSqlSchema, mssqlSchema };
//# sourceMappingURL=schema.js.map