const require_rolldown_runtime = require('../_virtual/rolldown_runtime.cjs');
let __entity_ts = require("../entity.cjs");
let __tracing_ts = require("../tracing.cjs");
let __utils_ts = require("../utils.cjs");
let __sql_sql_ts = require("../sql/sql.cjs");
let __logger_ts = require("../logger.cjs");
let __cache_core_index_ts = require("../cache/core/index.cjs");
let __gel_core_session_ts = require("../gel-core/session.cjs");

//#region src/gel/session.ts
var GelDbPreparedQuery = class extends __gel_core_session_ts.GelPreparedQuery {
	static [__entity_ts.entityKind] = "GelPreparedQuery";
	constructor(client, queryString, params, logger, cache, queryMetadata, cacheConfig, fields, _isResponseInArrayMode, customResultMapper, transaction = false, isRqbV2Query) {
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
		this.transaction = transaction;
		this.isRqbV2Query = isRqbV2Query;
	}
	async execute(placeholderValues = {}) {
		if (this.isRqbV2Query) return this.executeRqbV2(placeholderValues);
		return __tracing_ts.tracer.startActiveSpan("drizzle.execute", async () => {
			const params = (0, __sql_sql_ts.fillPlaceholders)(this.params, placeholderValues);
			this.logger.logQuery(this.queryString, params);
			const { fields, queryString: query, client, joinsNotNullableMap, customResultMapper } = this;
			if (!fields && !customResultMapper) return __tracing_ts.tracer.startActiveSpan("drizzle.driver.execute", async (span) => {
				span?.setAttributes({
					"drizzle.query.text": query,
					"drizzle.query.params": JSON.stringify(params)
				});
				return await this.queryWithCache(query, params, async () => {
					return await client.querySQL(query, params.length ? params : void 0);
				});
			});
			const result = await __tracing_ts.tracer.startActiveSpan("drizzle.driver.execute", async (span) => {
				span?.setAttributes({
					"drizzle.query.text": query,
					"drizzle.query.params": JSON.stringify(params)
				});
				return await this.queryWithCache(query, params, async () => {
					return await client.withSQLRowMode("array").querySQL(query, params.length ? params : void 0);
				});
			});
			return __tracing_ts.tracer.startActiveSpan("drizzle.mapResponse", () => {
				return customResultMapper ? customResultMapper(result) : result.map((row) => (0, __utils_ts.mapResultRow)(fields, row, joinsNotNullableMap));
			});
		});
	}
	async executeRqbV2(placeholderValues = {}) {
		return __tracing_ts.tracer.startActiveSpan("drizzle.execute", async () => {
			const params = (0, __sql_sql_ts.fillPlaceholders)(this.params, placeholderValues);
			this.logger.logQuery(this.queryString, params);
			const { queryString: query, client, customResultMapper } = this;
			const result = await __tracing_ts.tracer.startActiveSpan("drizzle.driver.execute", (span) => {
				span?.setAttributes({
					"drizzle.query.text": query,
					"drizzle.query.params": JSON.stringify(params)
				});
				return client.querySQL(query, params.length ? params : void 0);
			});
			return __tracing_ts.tracer.startActiveSpan("drizzle.mapResponse", () => {
				return customResultMapper(result);
			});
		});
	}
	async all(placeholderValues = {}) {
		return await __tracing_ts.tracer.startActiveSpan("drizzle.execute", async () => {
			const params = (0, __sql_sql_ts.fillPlaceholders)(this.params, placeholderValues);
			this.logger.logQuery(this.queryString, params);
			return await __tracing_ts.tracer.startActiveSpan("drizzle.driver.execute", async (span) => {
				span?.setAttributes({
					"drizzle.query.text": this.queryString,
					"drizzle.query.params": JSON.stringify(params)
				});
				return await this.queryWithCache(this.queryString, params, async () => {
					return await this.client.withSQLRowMode("array").querySQL(this.queryString, params.length ? params : void 0).then((result) => result);
				});
			});
		});
	}
	/** @internal */
	isResponseInArrayMode() {
		return this._isResponseInArrayMode;
	}
};
var GelDbSession = class GelDbSession extends __gel_core_session_ts.GelSession {
	static [__entity_ts.entityKind] = "GelDbSession";
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
		return new GelDbPreparedQuery(this.client, query.sql, query.params, this.logger, this.cache, queryMetadata, cacheConfig, fields, isResponseInArrayMode, customResultMapper);
	}
	prepareRelationalQuery(query, fields, name, customResultMapper) {
		return new GelDbPreparedQuery(this.client, query.sql, query.params, this.logger, this.cache, void 0, void 0, fields, false, customResultMapper, void 0, true);
	}
	async transaction(transaction) {
		return await this.client.transaction(async (clientTx) => {
			const session = new GelDbSession(clientTx, this.dialect, this.relations, this.schema, this.options);
			return await transaction(new GelDbTransaction(this.dialect, session, this.relations, this.schema));
		});
	}
	async count(sql) {
		const res = await this.execute(sql);
		return Number(res[0]["count"]);
	}
};
var GelDbTransaction = class GelDbTransaction extends __gel_core_session_ts.GelTransaction {
	static [__entity_ts.entityKind] = "GelDbTransaction";
	async transaction(transaction) {
		return await transaction(new GelDbTransaction(this.dialect, this.session, this.relations, this.schema));
	}
};

//#endregion
exports.GelDbPreparedQuery = GelDbPreparedQuery;
exports.GelDbSession = GelDbSession;
exports.GelDbTransaction = GelDbTransaction;
//# sourceMappingURL=session.cjs.map