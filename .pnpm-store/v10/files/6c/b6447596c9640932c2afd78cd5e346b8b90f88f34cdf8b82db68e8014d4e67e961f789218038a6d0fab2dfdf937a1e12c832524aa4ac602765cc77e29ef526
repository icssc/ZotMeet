const require_rolldown_runtime = require('../_virtual/rolldown_runtime.cjs');
const require_singlestore_core_columns_all = require('./columns/all.cjs');
let __entity_ts = require("../entity.cjs");
let __table_ts = require("../table.cjs");

//#region src/singlestore-core/table.ts
var SingleStoreTable = class extends __table_ts.Table {
	static [__entity_ts.entityKind] = "SingleStoreTable";
	/** @internal */
	static Symbol = Object.assign({}, __table_ts.Table.Symbol, {});
	/** @internal */
	[__table_ts.Table.Symbol.Columns];
	/** @internal */
	[__table_ts.Table.Symbol.ExtraConfigBuilder] = void 0;
};
function singlestoreTableWithSchema(name, columns, extraConfig, schema, baseName = name) {
	const rawTable = new SingleStoreTable(name, schema, baseName);
	const parsedColumns = typeof columns === "function" ? columns(require_singlestore_core_columns_all.getSingleStoreColumnBuilders()) : columns;
	const builtColumns = Object.fromEntries(Object.entries(parsedColumns).map(([name$1, colBuilderBase]) => {
		const colBuilder = colBuilderBase;
		colBuilder.setName(name$1);
		return [name$1, colBuilder.build(rawTable)];
	}));
	const table = Object.assign(rawTable, builtColumns);
	table[__table_ts.Table.Symbol.Columns] = builtColumns;
	table[__table_ts.Table.Symbol.ExtraConfigColumns] = builtColumns;
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
exports.SingleStoreTable = SingleStoreTable;
exports.singlestoreTable = singlestoreTable;
exports.singlestoreTableCreator = singlestoreTableCreator;
exports.singlestoreTableWithSchema = singlestoreTableWithSchema;
//# sourceMappingURL=table.cjs.map