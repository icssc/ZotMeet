const require_rolldown_runtime = require('../../_virtual/rolldown_runtime.cjs');
let __entity_ts = require("../../entity.cjs");
let __column_ts = require("../../column.cjs");
let __utils_ts = require("../../utils.cjs");
let __sql_sql_ts = require("../../sql/sql.cjs");
let __logger_ts = require("../../logger.cjs");
let __cache_core_index_ts = require("../../cache/core/index.cjs");
let __mysql_core_session_ts = require("../../mysql-core/session.cjs");

//#region src/bun-sql/mysql/session.ts
var BunMySqlPreparedQuery = class extends __mysql_core_session_ts.MySqlPreparedQuery {
	static [__entity_ts.entityKind] = "BunMySqlPreparedQuery";
	constructor(client, query, params, logger, cache, queryMetadata, cacheConfig, fields, customResultMapper, generatedIds, returningIds, isRqbV2Query) {
		super(cache, queryMetadata, cacheConfig);
		this.client = client;
		this.query = query;
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
		const { fields, client, logger, params: rawParams, query, joinsNotNullableMap, customResultMapper, returningIds, generatedIds } = this;
		const params = (0, __sql_sql_ts.fillPlaceholders)(rawParams, placeholderValues);
		logger.logQuery(query, params);
		if (!fields && !customResultMapper) {
			const res = await this.queryWithCache(query, params, async () => {
				return await client.unsafe(query, params);
			});
			const insertId = res.lastInsertRowid;
			const affectedRows = res.affectedRows;
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
		const rows = await this.queryWithCache(query, params, async () => {
			return await client.unsafe(query, params).values();
		});
		if (customResultMapper) return customResultMapper(rows);
		return rows.map((row) => (0, __utils_ts.mapResultRow)(fields, row, joinsNotNullableMap));
	}
	async executeRqbV2(placeholderValues = {}) {
		const params = (0, __sql_sql_ts.fillPlaceholders)(this.params, placeholderValues);
		this.logger.logQuery(this.query, params);
		const { client, query, customResultMapper } = this;
		return customResultMapper(await client.unsafe(query, params));
	}
	async *iterator(placeholderValues = {}) {
		const { fields, params: queryParams, query, joinsNotNullableMap, client, customResultMapper } = this;
		const params = (0, __sql_sql_ts.fillPlaceholders)(queryParams, placeholderValues);
		const rows = await this.queryWithCache(query, params, async () => {
			return await client.unsafe(query, params).values();
		});
		const hasRowsMapper = Boolean(fields || customResultMapper);
		for (const row of rows) {
			if (row === void 0 || Array.isArray(row) && row.length === 0) break;
			if (hasRowsMapper) if (customResultMapper) {
				const mappedRow = customResultMapper([row]);
				yield Array.isArray(mappedRow) ? mappedRow[0] : mappedRow;
			} else yield (0, __utils_ts.mapResultRow)(fields, row, joinsNotNullableMap);
			else yield row;
		}
	}
};
var BunMySqlSession = class BunMySqlSession extends __mysql_core_session_ts.MySqlSession {
	static [__entity_ts.entityKind] = "BunMySqlSession";
	logger;
	mode;
	cache;
	constructor(client, dialect, relations, schema, options) {
		super(dialect);
		this.client = client;
		this.relations = relations;
		this.schema = schema;
		this.options = options;
		this.logger = options.logger ?? new __logger_ts.NoopLogger();
		this.cache = options.cache ?? new __cache_core_index_ts.NoopCache();
		this.mode = options.mode;
	}
	prepareQuery(query, fields, customResultMapper, generatedIds, returningIds, queryMetadata, cacheConfig) {
		return new BunMySqlPreparedQuery(this.client, query.sql, query.params, this.logger, this.cache, queryMetadata, cacheConfig, fields, customResultMapper, generatedIds, returningIds);
	}
	prepareRelationalQuery(query, fields, customResultMapper, generatedIds, returningIds) {
		return new BunMySqlPreparedQuery(this.client, query.sql, query.params, this.logger, this.cache, void 0, void 0, fields, customResultMapper, generatedIds, returningIds, true);
	}
	/** @internal */
	async query(query, params) {
		this.logger.logQuery(query, params);
		return await this.client.unsafe(query, params);
	}
	all(query) {
		const querySql = this.dialect.sqlToQuery(query);
		this.logger.logQuery(querySql.sql, querySql.params);
		return this.client.unsafe(querySql.sql, querySql.params);
	}
	async count(sql) {
		const query = this.dialect.sqlToQuery(sql);
		const count = (await this.client.unsafe(query.sql, query.params).values())[0][0];
		if (typeof count === "number") return count;
		return Number(count);
	}
	async transaction(transaction, config) {
		const startTransactionSql = config ? this.getStartTransactionSQL(config)?.inlineParams().toQuery(this.dialect).sql.slice(18) ?? "" : "";
		if (config?.isolationLevel) throw new Error("Driver doesn't support setting isolation level on transaction");
		return this.client.begin(startTransactionSql, async (client) => {
			const session = new BunMySqlSession(client, this.dialect, this.relations, this.schema, this.options);
			return transaction(new BunMySqlTransaction(this.dialect, session, this.relations, this.schema, 0, this.mode));
		});
	}
};
var BunMySqlTransaction = class BunMySqlTransaction extends __mysql_core_session_ts.MySqlTransaction {
	static [__entity_ts.entityKind] = "BunMySqlTransaction";
	async transaction(transaction) {
		return this.session.client.savepoint((client) => {
			const session = new BunMySqlSession(client, this.dialect, this.relations, this.schema, this.session.options);
			return transaction(new BunMySqlTransaction(this.dialect, session, this.relations, this.schema, this.nestedIndex + 1, this.mode));
		});
	}
};

//#endregion
exports.BunMySqlPreparedQuery = BunMySqlPreparedQuery;
exports.BunMySqlSession = BunMySqlSession;
exports.BunMySqlTransaction = BunMySqlTransaction;
//# sourceMappingURL=session.cjs.map