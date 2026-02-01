const require_rolldown_runtime = require('../_virtual/rolldown_runtime.cjs');
let __entity_ts = require("../entity.cjs");
let __utils_ts = require("../utils.cjs");
let __sql_sql_ts = require("../sql/sql.cjs");
let __logger_ts = require("../logger.cjs");
let __cache_core_index_ts = require("../cache/core/index.cjs");
let __sqlite_core_index_ts = require("../sqlite-core/index.cjs");
let __sqlite_core_session_ts = require("../sqlite-core/session.cjs");

//#region src/op-sqlite/session.ts
var OPSQLiteSession = class extends __sqlite_core_session_ts.SQLiteSession {
	static [__entity_ts.entityKind] = "OPSQLiteSession";
	logger;
	cache;
	constructor(client, dialect, relations, schema, options = {}) {
		super(dialect);
		this.client = client;
		this.relations = relations;
		this.schema = schema;
		this.logger = options.logger ?? new __logger_ts.NoopLogger();
		this.cache = options.cache ?? new __cache_core_index_ts.NoopCache();
	}
	prepareQuery(query, fields, executeMethod, isResponseInArrayMode, customResultMapper, queryMetadata, cacheConfig) {
		return new OPSQLitePreparedQuery(this.client, query, this.logger, this.cache, queryMetadata, cacheConfig, fields, executeMethod, isResponseInArrayMode, customResultMapper);
	}
	prepareRelationalQuery(query, fields, executeMethod, customResultMapper) {
		return new OPSQLitePreparedQuery(this.client, query, this.logger, this.cache, void 0, void 0, fields, executeMethod, false, customResultMapper, true);
	}
	transaction(transaction, config = {}) {
		const tx = new OPSQLiteTransaction("async", this.dialect, this, this.relations, this.schema);
		this.run(__sql_sql_ts.sql.raw(`begin${config?.behavior ? " " + config.behavior : ""}`));
		try {
			const result = transaction(tx);
			this.run(__sql_sql_ts.sql`commit`);
			return result;
		} catch (err) {
			this.run(__sql_sql_ts.sql`rollback`);
			throw err;
		}
	}
};
var OPSQLiteTransaction = class OPSQLiteTransaction extends __sqlite_core_index_ts.SQLiteTransaction {
	static [__entity_ts.entityKind] = "OPSQLiteTransaction";
	transaction(transaction) {
		const savepointName = `sp${this.nestedIndex}`;
		const tx = new OPSQLiteTransaction("async", this.dialect, this.session, this.relations, this.schema, this.nestedIndex + 1);
		this.session.run(__sql_sql_ts.sql.raw(`savepoint ${savepointName}`));
		try {
			const result = transaction(tx);
			this.session.run(__sql_sql_ts.sql.raw(`release savepoint ${savepointName}`));
			return result;
		} catch (err) {
			this.session.run(__sql_sql_ts.sql.raw(`rollback to savepoint ${savepointName}`));
			throw err;
		}
	}
};
var OPSQLitePreparedQuery = class extends __sqlite_core_session_ts.SQLitePreparedQuery {
	static [__entity_ts.entityKind] = "OPSQLitePreparedQuery";
	constructor(client, query, logger, cache, queryMetadata, cacheConfig, fields, executeMethod, _isResponseInArrayMode, customResultMapper, isRqbV2Query) {
		super("sync", executeMethod, query, cache, queryMetadata, cacheConfig);
		this.client = client;
		this.logger = logger;
		this.fields = fields;
		this._isResponseInArrayMode = _isResponseInArrayMode;
		this.customResultMapper = customResultMapper;
		this.isRqbV2Query = isRqbV2Query;
	}
	async run(placeholderValues) {
		const params = (0, __sql_sql_ts.fillPlaceholders)(this.query.params, placeholderValues ?? {});
		this.logger.logQuery(this.query.sql, params);
		return await this.queryWithCache(this.query.sql, params, async () => {
			return this.client.executeAsync(this.query.sql, params);
		});
	}
	async all(placeholderValues) {
		if (this.isRqbV2Query) return this.allRqbV2(placeholderValues);
		const { fields, joinsNotNullableMap, query, logger, customResultMapper, client } = this;
		if (!fields && !customResultMapper) {
			const params = (0, __sql_sql_ts.fillPlaceholders)(query.params, placeholderValues ?? {});
			logger.logQuery(query.sql, params);
			return await this.queryWithCache(query.sql, params, async () => {
				return client.execute(query.sql, params).rows?._array || [];
			});
		}
		const rows = await this.values(placeholderValues);
		if (customResultMapper) return customResultMapper(rows);
		return rows.map((row) => (0, __utils_ts.mapResultRow)(fields, row, joinsNotNullableMap));
	}
	async allRqbV2(placeholderValues) {
		const { query, logger, customResultMapper, client } = this;
		const params = (0, __sql_sql_ts.fillPlaceholders)(query.params, placeholderValues ?? {});
		logger.logQuery(query.sql, params);
		return customResultMapper(client.execute(query.sql, params).rows?._array || []);
	}
	async get(placeholderValues) {
		if (this.isRqbV2Query) return this.getRqbV2(placeholderValues);
		const { fields, joinsNotNullableMap, customResultMapper, query, logger, client } = this;
		const params = (0, __sql_sql_ts.fillPlaceholders)(query.params, placeholderValues ?? {});
		logger.logQuery(query.sql, params);
		if (!fields && !customResultMapper) return (await this.queryWithCache(query.sql, params, async () => {
			return client.execute(query.sql, params).rows?._array || [];
		}))[0];
		const rows = await this.values(placeholderValues);
		const row = rows[0];
		if (!row) return;
		if (customResultMapper) return customResultMapper(rows);
		return (0, __utils_ts.mapResultRow)(fields, row, joinsNotNullableMap);
	}
	async getRqbV2(placeholderValues) {
		const { customResultMapper, query, logger, client } = this;
		const params = (0, __sql_sql_ts.fillPlaceholders)(query.params, placeholderValues ?? {});
		logger.logQuery(query.sql, params);
		const row = (client.execute(query.sql, params).rows?._array || [])[0];
		if (!row) return;
		return customResultMapper([row]);
	}
	async values(placeholderValues) {
		const params = (0, __sql_sql_ts.fillPlaceholders)(this.query.params, placeholderValues ?? {});
		this.logger.logQuery(this.query.sql, params);
		return await this.queryWithCache(this.query.sql, params, async () => {
			return await this.client.executeRawAsync(this.query.sql, params);
		});
	}
	/** @internal */
	isResponseInArrayMode() {
		return this._isResponseInArrayMode;
	}
};

//#endregion
exports.OPSQLitePreparedQuery = OPSQLitePreparedQuery;
exports.OPSQLiteSession = OPSQLiteSession;
exports.OPSQLiteTransaction = OPSQLiteTransaction;
//# sourceMappingURL=session.cjs.map