import { getCockroachColumnBuilders } from "./columns/all.js";
import { entityKind } from "../entity.js";
import { Table } from "../table.js";

//#region src/cockroach-core/table.ts
/** @internal */
const InlineForeignKeys = Symbol.for("drizzle:CockroachInlineForeignKeys");
/** @internal */
const EnableRLS = Symbol.for("drizzle:EnableRLS");
var CockroachTable = class extends Table {
	static [entityKind] = "CockroachTable";
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
function cockroachTableWithSchema(name, columns, extraConfig, schema, baseName = name) {
	const rawTable = new CockroachTable(name, schema, baseName);
	const parsedColumns = typeof columns === "function" ? columns(getCockroachColumnBuilders()) : columns;
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
	if (extraConfig) table[CockroachTable.Symbol.ExtraConfigBuilder] = extraConfig;
	return Object.assign(table, { enableRLS: () => {
		table[CockroachTable.Symbol.EnableRLS] = true;
		return table;
	} });
}
const cockroachTableInternal = (name, columns, extraConfig) => {
	return cockroachTableWithSchema(name, columns, extraConfig, void 0);
};
const cockroachTableWithRLS = (name, columns, extraConfig) => {
	const table = cockroachTableWithSchema(name, columns, extraConfig, void 0);
	table[EnableRLS] = true;
	return table;
};
const cockroachTable = Object.assign(cockroachTableInternal, { withRLS: cockroachTableWithRLS });
function cockroachTableCreator(customizeTableName) {
	const fn = (name, columns, extraConfig) => {
		return cockroachTableWithSchema(customizeTableName(name), columns, extraConfig, void 0, name);
	};
	return Object.assign(fn, { withRLS: ((name, columns, extraConfig) => {
		const table = cockroachTableWithSchema(customizeTableName(name), columns, extraConfig, void 0, name);
		table[EnableRLS] = true;
		return table;
	}) });
}

//#endregion
export { CockroachTable, EnableRLS, InlineForeignKeys, cockroachTable, cockroachTableCreator, cockroachTableWithSchema };
//# sourceMappingURL=table.js.map