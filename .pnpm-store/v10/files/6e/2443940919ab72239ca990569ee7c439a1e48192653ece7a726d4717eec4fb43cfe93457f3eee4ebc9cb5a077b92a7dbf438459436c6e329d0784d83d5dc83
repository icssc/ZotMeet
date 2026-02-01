import { getPgColumnBuilders } from "./columns/all.js";
import { entityKind } from "../entity.js";
import { Table } from "../table.js";

//#region src/pg-core/table.ts
/** @internal */
const InlineForeignKeys = Symbol.for("drizzle:PgInlineForeignKeys");
/** @internal */
const EnableRLS = Symbol.for("drizzle:EnableRLS");
var PgTable = class extends Table {
	static [entityKind] = "PgTable";
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
function pgTableWithSchema(name, columns, extraConfig, schema, baseName = name) {
	const rawTable = new PgTable(name, schema, baseName);
	const parsedColumns = typeof columns === "function" ? columns(getPgColumnBuilders()) : columns;
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
	if (extraConfig) table[PgTable.Symbol.ExtraConfigBuilder] = extraConfig;
	return Object.assign(table, { enableRLS: () => {
		table[PgTable.Symbol.EnableRLS] = true;
		return table;
	} });
}
const pgTableInternal = (name, columns, extraConfig) => {
	return pgTableWithSchema(name, columns, extraConfig, void 0);
};
const pgTableWithRLS = (name, columns, extraConfig) => {
	const table = pgTableWithSchema(name, columns, extraConfig, void 0);
	table[EnableRLS] = true;
	return table;
};
const pgTable = Object.assign(pgTableInternal, { withRLS: pgTableWithRLS });
function pgTableCreator(customizeTableName) {
	const fn = (name, columns, extraConfig) => {
		return pgTableWithSchema(customizeTableName(name), columns, extraConfig, void 0, name);
	};
	return Object.assign(fn, { withRLS: ((name, columns, extraConfig) => {
		const table = pgTableWithSchema(customizeTableName(name), columns, extraConfig, void 0, name);
		table[EnableRLS] = true;
		return table;
	}) });
}

//#endregion
export { EnableRLS, InlineForeignKeys, PgTable, pgTable, pgTableCreator, pgTableWithSchema };
//# sourceMappingURL=table.js.map