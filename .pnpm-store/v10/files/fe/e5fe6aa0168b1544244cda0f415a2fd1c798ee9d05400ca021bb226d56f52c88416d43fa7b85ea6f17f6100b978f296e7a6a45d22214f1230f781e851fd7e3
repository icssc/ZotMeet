const require_rolldown_runtime = require('../_virtual/rolldown_runtime.cjs');
let __entity_ts = require("../entity.cjs");
let __tracing_ts = require("../tracing.cjs");
let __utils_ts = require("../utils.cjs");
let __sql_sql_ts = require("../sql/sql.cjs");
let __logger_ts = require("../logger.cjs");
let __cache_core_index_ts = require("../cache/core/index.cjs");
let __pg_core_async_session_ts = require("../pg-core/async/session.cjs");
let pg = require("pg");
pg = require_rolldown_runtime.__toESM(pg);

//#region src/node-postgres/session.ts
const { Pool, types } = pg.default;
var NodePgPreparedQuery = class extends __pg_core_async_session_ts.PgAsyncPreparedQuery {
	static [__entity_ts.entityKind] = "NodePgPreparedQuery";
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
			name,
			text: queryString,
			types: { getTypeParser: (typeId, format) => {
				if (typeId === types.builtins.TIMESTAMPTZ) return (val) => val;
				if (typeId === types.builtins.TIMESTAMP) return (val) => val;
				if (typeId === types.builtins.DATE) return (val) => val;
				if (typeId === types.builtins.INTERVAL) return (val) => val;
				if (typeId === 1231) return (val) => val;
				if (typeId === 1115) return (val) => val;
				if (typeId === 1185) return (val) => val;
				if (typeId === 1187) return (val) => val;
				if (typeId === 1182) return (val) => val;
				return types.getTypeParser(typeId, format);
			} }
		};
		this.queryConfig = {
			name,
			text: queryString,
			rowMode: "array",
			types: { getTypeParser: (typeId, format) => {
				if (typeId === types.builtins.TIMESTAMPTZ) return (val) => val;
				if (typeId === types.builtins.TIMESTAMP) return (val) => val;
				if (typeId === types.builtins.DATE) return (val) => val;
				if (typeId === types.builtins.INTERVAL) return (val) => val;
				if (typeId === 1231) return (val) => val;
				if (typeId === 1115) return (val) => val;
				if (typeId === 1185) return (val) => val;
				if (typeId === 1187) return (val) => val;
				if (typeId === 1182) return (val) => val;
				return types.getTypeParser(typeId, format);
			} }
		};
	}
	async execute(placeholderValues = {}) {
		if (this.isRqbV2Query) return this.executeRqbV2(placeholderValues);
		return __tracing_ts.tracer.startActiveSpan("drizzle.execute", async () => {
			const params = (0, __sql_sql_ts.fillPlaceholders)(this.params, placeholderValues);
			this.logger.logQuery(this.rawQueryConfig.text, params);
			const { fields, rawQueryConfig: rawQuery, client, queryConfig: query, joinsNotNullableMap, customResultMapper } = this;
			if (!fields && !customResultMapper) return __tracing_ts.tracer.startActiveSpan("drizzle.driver.execute", async (span) => {
				span?.setAttributes({
					"drizzle.query.name": rawQuery.name,
					"drizzle.query.text": rawQuery.text,
					"drizzle.query.params": JSON.stringify(params)
				});
				return this.queryWithCache(rawQuery.text, params, async () => {
					return await client.query(rawQuery, params);
				});
			});
			const result = await __tracing_ts.tracer.startActiveSpan("drizzle.driver.execute", (span) => {
				span?.setAttributes({
					"drizzle.query.name": query.name,
					"drizzle.query.text": query.text,
					"drizzle.query.params": JSON.stringify(params)
				});
				return this.queryWithCache(query.text, params, async () => {
					return await client.query(query, params);
				});
			});
			return __tracing_ts.tracer.startActiveSpan("drizzle.mapResponse", () => {
				return customResultMapper ? customResultMapper(result.rows) : result.rows.map((row) => (0, __utils_ts.mapResultRow)(fields, row, joinsNotNullableMap));
			});
		});
	}
	async executeRqbV2(placeholderValues = {}) {
		return __tracing_ts.tracer.startActiveSpan("drizzle.execute", async () => {
			const params = (0, __sql_sql_ts.fillPlaceholders)(this.params, placeholderValues);
			this.logger.logQuery(this.rawQueryConfig.text, params);
			const { rawQueryConfig: rawQuery, client, customResultMapper } = this;
			const result = await __tracing_ts.tracer.startActiveSpan("drizzle.driver.execute", (span) => {
				span?.setAttributes({
					"drizzle.query.name": rawQuery.name,
					"drizzle.query.text": rawQuery.text,
					"drizzle.query.params": JSON.stringify(params)
				});
				return client.query(rawQuery, params);
			});
			return __tracing_ts.tracer.startActiveSpan("drizzle.mapResponse", () => {
				return customResultMapper(result.rows);
			});
		});
	}
	all(placeholderValues = {}) {
		return __tracing_ts.tracer.startActiveSpan("drizzle.execute", () => {
			const params = (0, __sql_sql_ts.fillPlaceholders)(this.params, placeholderValues);
			this.logger.logQuery(this.rawQueryConfig.text, params);
			return __tracing_ts.tracer.startActiveSpan("drizzle.driver.execute", (span) => {
				span?.setAttributes({
					"drizzle.query.name": this.rawQueryConfig.name,
					"drizzle.query.text": this.rawQueryConfig.text,
					"drizzle.query.params": JSON.stringify(params)
				});
				return this.queryWithCache(this.rawQueryConfig.text, params, async () => {
					return this.client.query(this.rawQueryConfig, params);
				}).then((result) => result.rows);
			});
		});
	}
	/** @internal */
	isResponseInArrayMode() {
		return this._isResponseInArrayMode;
	}
};
var NodePgSession = class NodePgSession extends __pg_core_async_session_ts.PgAsyncSession {
	static [__entity_ts.entityKind] = "NodePgSession";
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
		return new NodePgPreparedQuery(this.client, query.sql, query.params, this.logger, this.cache, queryMetadata, cacheConfig, fields, name, isResponseInArrayMode, customResultMapper);
	}
	prepareRelationalQuery(query, fields, name, customResultMapper) {
		return new NodePgPreparedQuery(this.client, query.sql, query.params, this.logger, this.cache, void 0, void 0, fields, name, false, customResultMapper, true);
	}
	async transaction(transaction, config) {
		const isPool = this.client instanceof Pool || Object.getPrototypeOf(this.client).constructor.name.includes("Pool");
		const session = isPool ? new NodePgSession(await this.client.connect(), this.dialect, this.relations, this.schema, this.options) : this;
		const tx = new NodePgTransaction(this.dialect, session, this.relations, this.schema);
		await tx.execute(__sql_sql_ts.sql`begin${config ? __sql_sql_ts.sql` ${tx.getTransactionConfigSQL(config)}` : void 0}`);
		try {
			const result = await transaction(tx);
			await tx.execute(__sql_sql_ts.sql`commit`);
			return result;
		} catch (error) {
			await tx.execute(__sql_sql_ts.sql`rollback`);
			throw error;
		} finally {
			if (isPool) session.client.release();
		}
	}
};
var NodePgTransaction = class NodePgTransaction extends __pg_core_async_session_ts.PgAsyncTransaction {
	static [__entity_ts.entityKind] = "NodePgTransaction";
	async transaction(transaction) {
		const savepointName = `sp${this.nestedIndex + 1}`;
		const tx = new NodePgTransaction(this.dialect, this.session, this.relations, this.schema, this.nestedIndex + 1);
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
exports.NodePgPreparedQuery = NodePgPreparedQuery;
exports.NodePgSession = NodePgSession;
exports.NodePgTransaction = NodePgTransaction;
//# sourceMappingURL=session.cjs.map