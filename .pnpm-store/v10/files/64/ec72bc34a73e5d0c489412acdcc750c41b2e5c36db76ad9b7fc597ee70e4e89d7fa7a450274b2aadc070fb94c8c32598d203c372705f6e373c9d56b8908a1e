const require_rolldown_runtime = require('../_virtual/rolldown_runtime.cjs');
const require_gel_core_table = require('./table.cjs');
const require_gel_core_sequence = require('./sequence.cjs');
let __entity_ts = require("../entity.cjs");
let __sql_sql_ts = require("../sql/sql.cjs");

//#region src/gel-core/schema.ts
var GelSchema = class {
	static [__entity_ts.entityKind] = "GelSchema";
	constructor(schemaName) {
		this.schemaName = schemaName;
	}
	table = ((name, columns, extraConfig) => {
		return require_gel_core_table.gelTableWithSchema(name, columns, extraConfig, this.schemaName);
	});
	sequence = ((name, options) => {
		return require_gel_core_sequence.gelSequenceWithSchema(name, options, this.schemaName);
	});
	getSQL() {
		return new __sql_sql_ts.SQL([__sql_sql_ts.sql.identifier(this.schemaName)]);
	}
	shouldOmitSQLParens() {
		return true;
	}
};
function isGelSchema(obj) {
	return (0, __entity_ts.is)(obj, GelSchema);
}
function gelSchema(name) {
	if (name === "public") throw new Error(`You can't specify 'public' as schema name. Postgres is using public schema by default. If you want to use 'public' schema, just use GelTable() instead of creating a schema`);
	return new GelSchema(name);
}

//#endregion
exports.GelSchema = GelSchema;
exports.gelSchema = gelSchema;
exports.isGelSchema = isGelSchema;
//# sourceMappingURL=schema.cjs.map