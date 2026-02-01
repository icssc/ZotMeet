const require_rolldown_runtime = require('../_virtual/rolldown_runtime.cjs');
const require_sqlite_core_columns_all = require('./columns/all.cjs');
let __entity_ts = require("../entity.cjs");
let __table_ts = require("../table.cjs");

//#region src/sqlite-core/table.ts
/** @internal */
const InlineForeignKeys = Symbol.for("drizzle:SQLiteInlineForeignKeys");
var SQLiteTable = class extends __table_ts.Table {
	static [__entity_ts.entityKind] = "SQLiteTable";
	/** @internal */
	static Symbol = Object.assign({}, __table_ts.Table.Symbol, { InlineForeignKeys });
	/** @internal */
	[__table_ts.Table.Symbol.Columns];
	/** @internal */
	[InlineForeignKeys] = [];
	/** @internal */
	[__table_ts.Table.Symbol.ExtraConfigBuilder] = void 0;
};
function sqliteTableBase(name, columns, extraConfig, schema, baseName = name) {
	const rawTable = new SQLiteTable(name, schema, baseName);
	const parsedColumns = typeof columns === "function" ? columns(require_sqlite_core_columns_all.getSQLiteColumnBuilders()) : columns;
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
	if (extraConfig) table[SQLiteTable.Symbol.ExtraConfigBuilder] = extraConfig;
	return table;
}
const sqliteTable = (name, columns, extraConfig) => {
	return sqliteTableBase(name, columns, extraConfig);
};
function sqliteTableCreator(customizeTableName) {
	return (name, columns, extraConfig) => {
		return sqliteTableBase(customizeTableName(name), columns, extraConfig, void 0, name);
	};
}

//#endregion
exports.InlineForeignKeys = InlineForeignKeys;
exports.SQLiteTable = SQLiteTable;
exports.sqliteTable = sqliteTable;
exports.sqliteTableCreator = sqliteTableCreator;
//# sourceMappingURL=table.cjs.map