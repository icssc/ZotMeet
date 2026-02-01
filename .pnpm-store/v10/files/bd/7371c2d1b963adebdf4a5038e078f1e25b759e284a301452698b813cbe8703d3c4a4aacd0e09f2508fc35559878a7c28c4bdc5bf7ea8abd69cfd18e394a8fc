const require_rolldown_runtime = require('../_virtual/rolldown_runtime.cjs');
let __entity_ts = require("../entity.cjs");
let __utils_ts = require("../utils.cjs");
let __sql_sql_ts = require("../sql/sql.cjs");
let __logger_ts = require("../logger.cjs");
let __pg_core_async_session_ts = require("../pg-core/async/session.cjs");
let __cache_core_cache_ts = require("../cache/core/cache.cjs");
let _neondatabase_serverless = require("@neondatabase/serverless");

//#region src/neon-serverless/session.ts
var NeonPreparedQuery = class extends __pg_core_async_session_ts.PgAsyncPreparedQuery {
	static [__entity_ts.entityKind] = "NeonPreparedQuery";
	rawQueryConfig;
	queryConfig;
	constructor(client, queryString, params, logger, cache, queryMetadata, cacheConfig, fields, name, _isResponseInArrayMode, customResultMapper, isRqbV2Query) {
		super({
			sql: queryString,
			params
		}, cache, queryMetadata, cacheConfig);
		this.client = client;
		this.params = params;
		this.logger = logger;
		this.fields = fields;
		this._isResponseInArrayMode = _isResponseInArrayMode;
		this.customResultMapper = customResultMapper;
		this.isRqbV2Query = isRqbV2Query;
		this.rawQueryConfig = {
			name,
			text: queryString,
			types: { getTypeParser: (typeId, format) => {
				if (typeId === _neondatabase_serverless.types.builtins.TIMESTAMPTZ) return (val) => val;
				if (typeId === _neondatabase_serverless.types.builtins.TIMESTAMP) return (val) => val;
				if (typeId === _neondatabase_serverless.types.builtins.DATE) return (val) => val;
				if (typeId === _neondatabase_serverless.types.builtins.INTERVAL) return (val) => val;
				if (typeId === 1231) return (val) => val;
				if (typeId === 1115) return (val) => val;
				if (typeId === 1185) return (val) => val;
				if (typeId === 1187) return (val) => val;
				if (typeId === 1182) return (val) => val;
				return _neondatabase_serverless.types.getTypeParser(typeId, format);
			} }
		};
		this.queryConfig = {
			name,
			text: queryString,
			rowMode: "array",
			types: { getTypeParser: (typeId, format) => {
				if (typeId === _neondatabase_serverless.types.builtins.TIMESTAMPTZ) return (val) => val;
				if (typeId === _neondatabase_serverless.types.builtins.TIMESTAMP) return (val) => val;
				if (typeId === _neondatabase_serverless.types.builtins.DATE) return (val) => val;
				if (typeId === _neondatabase_serverless.types.builtins.INTERVAL) return (val) => val;
				if (typeId === 1231) return (val) => val;
				if (typeId === 1115) return (val) => val;
				if (typeId === 1185) return (val) => val;
				if (typeId === 1187) return (val) => val;
				if (typeId === 1182) return (val) => val;
				return _neondatabase_serverless.types.getTypeParser(typeId, format);
			} }
		};
	}
	async execute(placeholderValues = {}) {
		if (this.isRqbV2Query) return this.executeRqbV2(placeholderValues);
		const params = (0, __sql_sql_ts.fillPlaceholders)(this.params, placeholderValues);
		this.logger.logQuery(this.rawQueryConfig.text, params);
		const { fields, client, rawQueryConfig: rawQuery, queryConfig: query, joinsNotNullableMap, customResultMapper } = this;
		if (!fields && !customResultMapper) return await this.queryWithCache(rawQuery.text, params, async () => {
			return await client.query(rawQuery, params);
		});
		const result = await this.queryWithCache(query.text, params, async () => {
			return await client.query(query, params);
		});
		return customResultMapper ? customResultMapper(result.rows) : result.rows.map((row) => (0, __utils_ts.mapResultRow)(fields, row, joinsNotNullableMap));
	}
	async executeRqbV2(placeholderValues = {}) {
		const params = (0, __sql_sql_ts.fillPlaceholders)(this.params, placeholderValues);
		this.logger.logQuery(this.rawQueryConfig.text, params);
		const { client, rawQueryConfig: rawQuery, customResultMapper } = this;
		return customResultMapper((await client.query(rawQuery, params)).rows);
	}
	all(placeholderValues = {}) {
		const params = (0, __sql_sql_ts.fillPlaceholders)(this.params, placeholderValues);
		this.logger.logQuery(this.rawQueryConfig.text, params);
		return this.queryWithCache(this.rawQueryConfig.text, params, async () => {
			return await this.client.query(this.rawQueryConfig, params);
		}).then((result) => result.rows);
	}
	values(placeholderValues = {}) {
		const params = (0, __sql_sql_ts.fillPlaceholders)(this.params, placeholderValues);
		this.logger.logQuery(this.rawQueryConfig.text, params);
		return this.queryWithCache(this.queryConfig.text, params, async () => {
			return await this.client.query(this.queryConfig, params);
		}).then((result) => result.rows);
	}
	/** @internal */
	isResponseInArrayMode() {
		return this._isResponseInArrayMode;
	}
};
var NeonSession = class NeonSession extends __pg_core_async_session_ts.PgAsyncSession {
	static [__entity_ts.entityKind] = "NeonSession";
	logger;
	cache;
	constructor(client, dialect, relations, schema, options = {}) {
		super(dialect);
		this.client = client;
		this.relations = relations;
		this.schema = schema;
		this.options = options;
		this.logger = options.logger ?? new __logger_ts.NoopLogger();
		this.cache = options.cache ?? new __cache_core_cache_ts.NoopCache();
	}
	prepareQuery(query, fields, name, isResponseInArrayMode, customResultMapper, queryMetadata, cacheConfig) {
		return new NeonPreparedQuery(this.client, query.sql, query.params, this.logger, this.cache, queryMetadata, cacheConfig, fields, name, isResponseInArrayMode, customResultMapper);
	}
	prepareRelationalQuery(query, fields, name, customResultMapper) {
		return new NeonPreparedQuery(this.client, query.sql, query.params, this.logger, this.cache, void 0, void 0, fields, name, false, customResultMapper, true);
	}
	async query(query, params) {
		this.logger.logQuery(query, params);
		return await this.client.query({
			rowMode: "array",
			text: query,
			values: params
		});
	}
	async queryObjects(query, params) {
		return this.client.query(query, params);
	}
	async transaction(transaction, config = {}) {
		const session = this.client instanceof _neondatabase_serverless.Pool ? new NeonSession(await this.client.connect(), this.dialect, this.relations, this.schema, this.options) : this;
		const tx = new NeonTransaction(this.dialect, session, this.relations, this.schema);
		await tx.execute(__sql_sql_ts.sql`begin ${tx.getTransactionConfigSQL(config)}`);
		try {
			const result = await transaction(tx);
			await tx.execute(__sql_sql_ts.sql`commit`);
			return result;
		} catch (error) {
			await tx.execute(__sql_sql_ts.sql`rollback`);
			throw error;
		} finally {
			if (this.client instanceof _neondatabase_serverless.Pool) session.client.release();
		}
	}
};
var NeonTransaction = class NeonTransaction extends __pg_core_async_session_ts.PgAsyncTransaction {
	static [__entity_ts.entityKind] = "NeonTransaction";
	async transaction(transaction) {
		const savepointName = `sp${this.nestedIndex + 1}`;
		const tx = new NeonTransaction(this.dialect, this.session, this.relations, this.schema, this.nestedIndex + 1);
		await tx.execute(__sql_sql_ts.sql.raw(`savepoint ${savepointName}`));
		try {
			const result = await transaction(tx);
			await tx.execute(__sql_sql_ts.sql.raw(`release savepoint ${savepointName}`));
			return result;
		} catch (e) {
			await tx.execute(__sql_sql_ts.sql.raw(`rollback to savepoint ${savepointName}`));
			throw e;
		}
	}
};

//#endregion
exports.NeonPreparedQuery = NeonPreparedQuery;
exports.NeonSession = NeonSession;
exports.NeonTransaction = NeonTransaction;
//# sourceMappingURL=session.cjs.map