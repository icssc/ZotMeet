const require_rolldown_runtime = require('../_virtual/rolldown_runtime.cjs');
let __entity_ts = require("../entity.cjs");
let __column_ts = require("../column.cjs");
let __utils_ts = require("../utils.cjs");
let __sql_sql_ts = require("../sql/sql.cjs");
let __logger_ts = require("../logger.cjs");
let __cache_core_index_ts = require("../cache/core/index.cjs");
let __mysql_core_session_ts = require("../mysql-core/session.cjs");

//#region src/tidb-serverless/session.ts
const executeRawConfig = { fullResult: true };
const queryConfig = { arrayMode: true };
var TiDBServerlessPreparedQuery = class extends __mysql_core_session_ts.MySqlPreparedQuery {
	static [__entity_ts.entityKind] = "TiDBPreparedQuery";
	constructor(client, queryString, params, logger, cache, queryMetadata, cacheConfig, fields, customResultMapper, generatedIds, returningIds, isRqbV2Query) {
		super(cache, queryMetadata, cacheConfig);
		this.client = client;
		this.queryString = queryString;
		this.params = params;
		this.logger = logger;
		this.fields = fields;
		this.customResultMapper = customResultMapper;
		this.generatedIds = generatedIds;
		this.returningIds = returningIds;
		this.isRqbV2Query = isRqbV2Query;
	}
	async execute(placeholderValues = {}) {
		if (this.isRqbV2Query) return this.executeRqbV2(placeholderValues);
		const params = (0, __sql_sql_ts.fillPlaceholders)(this.params, placeholderValues);
		this.logger.logQuery(this.queryString, params);
		const { fields, client, queryString, joinsNotNullableMap, customResultMapper, returningIds, generatedIds } = this;
		if (!fields && !customResultMapper) {
			const res = await this.queryWithCache(queryString, params, async () => {
				return await client.execute(queryString, params, executeRawConfig);
			});
			const insertId = res.lastInsertId ?? 0;
			const affectedRows = res.rowsAffected ?? 0;
			if (returningIds) {
				const returningResponse = [];
				let j = 0;
				for (let i = insertId; i < insertId + affectedRows; i++) {
					for (const column of returningIds) {
						const key = returningIds[0].path[0];
						if ((0, __entity_ts.is)(column.field, __column_ts.Column)) {
							if (column.field.primary && column.field.autoIncrement) returningResponse.push({ [key]: i });
							if (column.field.defaultFn && generatedIds) returningResponse.push({ [key]: generatedIds[j][key] });
						}
					}
					j++;
				}
				return returningResponse;
			}
			return res;
		}
		const rows = await this.queryWithCache(queryString, params, async () => {
			return await client.execute(queryString, params, queryConfig);
		});
		if (customResultMapper) return customResultMapper(rows);
		return rows.map((row) => (0, __utils_ts.mapResultRow)(fields, row, joinsNotNullableMap));
	}
	async executeRqbV2(placeholderValues = {}) {
		const params = (0, __sql_sql_ts.fillPlaceholders)(this.params, placeholderValues);
		this.logger.logQuery(this.queryString, params);
		const { client, queryString, customResultMapper, returningIds, generatedIds } = this;
		const res = await client.execute(queryString, params, executeRawConfig);
		const insertId = res.lastInsertId ?? 0;
		const affectedRows = res.rowsAffected ?? 0;
		if (returningIds) {
			const returningResponse = [];
			let j = 0;
			for (let i = insertId; i < insertId + affectedRows; i++) {
				for (const column of returningIds) {
					const key = returningIds[0].path[0];
					if ((0, __entity_ts.is)(column.field, __column_ts.Column)) {
						if (column.field.primary && column.field.autoIncrement) returningResponse.push({ [key]: i });
						if (column.field.defaultFn && generatedIds) returningResponse.push({ [key]: generatedIds[j][key] });
					}
				}
				j++;
			}
			return customResultMapper(returningResponse);
		}
		const { rows } = res;
		return customResultMapper(rows ?? []);
	}
	iterator(_placeholderValues) {
		throw new Error("Streaming is not supported by the TiDB Cloud Serverless driver");
	}
};
var TiDBServerlessSession = class TiDBServerlessSession extends __mysql_core_session_ts.MySqlSession {
	static [__entity_ts.entityKind] = "TiDBServerlessSession";
	logger;
	client;
	cache;
	constructor(baseClient, dialect, tx, relations, schema, options = {}) {
		super(dialect);
		this.baseClient = baseClient;
		this.relations = relations;
		this.schema = schema;
		this.options = options;
		this.client = tx ?? baseClient;
		this.logger = options.logger ?? new __logger_ts.NoopLogger();
		this.cache = options.cache ?? new __cache_core_index_ts.NoopCache();
	}
	prepareQuery(query, fields, customResultMapper, generatedIds, returningIds, queryMetadata, cacheConfig) {
		return new TiDBServerlessPreparedQuery(this.client, query.sql, query.params, this.logger, this.cache, queryMetadata, cacheConfig, fields, customResultMapper, generatedIds, returningIds);
	}
	prepareRelationalQuery(query, fields, customResultMapper, generatedIds, returningIds) {
		return new TiDBServerlessPreparedQuery(this.client, query.sql, query.params, this.logger, this.cache, void 0, void 0, fields, customResultMapper, generatedIds, returningIds, true);
	}
	all(query) {
		const querySql = this.dialect.sqlToQuery(query);
		this.logger.logQuery(querySql.sql, querySql.params);
		return this.client.execute(querySql.sql, querySql.params);
	}
	async count(sql$1) {
		const res = await this.execute(sql$1);
		return Number(res["rows"][0]["count"]);
	}
	async transaction(transaction) {
		const nativeTx = await this.baseClient.begin();
		try {
			const session = new TiDBServerlessSession(this.baseClient, this.dialect, nativeTx, this.relations, this.schema, this.options);
			const result = await transaction(new TiDBServerlessTransaction(this.dialect, session, this.relations, this.schema));
			await nativeTx.commit();
			return result;
		} catch (err) {
			await nativeTx.rollback();
			throw err;
		}
	}
};
var TiDBServerlessTransaction = class TiDBServerlessTransaction extends __mysql_core_session_ts.MySqlTransaction {
	static [__entity_ts.entityKind] = "TiDBServerlessTransaction";
	constructor(dialect, session, relations, schema, nestedIndex = 0) {
		super(dialect, session, relations, schema, nestedIndex, "default");
	}
	async transaction(transaction) {
		const savepointName = `sp${this.nestedIndex + 1}`;
		const tx = new TiDBServerlessTransaction(this.dialect, this.session, this.relations, this.schema, this.nestedIndex + 1);
		await tx.execute(__sql_sql_ts.sql.raw(`savepoint ${savepointName}`));
		try {
			const result = await transaction(tx);
			await tx.execute(__sql_sql_ts.sql.raw(`release savepoint ${savepointName}`));
			return result;
		} catch (err) {
			await tx.execute(__sql_sql_ts.sql.raw(`rollback to savepoint ${savepointName}`));
			throw err;
		}
	}
};

//#endregion
exports.TiDBServerlessPreparedQuery = TiDBServerlessPreparedQuery;
exports.TiDBServerlessSession = TiDBServerlessSession;
exports.TiDBServerlessTransaction = TiDBServerlessTransaction;
//# sourceMappingURL=session.cjs.map