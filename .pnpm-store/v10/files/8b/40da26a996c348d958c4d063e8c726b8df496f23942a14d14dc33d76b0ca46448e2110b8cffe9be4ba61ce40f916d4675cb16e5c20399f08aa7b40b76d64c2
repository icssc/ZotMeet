const require_rolldown_runtime = require('../_virtual/rolldown_runtime.cjs');
let __entity_ts = require("../entity.cjs");
let __utils_ts = require("../utils.cjs");
let __sql_sql_ts = require("../sql/sql.cjs");
let __logger_ts = require("../logger.cjs");
let __pg_core_async_session_ts = require("../pg-core/async/session.cjs");
let __cache_core_cache_ts = require("../cache/core/cache.cjs");
let _electric_sql_pglite = require("@electric-sql/pglite");

//#region src/pglite/session.ts
var PglitePreparedQuery = class extends __pg_core_async_session_ts.PgAsyncPreparedQuery {
	static [__entity_ts.entityKind] = "PglitePreparedQuery";
	rawQueryConfig;
	queryConfig;
	constructor(client, queryString, params, logger, cache, queryMetadata, cacheConfig, fields, name, _isResponseInArrayMode, customResultMapper, isRqbV2Query) {
		super({
			sql: queryString,
			params
		}, cache, queryMetadata, cacheConfig);
		this.client = client;
		this.queryString = queryString;
		this.params = params;
		this.logger = logger;
		this.fields = fields;
		this._isResponseInArrayMode = _isResponseInArrayMode;
		this.customResultMapper = customResultMapper;
		this.isRqbV2Query = isRqbV2Query;
		this.rawQueryConfig = {
			rowMode: "object",
			parsers: {
				[_electric_sql_pglite.types.TIMESTAMP]: (value) => value,
				[_electric_sql_pglite.types.TIMESTAMPTZ]: (value) => value,
				[_electric_sql_pglite.types.INTERVAL]: (value) => value,
				[_electric_sql_pglite.types.DATE]: (value) => value,
				[1231]: (value) => value,
				[1115]: (value) => value,
				[1185]: (value) => value,
				[1187]: (value) => value,
				[1182]: (value) => value
			}
		};
		this.queryConfig = {
			rowMode: "array",
			parsers: {
				[_electric_sql_pglite.types.TIMESTAMP]: (value) => value,
				[_electric_sql_pglite.types.TIMESTAMPTZ]: (value) => value,
				[_electric_sql_pglite.types.INTERVAL]: (value) => value,
				[_electric_sql_pglite.types.DATE]: (value) => value,
				[1231]: (value) => value,
				[1115]: (value) => value,
				[1185]: (value) => value,
				[1187]: (value) => value,
				[1182]: (value) => value
			}
		};
	}
	async execute(placeholderValues = {}) {
		if (this.isRqbV2Query) return this.executeRqbV2(placeholderValues);
		const params = (0, __sql_sql_ts.fillPlaceholders)(this.params, placeholderValues);
		this.logger.logQuery(this.queryString, params);
		const { fields, client, queryConfig, joinsNotNullableMap, customResultMapper, queryString, rawQueryConfig } = this;
		if (!fields && !customResultMapper) return this.queryWithCache(queryString, params, async () => {
			return await client.query(queryString, params, rawQueryConfig);
		});
		const result = await this.queryWithCache(queryString, params, async () => {
			return await client.query(queryString, params, queryConfig);
		});
		return customResultMapper ? customResultMapper(result.rows) : result.rows.map((row) => (0, __utils_ts.mapResultRow)(fields, row, joinsNotNullableMap));
	}
	async executeRqbV2(placeholderValues = {}) {
		const params = (0, __sql_sql_ts.fillPlaceholders)(this.params, placeholderValues);
		this.logger.logQuery(this.queryString, params);
		const { rawQueryConfig, client, customResultMapper, queryString } = this;
		return customResultMapper((await client.query(queryString, params, rawQueryConfig)).rows);
	}
	all(placeholderValues = {}) {
		const params = (0, __sql_sql_ts.fillPlaceholders)(this.params, placeholderValues);
		this.logger.logQuery(this.queryString, params);
		return this.queryWithCache(this.queryString, params, async () => {
			return await this.client.query(this.queryString, params, this.rawQueryConfig);
		}).then((result) => result.rows);
	}
	/** @internal */
	isResponseInArrayMode() {
		return this._isResponseInArrayMode;
	}
};
var PgliteSession = class PgliteSession extends __pg_core_async_session_ts.PgAsyncSession {
	static [__entity_ts.entityKind] = "PgliteSession";
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
		return new PglitePreparedQuery(this.client, query.sql, query.params, this.logger, this.cache, queryMetadata, cacheConfig, fields, name, isResponseInArrayMode, customResultMapper);
	}
	prepareRelationalQuery(query, fields, name, customResultMapper) {
		return new PglitePreparedQuery(this.client, query.sql, query.params, this.logger, this.cache, void 0, void 0, fields, name, false, customResultMapper, true);
	}
	async transaction(transaction, config) {
		return this.client.transaction(async (client) => {
			const session = new PgliteSession(client, this.dialect, this.relations, this.schema, this.options);
			const tx = new PgliteTransaction(this.dialect, session, this.relations, this.schema);
			if (config) await tx.setTransaction(config);
			return transaction(tx);
		});
	}
};
var PgliteTransaction = class PgliteTransaction extends __pg_core_async_session_ts.PgAsyncTransaction {
	static [__entity_ts.entityKind] = "PgliteTransaction";
	async transaction(transaction) {
		const savepointName = `sp${this.nestedIndex + 1}`;
		const tx = new PgliteTransaction(this.dialect, this.session, this.relations, this.schema, this.nestedIndex + 1);
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
exports.PglitePreparedQuery = PglitePreparedQuery;
exports.PgliteSession = PgliteSession;
exports.PgliteTransaction = PgliteTransaction;
//# sourceMappingURL=session.cjs.map