const require_rolldown_runtime = require('../_virtual/rolldown_runtime.cjs');
const require_mysql_core_columns_all = require('./columns/all.cjs');
let __entity_ts = require("../entity.cjs");
let __table_ts = require("../table.cjs");

//#region src/mysql-core/table.ts
/** @internal */
const InlineForeignKeys = Symbol.for("drizzle:MySqlInlineForeignKeys");
var MySqlTable = class extends __table_ts.Table {
	static [__entity_ts.entityKind] = "MySqlTable";
	/** @internal */
	static Symbol = Object.assign({}, __table_ts.Table.Symbol, { InlineForeignKeys });
	/** @internal */
	[__table_ts.Table.Symbol.Columns];
	/** @internal */
	[InlineForeignKeys] = [];
	/** @internal */
	[__table_ts.Table.Symbol.ExtraConfigBuilder] = void 0;
};
function mysqlTableWithSchema(name, columns, extraConfig, schema, baseName = name) {
	const rawTable = new MySqlTable(name, schema, baseName);
	const parsedColumns = typeof columns === "function" ? columns(require_mysql_core_columns_all.getMySqlColumnBuilders()) : columns;
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
exports.InlineForeignKeys = InlineForeignKeys;
exports.MySqlTable = MySqlTable;
exports.mysqlTable = mysqlTable;
exports.mysqlTableCreator = mysqlTableCreator;
exports.mysqlTableWithSchema = mysqlTableWithSchema;
//# sourceMappingURL=table.cjs.map