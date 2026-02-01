const require_rolldown_runtime = require('../_virtual/rolldown_runtime.cjs');
let __entity_ts = require("../entity.cjs");
let __utils_ts = require("../utils.cjs");
let __sql_sql_ts = require("../sql/sql.cjs");
let __logger_ts = require("../logger.cjs");
let __cache_core_index_ts = require("../cache/core/index.cjs");
let __sqlite_core_index_ts = require("../sqlite-core/index.cjs");
let __sqlite_core_session_ts = require("../sqlite-core/session.cjs");
let __errors_ts = require("../errors.cjs");

//#region src/tursodatabase/session.ts
var TursoDatabaseSession = class TursoDatabaseSession extends __sqlite_core_session_ts.SQLiteSession {
	static [__entity_ts.entityKind] = "TursoDatabaseSession";
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
		return new TursoDatabasePreparedQuery(this.client.prepare(query.sql), query, this.logger, this.cache, queryMetadata, cacheConfig, fields, executeMethod, isResponseInArrayMode, customResultMapper);
	}
	prepareRelationalQuery(query, fields, executeMethod, customResultMapper) {
		return new TursoDatabasePreparedQuery(this.client.prepare(query.sql), query, this.logger, this.cache, void 0, void 0, fields, executeMethod, false, customResultMapper, true);
	}
	async transaction(transaction, _config, tx) {
		const session = new TursoDatabaseSession(this.client, this.dialect, this.relations, this.schema, this.options);
		const localTx = tx ?? new TursoDatabaseTransaction("async", this.dialect, session, this.relations, this.schema);
		return await this.client.transaction(async () => await transaction(localTx))();
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
};
var TursoDatabaseTransaction = class extends __sqlite_core_index_ts.SQLiteTransaction {
	static [__entity_ts.entityKind] = "TursoDatabaseTransaction";
	async transaction(_transaction) {
		throw new Error("Nested transactions are not supported");
	}
};
var TursoDatabasePreparedQuery = class extends __sqlite_core_session_ts.SQLitePreparedQuery {
	static [__entity_ts.entityKind] = "TursoDatabasePreparedQuery";
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
			return await (params.length ? stmt.run(...params) : stmt.run());
		});
	}
	async all(placeholderValues) {
		if (this.isRqbV2Query) return await this.allRqbV2(placeholderValues);
		const { fields, logger, query, customResultMapper, joinsNotNullableMap, stmt } = this;
		if (!fields && !customResultMapper) {
			const params = (0, __sql_sql_ts.fillPlaceholders)(query.params, placeholderValues ?? {});
			logger.logQuery(query.sql, params);
			return await this.queryWithCache(query.sql, params, async () => {
				return await (params.length ? stmt.raw(false).all(...params) : stmt.raw(false).all());
			});
		}
		return (await this.values(placeholderValues)).map((row) => (0, __utils_ts.mapResultRow)(fields, row, joinsNotNullableMap));
	}
	async allRqbV2(placeholderValues) {
		const { logger, query, customResultMapper, stmt } = this;
		const params = (0, __sql_sql_ts.fillPlaceholders)(query.params, placeholderValues ?? {});
		logger.logQuery(query.sql, params);
		return customResultMapper(await (params.length ? stmt.raw(false).all(...params) : stmt.raw(false).all()));
	}
	async get(placeholderValues) {
		if (this.isRqbV2Query) return await this.getRqbV2(placeholderValues);
		const { fields, logger, query, stmt, customResultMapper, joinsNotNullableMap } = this;
		const params = (0, __sql_sql_ts.fillPlaceholders)(query.params, placeholderValues ?? {});
		if (!fields && !customResultMapper) {
			logger.logQuery(query.sql, params);
			return await this.queryWithCache(query.sql, params, async () => {
				return await (params.length ? stmt.raw(false).get(...params) : stmt.raw(false).get());
			});
		}
		const row = await this.queryWithCache(query.sql, params, async () => {
			return await (params.length ? stmt.raw(true).get(...params) : stmt.raw(true).get());
		});
		if (row === void 0) return row;
		return (0, __utils_ts.mapResultRow)(fields, row, joinsNotNullableMap);
	}
	async getRqbV2(placeholderValues) {
		const { logger, query, stmt, customResultMapper } = this;
		const params = (0, __sql_sql_ts.fillPlaceholders)(query.params, placeholderValues ?? {});
		logger.logQuery(query.sql, params);
		const row = await (params.length ? stmt.raw(false).get(...params) : stmt.raw(false).get());
		if (row === void 0) return row;
		return customResultMapper([row]);
	}
	async values(placeholderValues) {
		const { logger, stmt, query } = this;
		const params = (0, __sql_sql_ts.fillPlaceholders)(query.params, placeholderValues ?? {});
		logger.logQuery(query.sql, params);
		return await this.queryWithCache(query.sql, params, async () => {
			return await (params.length ? stmt.raw(true).all(...params) : stmt.raw(true).all());
		});
	}
	/** @internal */
	isResponseInArrayMode() {
		return this._isResponseInArrayMode;
	}
};

//#endregion
exports.TursoDatabasePreparedQuery = TursoDatabasePreparedQuery;
exports.TursoDatabaseSession = TursoDatabaseSession;
exports.TursoDatabaseTransaction = TursoDatabaseTransaction;
//# sourceMappingURL=session.cjs.map