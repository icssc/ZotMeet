const require_rolldown_runtime = require('../../_virtual/rolldown_runtime.cjs');
const require_aws_data_api_pg_session = require('./session.cjs');
let __entity_ts = require("../../entity.cjs");
let __table_ts = require("../../table.cjs");
let __sql_sql_ts = require("../../sql/sql.cjs");
let ___relations_ts = require("../../_relations.cjs");
___relations_ts = require_rolldown_runtime.__toESM(___relations_ts);
let __logger_ts = require("../../logger.cjs");
let __pg_core_async_db_ts = require("../../pg-core/async/db.cjs");
let __pg_core_dialect_ts = require("../../pg-core/dialect.cjs");
let __pg_core_index_ts = require("../../pg-core/index.cjs");
let _aws_sdk_client_rds_data = require("@aws-sdk/client-rds-data");

//#region src/aws-data-api/pg/driver.ts
var AwsDataApiPgDatabase = class extends __pg_core_async_db_ts.PgAsyncDatabase {
	static [__entity_ts.entityKind] = "AwsDataApiPgDatabase";
	execute(query) {
		return super.execute(query);
	}
};
var AwsPgDialect = class extends __pg_core_dialect_ts.PgDialect {
	static [__entity_ts.entityKind] = "AwsPgDialect";
	escapeParam(num) {
		return `:${num + 1}`;
	}
	buildInsertQuery({ table, values, onConflict, returning, select, withList }) {
		const columns = table[__table_ts.Table.Symbol.Columns];
		if (!select) for (const value of values) for (const fieldName of Object.keys(columns)) {
			const colValue = value[fieldName];
			const column = columns[fieldName];
			if ((0, __entity_ts.is)(colValue, __sql_sql_ts.Param) && colValue.value !== void 0 && (0, __entity_ts.is)(column, __pg_core_index_ts.PgColumn) && column.dimensions && Array.isArray(colValue.value)) value[fieldName] = __sql_sql_ts.sql`cast(${colValue} as ${__sql_sql_ts.sql.raw(column.getSQLType())})`;
		}
		return super.buildInsertQuery({
			table,
			values,
			onConflict,
			returning,
			withList
		});
	}
	buildUpdateSet(table, set) {
		const columns = table[__table_ts.Table.Symbol.Columns];
		for (const [colName, colValue] of Object.entries(set)) {
			const currentColumn = columns[colName];
			if (currentColumn && (0, __entity_ts.is)(colValue, __sql_sql_ts.Param) && colValue.value !== void 0 && (0, __entity_ts.is)(currentColumn, __pg_core_index_ts.PgColumn) && currentColumn.dimensions && Array.isArray(colValue.value)) set[colName] = __sql_sql_ts.sql`cast(${colValue} as ${__sql_sql_ts.sql.raw(currentColumn.getSQLType())})`;
		}
		return super.buildUpdateSet(table, set);
	}
};
function construct(client, config) {
	const dialect = new AwsPgDialect({ casing: config.casing });
	let logger;
	if (config.logger === true) logger = new __logger_ts.DefaultLogger();
	else if (config.logger !== false) logger = config.logger;
	let schema;
	if (config.schema) {
		const tablesConfig = ___relations_ts.extractTablesRelationalConfig(config.schema, ___relations_ts.createTableRelationsHelpers);
		schema = {
			fullSchema: config.schema,
			schema: tablesConfig.tables,
			tableNamesMap: tablesConfig.tableNamesMap
		};
	}
	const relations = config.relations ?? {};
	const db = new AwsDataApiPgDatabase(dialect, new require_aws_data_api_pg_session.AwsDataApiSession(client, dialect, relations, schema, {
		...config,
		logger,
		cache: config.cache
	}, void 0), relations, schema, true);
	db.$client = client;
	db.$cache = config.cache;
	if (db.$cache) db.$cache["invalidate"] = config.cache?.onMutate;
	return db;
}
function drizzle(...params) {
	if (params[0].client) {
		const { client, ...drizzleConfig$1 } = params[0];
		return construct(client, drizzleConfig$1);
	}
	const { connection, ...drizzleConfig } = params[0];
	const { resourceArn, database, secretArn, ...rdsConfig } = connection;
	return construct(new _aws_sdk_client_rds_data.RDSDataClient(rdsConfig), {
		resourceArn,
		database,
		secretArn,
		...drizzleConfig
	});
}
(function(_drizzle) {
	function mock(config) {
		return construct({}, config);
	}
	_drizzle.mock = mock;
})(drizzle || (drizzle = {}));

//#endregion
exports.AwsDataApiPgDatabase = AwsDataApiPgDatabase;
exports.AwsPgDialect = AwsPgDialect;
Object.defineProperty(exports, 'drizzle', {
  enumerable: true,
  get: function () {
    return drizzle;
  }
});
//# sourceMappingURL=driver.cjs.map