import { getSingleStoreColumnBuilders } from "./columns/all.js";
import { entityKind } from "../entity.js";
import { Table } from "../table.js";

//#region src/singlestore-core/table.ts
var SingleStoreTable = class extends Table {
	static [entityKind] = "SingleStoreTable";
	/** @internal */
	static Symbol = Object.assign({}, Table.Symbol, {});
	/** @internal */
	[Table.Symbol.Columns];
	/** @internal */
	[Table.Symbol.ExtraConfigBuilder] = void 0;
};
function singlestoreTableWithSchema(name, columns, extraConfig, schema, baseName = name) {
	const rawTable = new SingleStoreTable(name, schema, baseName);
	const parsedColumns = typeof columns === "function" ? columns(getSingleStoreColumnBuilders()) : columns;
	const builtColumns = Object.fromEntries(Object.entries(parsedColumns).map(([name$1, colBuilderBase]) => {
		const colBuilder = colBuilderBase;
		colBuilder.setName(name$1);
		return [name$1, colBuilder.build(rawTable)];
	}));
	const table = Object.assign(rawTable, builtColumns);
	table[Table.Symbol.Columns] = builtColumns;
	table[Table.Symbol.ExtraConfigColumns] = builtColumns;
	if (extraConfig) table[SingleStoreTable.Symbol.ExtraConfigBuilder] = extraConfig;
	return table;
}
const singlestoreTable = (name, columns, extraConfig) => {
	return singlestoreTableWithSchema(name, columns, extraConfig, void 0, name);
};
function singlestoreTableCreator(customizeTableName) {
	return (name, columns, extraConfig) => {
		return singlestoreTableWithSchema(customizeTableName(name), columns, extraConfig, void 0, name);
	};
}

//#endregion
export { SingleStoreTable, singlestoreTable, singlestoreTableCreator, singlestoreTableWithSchema };
//# sourceMappingURL=table.js.map