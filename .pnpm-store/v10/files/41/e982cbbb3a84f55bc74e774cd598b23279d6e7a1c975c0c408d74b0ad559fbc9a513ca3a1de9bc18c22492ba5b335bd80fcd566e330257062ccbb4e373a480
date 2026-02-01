const require_rolldown_runtime = require('../_virtual/rolldown_runtime.cjs');
let __entity_ts = require("../entity.cjs");
let __utils_ts = require("../utils.cjs");
let __sql_sql_ts = require("../sql/sql.cjs");
let __logger_ts = require("../logger.cjs");
let __cache_core_index_ts = require("../cache/core/index.cjs");
let __sqlite_core_index_ts = require("../sqlite-core/index.cjs");
let __sqlite_core_session_ts = require("../sqlite-core/session.cjs");
let __errors_ts = require("../errors.cjs");

//#region src/sqlite-cloud/session.ts
var SQLiteCloudSession = class extends __sqlite_core_session_ts.SQLiteSession {
	static [__entity_ts.entityKind] = "SQLiteCloudSession";
	logger;
	cache;
	constructor(client, dialect, relations, schema, options) {
		super(dialect);
		this.client = client;
		this.relations = relations;
		this.schema = schema;
		this.options = options;
		this.logger = options.logger ?? new __logger_ts.NoopLogger();
		this.cache = options.cache ?? new __cache_core_index_ts.NoopCache();
	}
	prepareQuery(query, fields, executeMethod, isResponseInArrayMode, customResultMapper, queryMetadata, cacheConfig) {
		return new SQLiteCloudPreparedQuery(this.client.prepare(query.sql), query, this.logger, this.cache, queryMetadata, cacheConfig, fields, executeMethod, isResponseInArrayMode, customResultMapper);
	}
	prepareRelationalQuery(query, fields, executeMethod, customResultMapper) {
		return new SQLiteCloudPreparedQuery(this.client.prepare(query.sql), query, this.logger, this.cache, void 0, void 0, fields, executeMethod, false, customResultMapper, true);
	}
	async run(query) {
		const staticQuery = this.dialect.sqlToQuery(query);
		try {
			return await this.prepareOneTimeQuery(staticQuery, void 0, "run", false).run();
		} catch (err) {
			throw new __errors_ts.DrizzleError({
				cause: err,
				message: `Failed to run the query '${staticQuery.sql}'`
			});
		}
	}
	async all(query) {
		return await this.prepareOneTimeQuery(this.dialect.sqlToQuery(query), void 0, "run", false).all();
	}
	async get(query) {
		return await this.prepareOneTimeQuery(this.dialect.sqlToQuery(query), void 0, "run", false).get();
	}
	async values(query) {
		return await this.prepareOneTimeQuery(this.dialect.sqlToQuery(query), void 0, "run", false).values();
	}
	async transaction(transaction, config) {
		const tx = new SQLiteCloudTransaction("async", this.dialect, this, this.relations, this.schema);
		await tx.run(__sql_sql_ts.sql`BEGIN${__sql_sql_ts.sql` ${__sql_sql_ts.sql.raw(config?.behavior ?? "")}`.if(config?.behavior)} TRANSACTION`);
		try {
			const result = await transaction(tx);
			await tx.run(__sql_sql_ts.sql`COMMIT`);
			return result;
		} catch (err) {
			await tx.run(__sql_sql_ts.sql`ROLLBACK`);
			throw err;
		}
	}
};
var SQLiteCloudTransaction = class SQLiteCloudTransaction extends __sqlite_core_index_ts.SQLiteTransaction {
	static [__entity_ts.entityKind] = "SQLiteCloudTransaction";
	async transaction(transaction) {
		const savepointName = `sp${this.nestedIndex}`;
		const tx = new SQLiteCloudTransaction("async", this.dialect, this.session, this.relations, this.schema, this.nestedIndex + 1);
		await this.session.run(__sql_sql_ts.sql.raw(`savepoint ${savepointName}`));
		try {
			const result = await transaction(tx);
			await this.session.run(__sql_sql_ts.sql.raw(`release savepoint ${savepointName}`));
			return result;
		} catch (err) {
			await this.session.run(__sql_sql_ts.sql.raw(`rollback to savepoint ${savepointName}`));
			throw err;
		}
	}
};
var SQLiteCloudPreparedQuery = class extends __sqlite_core_session_ts.SQLitePreparedQuery {
	static [__entity_ts.entityKind] = "SQLiteCloudPreparedQuery";
	constructor(stmt, query, logger, cache, queryMetadata, cacheConfig, fields, executeMethod, _isResponseInArrayMode, customResultMapper, isRqbV2Query) {
		super("async", executeMethod, query, cache, queryMetadata, cacheConfig);
		this.stmt = stmt;
		this.logger = logger;
		this.fields = fields;
		this._isResponseInArrayMode = _isResponseInArrayMode;
		this.customResultMapper = customResultMapper;
		this.isRqbV2Query = isRqbV2Query;
	}
	async run(placeholderValues) {
		const { stmt, query, logger } = this;
		const params = (0, __sql_sql_ts.fillPlaceholders)(query.params, placeholderValues ?? {});
		logger.logQuery(query.sql, params);
		return await this.queryWithCache(query.sql, params, async () => {
			return await new Promise((resolve, reject) => {
				(params.length ? stmt.bind(...params) : stmt).run((e, d) => {
					if (e) return reject(e);
					return resolve(d);
				});
			});
		});
	}
	async all(placeholderValues) {
		if (this.isRqbV2Query) return await this.allRqbV2(placeholderValues);
		const { fields, logger, query, customResultMapper, joinsNotNullableMap, stmt } = this;
		if (!fields && !customResultMapper) {
			const params = (0, __sql_sql_ts.fillPlaceholders)(query.params, placeholderValues ?? {});
			logger.logQuery(query.sql, params);
			return await this.queryWithCache(query.sql, params, async () => {
				return await new Promise((resolve, reject) => {
					(params.length ? stmt.bind(...params) : stmt).all((e, d) => {
						if (e) return reject(e);
						return resolve(d.map((v) => Object.fromEntries(Object.entries(v))));
					});
				});
			});
		}
		return (await this.values(placeholderValues)).map((row) => (0, __utils_ts.mapResultRow)(fields, row, joinsNotNullableMap));
	}
	async allRqbV2(placeholderValues) {
		const { logger, query, customResultMapper, stmt } = this;
		const params = (0, __sql_sql_ts.fillPlaceholders)(query.params, placeholderValues ?? {});
		logger.logQuery(query.sql, params);
		return customResultMapper(await new Promise((resolve, reject) => {
			(params.length ? stmt.bind(...params) : stmt).all((e, d) => {
				if (e) return reject(e);
				return resolve(d.map((v) => Object.fromEntries(Object.entries(v))));
			});
		}));
	}
	async get(placeholderValues) {
		if (this.isRqbV2Query) return await this.getRqbV2(placeholderValues);
		const { fields, logger, query, stmt, customResultMapper, joinsNotNullableMap } = this;
		const params = (0, __sql_sql_ts.fillPlaceholders)(query.params, placeholderValues ?? {});
		if (!fields && !customResultMapper) {
			logger.logQuery(query.sql, params);
			return await this.queryWithCache(query.sql, params, async () => {
				return await new Promise((resolve, reject) => {
					(params.length ? stmt.bind(...params) : stmt).get((e, d) => {
						if (e) return reject(e);
						return resolve(d ? Object.fromEntries(Object.entries(d)) : d);
					});
				});
			});
		}
		const row = await this.queryWithCache(query.sql, params, async () => {
			return await new Promise((resolve, reject) => {
				(params.length ? stmt.bind(...params) : stmt).get((e, d) => {
					if (e) return reject(e);
					return resolve(d ? d.getData() : d);
				});
			});
		});
		if (row === void 0) return row;
		return (0, __utils_ts.mapResultRow)(fields, row, joinsNotNullableMap);
	}
	async getRqbV2(placeholderValues) {
		const { logger, query, stmt, customResultMapper } = this;
		const params = (0, __sql_sql_ts.fillPlaceholders)(query.params, placeholderValues ?? {});
		logger.logQuery(query.sql, params);
		const row = await new Promise((resolve, reject) => {
			(params.length ? stmt.bind(...params) : stmt).get((e, d) => {
				if (e) return reject(e);
				return resolve(d ? Object.fromEntries(Object.entries(d)) : d);
			});
		});
		if (row === void 0) return row;
		return customResultMapper([row]);
	}
	async values(placeholderValues) {
		const { logger, stmt, query } = this;
		const params = (0, __sql_sql_ts.fillPlaceholders)(query.params, placeholderValues ?? {});
		logger.logQuery(query.sql, params);
		return await this.queryWithCache(query.sql, params, async () => {
			return await new Promise((resolve, reject) => {
				(params.length ? stmt.bind(...params) : stmt).all((e, d) => {
					if (e) return reject(e);
					return resolve(d.map((v) => v.getData()));
				});
			});
		});
	}
	/** @internal */
	isResponseInArrayMode() {
		return this._isResponseInArrayMode;
	}
};

//#endregion
exports.SQLiteCloudPreparedQuery = SQLiteCloudPreparedQuery;
exports.SQLiteCloudSession = SQLiteCloudSession;
exports.SQLiteCloudTransaction = SQLiteCloudTransaction;
//# sourceMappingURL=session.cjs.map