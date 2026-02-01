const require_rolldown_runtime = require('../_virtual/rolldown_runtime.cjs');
let __entity_ts = require("../entity.cjs");
let __tracing_ts = require("../tracing.cjs");
let __utils_ts = require("../utils.cjs");
let __sql_sql_ts = require("../sql/sql.cjs");
let __logger_ts = require("../logger.cjs");
let __cache_core_index_ts = require("../cache/core/index.cjs");
let __pg_core_async_session_ts = require("../pg-core/async/session.cjs");

//#region src/postgres-js/session.ts
var PostgresJsPreparedQuery = class extends __pg_core_async_session_ts.PgAsyncPreparedQuery {
	static [__entity_ts.entityKind] = "PostgresJsPreparedQuery";
	constructor(client, queryString, params, logger, cache, queryMetadata, cacheConfig, fields, _isResponseInArrayMode, customResultMapper, isRqbV2Query) {
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
	}
	async execute(placeholderValues = {}) {
		if (this.isRqbV2Query) return this.executeRqbV2(placeholderValues);
		return __tracing_ts.tracer.startActiveSpan("drizzle.execute", async (span) => {
			const params = (0, __sql_sql_ts.fillPlaceholders)(this.params, placeholderValues);
			span?.setAttributes({
				"drizzle.query.text": this.queryString,
				"drizzle.query.params": JSON.stringify(params)
			});
			this.logger.logQuery(this.queryString, params);
			const { fields, queryString: query, client, joinsNotNullableMap, customResultMapper } = this;
			if (!fields && !customResultMapper) return __tracing_ts.tracer.startActiveSpan("drizzle.driver.execute", () => {
				return this.queryWithCache(query, params, async () => {
					return await client.unsafe(query, params);
				});
			});
			const rows = await __tracing_ts.tracer.startActiveSpan("drizzle.driver.execute", () => {
				span?.setAttributes({
					"drizzle.query.text": query,
					"drizzle.query.params": JSON.stringify(params)
				});
				return this.queryWithCache(query, params, async () => {
					return await client.unsafe(query, params).values();
				});
			});
			return __tracing_ts.tracer.startActiveSpan("drizzle.mapResponse", () => {
				return customResultMapper ? customResultMapper(rows) : rows.map((row) => (0, __utils_ts.mapResultRow)(fields, row, joinsNotNullableMap));
			});
		});
	}
	async executeRqbV2(placeholderValues = {}) {
		return __tracing_ts.tracer.startActiveSpan("drizzle.execute", async (span) => {
			const params = (0, __sql_sql_ts.fillPlaceholders)(this.params, placeholderValues);
			span?.setAttributes({
				"drizzle.query.text": this.queryString,
				"drizzle.query.params": JSON.stringify(params)
			});
			this.logger.logQuery(this.queryString, params);
			const { queryString: query, client, customResultMapper } = this;
			const rows = await __tracing_ts.tracer.startActiveSpan("drizzle.driver.execute", () => {
				span?.setAttributes({
					"drizzle.query.text": query,
					"drizzle.query.params": JSON.stringify(params)
				});
				return client.unsafe(query, params);
			});
			return __tracing_ts.tracer.startActiveSpan("drizzle.mapResponse", () => {
				return customResultMapper(rows);
			});
		});
	}
	all(placeholderValues = {}) {
		return __tracing_ts.tracer.startActiveSpan("drizzle.execute", async (span) => {
			const params = (0, __sql_sql_ts.fillPlaceholders)(this.params, placeholderValues);
			span?.setAttributes({
				"drizzle.query.text": this.queryString,
				"drizzle.query.params": JSON.stringify(params)
			});
			this.logger.logQuery(this.queryString, params);
			return __tracing_ts.tracer.startActiveSpan("drizzle.driver.execute", () => {
				span?.setAttributes({
					"drizzle.query.text": this.queryString,
					"drizzle.query.params": JSON.stringify(params)
				});
				return this.queryWithCache(this.queryString, params, async () => {
					return this.client.unsafe(this.queryString, params);
				});
			});
		});
	}
	/** @internal */
	isResponseInArrayMode() {
		return this._isResponseInArrayMode;
	}
};
var PostgresJsSession = class PostgresJsSession extends __pg_core_async_session_ts.PgAsyncSession {
	static [__entity_ts.entityKind] = "PostgresJsSession";
	logger;
	cache;
	constructor(client, dialect, relations, schema, options = {}) {
		super(dialect);
		this.client = client;
		this.relations = relations;
		this.schema = schema;
		this.options = options;
		this.logger = options.logger ?? new __logger_ts.NoopLogger();
		this.cache = options.cache ?? new __cache_core_index_ts.NoopCache();
	}
	prepareQuery(query, fields, name, isResponseInArrayMode, customResultMapper, queryMetadata, cacheConfig) {
		return new PostgresJsPreparedQuery(this.client, query.sql, query.params, this.logger, this.cache, queryMetadata, cacheConfig, fields, isResponseInArrayMode, customResultMapper);
	}
	prepareRelationalQuery(query, fields, name, customResultMapper) {
		return new PostgresJsPreparedQuery(this.client, query.sql, query.params, this.logger, this.cache, void 0, void 0, fields, false, customResultMapper, true);
	}
	query(query, params) {
		this.logger.logQuery(query, params);
		return this.client.unsafe(query, params).values();
	}
	queryObjects(query, params) {
		return this.client.unsafe(query, params);
	}
	transaction(transaction, config) {
		return this.client.begin(async (client) => {
			const session = new PostgresJsSession(client, this.dialect, this.relations, this.schema, this.options);
			const tx = new PostgresJsTransaction(this.dialect, session, this.schema, this.relations);
			if (config) await tx.setTransaction(config);
			return transaction(tx);
		});
	}
};
var PostgresJsTransaction = class PostgresJsTransaction extends __pg_core_async_session_ts.PgAsyncTransaction {
	static [__entity_ts.entityKind] = "PostgresJsTransaction";
	constructor(dialect, session, schema, relations, nestedIndex = 0) {
		super(dialect, session, relations, schema, nestedIndex);
		this.session = session;
	}
	transaction(transaction) {
		return this.session.client.savepoint((client) => {
			const session = new PostgresJsSession(client, this.dialect, this.relations, this.schema, this.session.options);
			return transaction(new PostgresJsTransaction(this.dialect, session, this.schema, this.relations));
		});
	}
};

//#endregion
exports.PostgresJsPreparedQuery = PostgresJsPreparedQuery;
exports.PostgresJsSession = PostgresJsSession;
exports.PostgresJsTransaction = PostgresJsTransaction;
//# sourceMappingURL=session.cjs.map