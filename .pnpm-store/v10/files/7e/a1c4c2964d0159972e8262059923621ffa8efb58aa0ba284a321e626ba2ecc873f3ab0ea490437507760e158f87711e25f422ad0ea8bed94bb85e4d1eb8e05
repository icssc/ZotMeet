const require_rolldown_runtime = require('../_virtual/rolldown_runtime.cjs');
let __entity_ts = require("../entity.cjs");
let __column_ts = require("../column.cjs");
let __utils_ts = require("../utils.cjs");
let __sql_sql_ts = require("../sql/sql.cjs");
let __logger_ts = require("../logger.cjs");
let __cache_core_index_ts = require("../cache/core/index.cjs");
let __mysql_core_session_ts = require("../mysql-core/session.cjs");
let __mysql_core_index_ts = require("../mysql-core/index.cjs");

//#region src/mysql-proxy/session.ts
var MySqlRemoteSession = class extends __mysql_core_session_ts.MySqlSession {
	static [__entity_ts.entityKind] = "MySqlRemoteSession";
	logger;
	cache;
	constructor(client, dialect, relations, schema, options) {
		super(dialect);
		this.client = client;
		this.relations = relations;
		this.schema = schema;
		this.logger = options.logger ?? new __logger_ts.NoopLogger();
		this.cache = options.cache ?? new __cache_core_index_ts.NoopCache();
	}
	prepareQuery(query, fields, customResultMapper, generatedIds, returningIds, queryMetadata, cacheConfig) {
		return new PreparedQuery(this.client, query.sql, query.params, this.logger, this.cache, queryMetadata, cacheConfig, fields, customResultMapper, generatedIds, returningIds);
	}
	prepareRelationalQuery(query, fields, customResultMapper, generatedIds, returningIds) {
		return new PreparedQuery(this.client, query.sql, query.params, this.logger, this.cache, void 0, void 0, fields, customResultMapper, generatedIds, returningIds, true);
	}
	all(query) {
		const querySql = this.dialect.sqlToQuery(query);
		this.logger.logQuery(querySql.sql, querySql.params);
		return this.client(querySql.sql, querySql.params, "all").then(({ rows }) => rows);
	}
	async transaction(_transaction, _config) {
		throw new Error("Transactions are not supported by the MySql Proxy driver");
	}
};
var MySqlProxyTransaction = class extends __mysql_core_index_ts.MySqlTransaction {
	static [__entity_ts.entityKind] = "MySqlProxyTransaction";
	async transaction(_transaction) {
		throw new Error("Transactions are not supported by the MySql Proxy driver");
	}
};
var PreparedQuery = class extends __mysql_core_session_ts.MySqlPreparedQuery {
	static [__entity_ts.entityKind] = "MySqlProxyPreparedQuery";
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
		const { fields, client, queryString, logger, joinsNotNullableMap, customResultMapper, returningIds, generatedIds } = this;
		logger.logQuery(queryString, params);
		if (!fields && !customResultMapper) {
			const { rows: data } = await this.queryWithCache(queryString, params, async () => {
				return await client(queryString, params, "execute");
			});
			const insertId = data[0].insertId;
			const affectedRows = data[0].affectedRows;
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
			return data;
		}
		const { rows } = await this.queryWithCache(queryString, params, async () => {
			return await client(queryString, params, "all");
		});
		if (customResultMapper) return customResultMapper(rows);
		return rows.map((row) => (0, __utils_ts.mapResultRow)(fields, row, joinsNotNullableMap));
	}
	async executeRqbV2(placeholderValues = {}) {
		const params = (0, __sql_sql_ts.fillPlaceholders)(this.params, placeholderValues);
		const { client, queryString, logger, customResultMapper } = this;
		logger.logQuery(queryString, params);
		const { rows: res } = await client(queryString, params, "execute");
		const rows = res[0];
		return customResultMapper(rows);
	}
	iterator(_placeholderValues = {}) {
		throw new Error("Streaming is not supported by the MySql Proxy driver");
	}
};

//#endregion
exports.MySqlProxyTransaction = MySqlProxyTransaction;
exports.MySqlRemoteSession = MySqlRemoteSession;
exports.PreparedQuery = PreparedQuery;
//# sourceMappingURL=session.cjs.map