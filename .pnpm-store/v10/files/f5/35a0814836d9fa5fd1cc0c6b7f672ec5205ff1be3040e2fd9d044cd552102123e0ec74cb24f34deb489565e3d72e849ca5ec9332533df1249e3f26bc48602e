import { getMsSqlColumnBuilders } from "./columns/all.js";
import { entityKind } from "../entity.js";
import { Table } from "../table.js";

//#region src/mssql-core/table.ts
/** @internal */
const InlineForeignKeys = Symbol.for("drizzle:MsSqlInlineForeignKeys");
var MsSqlTable = class extends Table {
	static [entityKind] = "MsSqlTable";
	/** @internal */
	static Symbol = Object.assign({}, Table.Symbol, { InlineForeignKeys });
	/** @internal */
	[Table.Symbol.Columns];
	/** @internal */
	[InlineForeignKeys] = [];
	/** @internal */
	[Table.Symbol.ExtraConfigBuilder] = void 0;
};
function mssqlTableWithSchema(name, columns, extraConfig, schema, baseName = name) {
	const rawTable = new MsSqlTable(name, schema, baseName);
	const parsedColumns = typeof columns === "function" ? columns(getMsSqlColumnBuilders()) : columns;
	const builtColumns = Object.fromEntries(Object.entries(parsedColumns).map(([name$1, colBuilderBase]) => {
		const colBuilder = colBuilderBase;
		colBuilder.setName(name$1);
		const column = colBuilder.build(rawTable);
		rawTable[InlineForeignKeys].push(...colBuilder.buildForeignKeys(column, rawTable));
		return [name$1, column];
	}));
	const table = Object.assign(rawTable, builtColumns);
	table[Table.Symbol.Columns] = builtColumns;
	table[Table.Symbol.ExtraConfigColumns] = builtColumns;
	if (extraConfig) table[MsSqlTable.Symbol.ExtraConfigBuilder] = extraConfig;
	return table;
}
const mssqlTable = (name, columns, extraConfig) => {
	return mssqlTableWithSchema(name, columns, extraConfig, void 0, name);
};
function mssqlTableCreator(customizeTableName) {
	return (name, columns, extraConfig) => {
		return mssqlTableWithSchema(customizeTableName(name), columns, extraConfig, void 0, name);
	};
}

//#endregion
export { InlineForeignKeys, MsSqlTable, mssqlTable, mssqlTableCreator, mssqlTableWithSchema };
//# sourceMappingURL=table.js.map