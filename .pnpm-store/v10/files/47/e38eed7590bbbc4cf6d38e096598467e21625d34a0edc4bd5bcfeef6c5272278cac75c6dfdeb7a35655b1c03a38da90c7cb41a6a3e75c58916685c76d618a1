import { GelTable } from "./table.js";
import { entityKind } from "../entity.js";

//#region src/gel-core/primary-keys.ts
function primaryKey(...config) {
	if (config[0].columns) return new PrimaryKeyBuilder(config[0].columns, config[0].name);
	return new PrimaryKeyBuilder(config);
}
var PrimaryKeyBuilder = class {
	static [entityKind] = "GelPrimaryKeyBuilder";
	/** @internal */
	columns;
	/** @internal */
	name;
	constructor(columns, name) {
		this.columns = columns;
		this.name = name;
	}
	/** @internal */
	build(table) {
		return new PrimaryKey(table, this.columns, this.name);
	}
};
var PrimaryKey = class {
	static [entityKind] = "GelPrimaryKey";
	columns;
	name;
	constructor(table, columns, name) {
		this.table = table;
		this.columns = columns;
		this.name = name;
	}
	getName() {
		return this.name ?? `${this.table[GelTable.Symbol.Name]}_${this.columns.map((column) => column.name).join("_")}_pk`;
	}
};

//#endregion
export { PrimaryKey, PrimaryKeyBuilder, primaryKey };
//# sourceMappingURL=primary-keys.js.map