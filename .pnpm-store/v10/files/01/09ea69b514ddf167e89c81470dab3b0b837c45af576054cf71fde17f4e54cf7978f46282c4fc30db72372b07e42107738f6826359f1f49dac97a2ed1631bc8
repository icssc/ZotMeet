const require_rolldown_runtime = require('../_virtual/rolldown_runtime.cjs');
let __entity_ts = require("../entity.cjs");
let __tracing_ts = require("../tracing.cjs");
let __utils_ts = require("../utils.cjs");
let __sql_sql_ts = require("../sql/sql.cjs");
let __logger_ts = require("../logger.cjs");
let __pg_core_async_session_ts = require("../pg-core/async/session.cjs");
let __cache_core_cache_ts = require("../cache/core/cache.cjs");

//#region src/pg-proxy/session.ts
var PgRemoteSession = class extends __pg_core_async_session_ts.PgAsyncSession {
	static [__entity_ts.entityKind] = "PgRemoteSession";
	logger;
	cache;
	constructor(client, dialect, relations, schema, options = {}) {
		super(dialect);
		this.client = client;
		this.relations = relations;
		this.schema = schema;
		this.logger = options.logger ?? new __logger_ts.NoopLogger();
		this.cache = options.cache ?? new __cache_core_cache_ts.NoopCache();
	}
	prepareQuery(query, fields, name, isResponseInArrayMode, customResultMapper, queryMetadata, cacheConfig) {
		return new PreparedQuery(this.client, query.sql, query.params, query.typings, this.logger, this.cache, queryMetadata, cacheConfig, fields, isResponseInArrayMode, customResultMapper);
	}
	prepareRelationalQuery(query, fields, name, customResultMapper) {
		return new PreparedQuery(this.client, query.sql, query.params, query.typings, this.logger, this.cache, void 0, void 0, fields, false, customResultMapper, true);
	}
	async transaction(_transaction, _config) {
		throw new Error("Transactions are not supported by the Postgres Proxy driver");
	}
};
var PgProxyTransaction = class extends __pg_core_async_session_ts.PgAsyncTransaction {
	static [__entity_ts.entityKind] = "PgProxyTransaction";
	async transaction(_transaction) {
		throw new Error("Transactions are not supported by the Postgres Proxy driver");
	}
};
var PreparedQuery = class extends __pg_core_async_session_ts.PgAsyncPreparedQuery {
	static [__entity_ts.entityKind] = "PgProxyPreparedQuery";
	constructor(client, queryString, params, typings, logger, cache, queryMetadata, cacheConfig, fields, _isResponseInArrayMode, customResultMapper, isRqbV2Query) {
		super({
			sql: queryString,
			params
		}, cache, queryMetadata, cacheConfig);
		this.client = client;
		this.queryString = queryString;
		this.params = params;
		this.typings = typings;
		this.logger = logger;
		this.fields = fields;
		this._isResponseInArrayMode = _isResponseInArrayMode;
		this.customResultMapper = customResultMapper;
		this.isRqbV2Query = isRqbV2Query;
	}
	async execute(placeholderValues = {}) {
		if (this.isRqbV2Query) return this.executeRqbV2(placeholderValues);
		return __tracing_ts.tracer.startActiveSpan("drizzle.execute", async (span) => {
			const params = (0, __sql_sql_ts.fillPlaceholders)(this.params, placeholderValues);
			const { fields, client, queryString, joinsNotNullableMap, customResultMapper, logger, typings } = this;
			span?.setAttributes({
				"drizzle.query.text": queryString,
				"drizzle.query.params": JSON.stringify(params)
			});
			logger.logQuery(queryString, params);
			if (!fields && !customResultMapper) return __tracing_ts.tracer.startActiveSpan("drizzle.driver.execute", async () => {
				const { rows: rows$1 } = await this.queryWithCache(queryString, params, async () => {
					return await client(queryString, params, "execute", typings);
				});
				return rows$1;
			});
			const rows = await __tracing_ts.tracer.startActiveSpan("drizzle.driver.execute", async () => {
				span?.setAttributes({
					"drizzle.query.text": queryString,
					"drizzle.query.params": JSON.stringify(params)
				});
				const { rows: rows$1 } = await this.queryWithCache(queryString, params, async () => {
					return await client(queryString, params, "all", typings);
				});
				return rows$1;
			});
			return __tracing_ts.tracer.startActiveSpan("drizzle.mapResponse", () => {
				return customResultMapper ? customResultMapper(rows) : rows.map((row) => (0, __utils_ts.mapResultRow)(fields, row, joinsNotNullableMap));
			});
		});
	}
	async executeRqbV2(placeholderValues = {}) {
		return __tracing_ts.tracer.startActiveSpan("drizzle.execute", async (span) => {
			const params = (0, __sql_sql_ts.fillPlaceholders)(this.params, placeholderValues);
			const { client, queryString, customResultMapper, logger, typings } = this;
			span?.setAttributes({
				"drizzle.query.text": queryString,
				"drizzle.query.params": JSON.stringify(params)
			});
			logger.logQuery(queryString, params);
			const rows = await __tracing_ts.tracer.startActiveSpan("drizzle.driver.execute", async () => {
				const { rows: rows$1 } = await client(queryString, params, "execute", typings);
				return rows$1;
			});
			return __tracing_ts.tracer.startActiveSpan("drizzle.mapResponse", () => {
				return customResultMapper(rows);
			});
		});
	}
	async all() {}
	/** @internal */
	isResponseInArrayMode() {
		return this._isResponseInArrayMode;
	}
};

//#endregion
exports.PgProxyTransaction = PgProxyTransaction;
exports.PgRemoteSession = PgRemoteSession;
exports.PreparedQuery = PreparedQuery;
//# sourceMappingURL=session.cjs.map