import { getMySqlColumnBuilders } from "./columns/all.js";
import { entityKind } from "../entity.js";
import { Table } from "../table.js";

//#region src/mysql-core/table.ts
/** @internal */
const InlineForeignKeys = Symbol.for("drizzle:MySqlInlineForeignKeys");
var MySqlTable = class extends Table {
	static [entityKind] = "MySqlTable";
	/** @internal */
	static Symbol = Object.assign({}, Table.Symbol, { InlineForeignKeys });
	/** @internal */
	[Table.Symbol.Columns];
	/** @internal */
	[InlineForeignKeys] = [];
	/** @internal */
	[Table.Symbol.ExtraConfigBuilder] = void 0;
};
function mysqlTableWithSchema(name, columns, extraConfig, schema, baseName = name) {
	const rawTable = new MySqlTable(name, schema, baseName);
	const parsedColumns = typeof columns === "function" ? columns(getMySqlColumnBuilders()) : columns;
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
	if (extraConfig) table[MySqlTable.Symbol.ExtraConfigBuilder] = extraConfig;
	return table;
}
const mysqlTable = (name, columns, extraConfig) => {
	return mysqlTableWithSchema(name, columns, extraConfig, void 0, name);
};
function mysqlTableCreator(customizeTableName) {
	return (name, columns, extraConfig) => {
		return mysqlTableWithSchema(customizeTableName(name), columns, extraConfig, void 0, name);
	};
}

//#endregion
export { InlineForeignKeys, MySqlTable, mysqlTable, mysqlTableCreator, mysqlTableWithSchema };
//# sourceMappingURL=table.js.map