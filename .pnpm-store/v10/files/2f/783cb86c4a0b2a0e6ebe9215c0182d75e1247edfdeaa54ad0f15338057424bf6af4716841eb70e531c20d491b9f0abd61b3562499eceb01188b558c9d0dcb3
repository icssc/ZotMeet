const require_rolldown_runtime = require('../_virtual/rolldown_runtime.cjs');
let __entity_ts = require("../entity.cjs");
let __utils_ts = require("../utils.cjs");
let __sql_sql_ts = require("../sql/sql.cjs");
let __logger_ts = require("../logger.cjs");
let __pg_core_async_session_ts = require("../pg-core/async/session.cjs");
let _vercel_postgres = require("@vercel/postgres");
let __cache_core_cache_ts = require("../cache/core/cache.cjs");

//#region src/vercel-postgres/session.ts
var VercelPgPreparedQuery = class extends __pg_core_async_session_ts.PgAsyncPreparedQuery {
	static [__entity_ts.entityKind] = "VercelPgPreparedQuery";
	rawQuery;
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
		this.rawQuery = {
			name,
			text: queryString,
			types: { getTypeParser: (typeId, format) => {
				if (typeId === _vercel_postgres.types.builtins.TIMESTAMPTZ) return (val) => val;
				if (typeId === _vercel_postgres.types.builtins.TIMESTAMP) return (val) => val;
				if (typeId === _vercel_postgres.types.builtins.DATE) return (val) => val;
				if (typeId === _vercel_postgres.types.builtins.INTERVAL) return (val) => val;
				if (typeId === 1231) return (val) => val;
				if (typeId === 1115) return (val) => val;
				if (typeId === 1185) return (val) => val;
				if (typeId === 1187) return (val) => val;
				if (typeId === 1182) return (val) => val;
				return _vercel_postgres.types.getTypeParser(typeId, format);
			} }
		};
		this.queryConfig = {
			name,
			text: queryString,
			rowMode: "array",
			types: { getTypeParser: (typeId, format) => {
				if (typeId === _vercel_postgres.types.builtins.TIMESTAMPTZ) return (val) => val;
				if (typeId === _vercel_postgres.types.builtins.TIMESTAMP) return (val) => val;
				if (typeId === _vercel_postgres.types.builtins.DATE) return (val) => val;
				if (typeId === _vercel_postgres.types.builtins.INTERVAL) return (val) => val;
				if (typeId === 1231) return (val) => val;
				if (typeId === 1115) return (val) => val;
				if (typeId === 1185) return (val) => val;
				if (typeId === 1187) return (val) => val;
				if (typeId === 1182) return (val) => val;
				return _vercel_postgres.types.getTypeParser(typeId, format);
			} }
		};
	}
	async execute(placeholderValues = {}) {
		if (this.isRqbV2Query) return this.executeRqbV2(placeholderValues);
		const params = (0, __sql_sql_ts.fillPlaceholders)(this.params, placeholderValues);
		this.logger.logQuery(this.rawQuery.text, params);
		const { fields, rawQuery, client, queryConfig: query, joinsNotNullableMap, customResultMapper } = this;
		if (!fields && !customResultMapper) return this.queryWithCache(rawQuery.text, params, async () => {
			return await client.query(rawQuery, params);
		});
		const { rows } = await this.queryWithCache(query.text, params, async () => {
			return await client.query(query, params);
		});
		if (customResultMapper) return customResultMapper(rows);
		return rows.map((row) => (0, __utils_ts.mapResultRow)(fields, row, joinsNotNullableMap));
	}
	async executeRqbV2(placeholderValues = {}) {
		const params = (0, __sql_sql_ts.fillPlaceholders)(this.params, placeholderValues);
		this.logger.logQuery(this.rawQuery.text, params);
		const { rawQuery, client, customResultMapper } = this;
		const { rows } = await client.query(rawQuery, params);
		return customResultMapper(rows);
	}
	all(placeholderValues = {}) {
		const params = (0, __sql_sql_ts.fillPlaceholders)(this.params, placeholderValues);
		this.logger.logQuery(this.rawQuery.text, params);
		return this.queryWithCache(this.rawQuery.text, params, async () => {
			return await this.client.query(this.rawQuery, params);
		}).then((result) => result.rows);
	}
	values(placeholderValues = {}) {
		const params = (0, __sql_sql_ts.fillPlaceholders)(this.params, placeholderValues);
		this.logger.logQuery(this.rawQuery.text, params);
		return this.queryWithCache(this.queryConfig.text, params, async () => {
			return await this.client.query(this.queryConfig, params);
		}).then((result) => result.rows);
	}
	/** @internal */
	isResponseInArrayMode() {
		return this._isResponseInArrayMode;
	}
};
var VercelPgSession = class VercelPgSession extends __pg_core_async_session_ts.PgAsyncSession {
	static [__entity_ts.entityKind] = "VercelPgSession";
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
		return new VercelPgPreparedQuery(this.client, query.sql, query.params, this.logger, this.cache, queryMetadata, cacheConfig, fields, name, isResponseInArrayMode, customResultMapper);
	}
	prepareRelationalQuery(query, fields, name, customResultMapper) {
		return new VercelPgPreparedQuery(this.client, query.sql, query.params, this.logger, this.cache, void 0, void 0, fields, name, false, customResultMapper, true);
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
	async transaction(transaction, config) {
		const session = typeof this.client === "function" || this.client instanceof _vercel_postgres.VercelPool ? new VercelPgSession(await this.client.connect(), this.dialect, this.relations, this.schema, this.options) : this;
		const tx = new VercelPgTransaction(this.dialect, session, this.relations, this.schema);
		await tx.execute(__sql_sql_ts.sql`begin${config ? __sql_sql_ts.sql` ${tx.getTransactionConfigSQL(config)}` : void 0}`);
		try {
			const result = await transaction(tx);
			await tx.execute(__sql_sql_ts.sql`commit`);
			return result;
		} catch (error) {
			await tx.execute(__sql_sql_ts.sql`rollback`);
			throw error;
		} finally {
			if (typeof this.client === "function" || this.client instanceof _vercel_postgres.VercelPool) session.client.release();
		}
	}
};
var VercelPgTransaction = class VercelPgTransaction extends __pg_core_async_session_ts.PgAsyncTransaction {
	static [__entity_ts.entityKind] = "VercelPgTransaction";
	async transaction(transaction) {
		const savepointName = `sp${this.nestedIndex + 1}`;
		const tx = new VercelPgTransaction(this.dialect, this.session, this.relations, this.schema, this.nestedIndex + 1);
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
exports.VercelPgPreparedQuery = VercelPgPreparedQuery;
exports.VercelPgSession = VercelPgSession;
exports.VercelPgTransaction = VercelPgTransaction;
//# sourceMappingURL=session.cjs.map