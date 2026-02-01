import { getGelColumnBuilders } from "./columns/all.js";
import { entityKind } from "../entity.js";
import { Table } from "../table.js";

//#region src/gel-core/table.ts
/** @internal */
const InlineForeignKeys = Symbol.for("drizzle:GelInlineForeignKeys");
/** @internal */
const EnableRLS = Symbol.for("drizzle:EnableRLS");
var GelTable = class extends Table {
	static [entityKind] = "GelTable";
	/** @internal */
	static Symbol = Object.assign({}, Table.Symbol, {
		InlineForeignKeys,
		EnableRLS
	});
	/**@internal */
	[InlineForeignKeys] = [];
	/** @internal */
	[EnableRLS] = false;
	/** @internal */
	[Table.Symbol.ExtraConfigBuilder] = void 0;
	/** @internal */
	[Table.Symbol.ExtraConfigColumns] = {};
};
/** @internal */
function gelTableWithSchema(name, columns, extraConfig, schema, baseName = name) {
	const rawTable = new GelTable(name, schema, baseName);
	const parsedColumns = typeof columns === "function" ? columns(getGelColumnBuilders()) : columns;
	const builtColumns = Object.fromEntries(Object.entries(parsedColumns).map(([name$1, colBuilderBase]) => {
		const colBuilder = colBuilderBase;
		colBuilder.setName(name$1);
		const column = colBuilder.build(rawTable);
		rawTable[InlineForeignKeys].push(...colBuilder.buildForeignKeys(column, rawTable));
		return [name$1, column];
	}));
	const builtColumnsForExtraConfig = Object.fromEntries(Object.entries(parsedColumns).map(([name$1, colBuilderBase]) => {
		const colBuilder = colBuilderBase;
		colBuilder.setName(name$1);
		return [name$1, colBuilder.buildExtraConfigColumn(rawTable)];
	}));
	const table = Object.assign(rawTable, builtColumns);
	table[Table.Symbol.Columns] = builtColumns;
	table[Table.Symbol.ExtraConfigColumns] = builtColumnsForExtraConfig;
	if (extraConfig) table[GelTable.Symbol.ExtraConfigBuilder] = extraConfig;
	return Object.assign(table, { enableRLS: () => {
		table[GelTable.Symbol.EnableRLS] = true;
		return table;
	} });
}
const gelTable = (name, columns, extraConfig) => {
	return gelTableWithSchema(name, columns, extraConfig, void 0);
};
function gelTableCreator(customizeTableName) {
	return (name, columns, extraConfig) => {
		return gelTableWithSchema(customizeTableName(name), columns, extraConfig, void 0, name);
	};
}

//#endregion
export { EnableRLS, GelTable, InlineForeignKeys, gelTable, gelTableCreator, gelTableWithSchema };
//# sourceMappingURL=table.js.map