const require_rolldown_runtime = require('../_virtual/rolldown_runtime.cjs');
const require_mssql_core_columns_all = require('./columns/all.cjs');
let __entity_ts = require("../entity.cjs");
let __table_ts = require("../table.cjs");

//#region src/mssql-core/table.ts
/** @internal */
const InlineForeignKeys = Symbol.for("drizzle:MsSqlInlineForeignKeys");
var MsSqlTable = class extends __table_ts.Table {
	static [__entity_ts.entityKind] = "MsSqlTable";
	/** @internal */
	static Symbol = Object.assign({}, __table_ts.Table.Symbol, { InlineForeignKeys });
	/** @internal */
	[__table_ts.Table.Symbol.Columns];
	/** @internal */
	[InlineForeignKeys] = [];
	/** @internal */
	[__table_ts.Table.Symbol.ExtraConfigBuilder] = void 0;
};
function mssqlTableWithSchema(name, columns, extraConfig, schema, baseName = name) {
	const rawTable = new MsSqlTable(name, schema, baseName);
	const parsedColumns = typeof columns === "function" ? columns(require_mssql_core_columns_all.getMsSqlColumnBuilders()) : columns;
	const builtColumns = Object.fromEntries(Object.entries(parsedColumns).map(([name$1, colBuilderBase]) => {
		const colBuilder = colBuilderBase;
		colBuilder.setName(name$1);
		const column = colBuilder.build(rawTable);
		rawTable[InlineForeignKeys].push(...colBuilder.buildForeignKeys(column, rawTable));
		return [name$1, column];
	}));
	const table = Object.assign(rawTable, builtColumns);
	table[__table_ts.Table.Symbol.Columns] = builtColumns;
	table[__table_ts.Table.Symbol.ExtraConfigColumns] = builtColumns;
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
exports.InlineForeignKeys = InlineForeignKeys;
exports.MsSqlTable = MsSqlTable;
exports.mssqlTable = mssqlTable;
exports.mssqlTableCreator = mssqlTableCreator;
exports.mssqlTableWithSchema = mssqlTableWithSchema;
//# sourceMappingURL=table.cjs.map