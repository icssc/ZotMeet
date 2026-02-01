import { AwsDataApiSession } from "./session.js";
import { entityKind, is } from "../../entity.js";
import { Table } from "../../table.js";
import { Param, sql } from "../../sql/sql.js";
import * as V1 from "../../_relations.js";
import { DefaultLogger } from "../../logger.js";
import { PgAsyncDatabase } from "../../pg-core/async/db.js";
import { PgDialect } from "../../pg-core/dialect.js";
import { PgColumn } from "../../pg-core/index.js";
import { RDSDataClient } from "@aws-sdk/client-rds-data";

//#region src/aws-data-api/pg/driver.ts
var AwsDataApiPgDatabase = class extends PgAsyncDatabase {
	static [entityKind] = "AwsDataApiPgDatabase";
	execute(query) {
		return super.execute(query);
	}
};
var AwsPgDialect = class extends PgDialect {
	static [entityKind] = "AwsPgDialect";
	escapeParam(num) {
		return `:${num + 1}`;
	}
	buildInsertQuery({ table, values, onConflict, returning, select, withList }) {
		const columns = table[Table.Symbol.Columns];
		if (!select) for (const value of values) for (const fieldName of Object.keys(columns)) {
			const colValue = value[fieldName];
			const column = columns[fieldName];
			if (is(colValue, Param) && colValue.value !== void 0 && is(column, PgColumn) && column.dimensions && Array.isArray(colValue.value)) value[fieldName] = sql`cast(${colValue} as ${sql.raw(column.getSQLType())})`;
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
		const columns = table[Table.Symbol.Columns];
		for (const [colName, colValue] of Object.entries(set)) {
			const currentColumn = columns[colName];
			if (currentColumn && is(colValue, Param) && colValue.value !== void 0 && is(currentColumn, PgColumn) && currentColumn.dimensions && Array.isArray(colValue.value)) set[colName] = sql`cast(${colValue} as ${sql.raw(currentColumn.getSQLType())})`;
		}
		return super.buildUpdateSet(table, set);
	}
};
function construct(client, config) {
	const dialect = new AwsPgDialect({ casing: config.casing });
	let logger;
	if (config.logger === true) logger = new DefaultLogger();
	else if (config.logger !== false) logger = config.logger;
	let schema;
	if (config.schema) {
		const tablesConfig = V1.extractTablesRelationalConfig(config.schema, V1.createTableRelationsHelpers);
		schema = {
			fullSchema: config.schema,
			schema: tablesConfig.tables,
			tableNamesMap: tablesConfig.tableNamesMap
		};
	}
	const relations = config.relations ?? {};
	const db = new AwsDataApiPgDatabase(dialect, new AwsDataApiSession(client, dialect, relations, schema, {
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
	return construct(new RDSDataClient(rdsConfig), {
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
export { AwsDataApiPgDatabase, AwsPgDialect, drizzle };
//# sourceMappingURL=driver.js.map