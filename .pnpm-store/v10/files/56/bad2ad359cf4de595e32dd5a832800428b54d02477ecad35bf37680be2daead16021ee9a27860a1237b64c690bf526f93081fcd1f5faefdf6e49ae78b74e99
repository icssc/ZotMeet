const require_rolldown_runtime = require('../_virtual/rolldown_runtime.cjs');
let __entity_ts = require("../entity.cjs");
let __utils_ts = require("../utils.cjs");
let __sql_sql_ts = require("../sql/sql.cjs");
let __logger_ts = require("../logger.cjs");
let __cache_core_index_ts = require("../cache/core/index.cjs");
let __pg_core_async_session_ts = require("../pg-core/async/session.cjs");

//#region src/xata-http/session.ts
var XataHttpPreparedQuery = class extends __pg_core_async_session_ts.PgAsyncPreparedQuery {
	static [__entity_ts.entityKind] = "XataHttpPreparedQuery";
	constructor(client, query, logger, cache, queryMetadata, cacheConfig, fields, _isResponseInArrayMode, customResultMapper, isRqbV2Query) {
		super(query, cache, queryMetadata, cacheConfig);
		this.client = client;
		this.logger = logger;
		this.fields = fields;
		this._isResponseInArrayMode = _isResponseInArrayMode;
		this.customResultMapper = customResultMapper;
		this.isRqbV2Query = isRqbV2Query;
	}
	async execute(placeholderValues = {}) {
		if (this.isRqbV2Query) return this.executeRqbV2(placeholderValues);
		const params = (0, __sql_sql_ts.fillPlaceholders)(this.query.params, placeholderValues);
		this.logger.logQuery(this.query.sql, params);
		const { fields, client, query, customResultMapper, joinsNotNullableMap } = this;
		if (!fields && !customResultMapper) return this.queryWithCache(query.sql, params, async () => {
			return await client.sql({
				statement: query.sql,
				params
			});
		});
		const { rows, warning } = await this.queryWithCache(query.sql, params, async () => {
			return await client.sql({
				statement: query.sql,
				params,
				responseType: "array"
			});
		});
		if (warning) console.warn(warning);
		return customResultMapper ? customResultMapper(rows) : rows.map((row) => (0, __utils_ts.mapResultRow)(fields, row, joinsNotNullableMap));
	}
	async executeRqbV2(placeholderValues = {}) {
		const params = (0, __sql_sql_ts.fillPlaceholders)(this.query.params, placeholderValues);
		this.logger.logQuery(this.query.sql, params);
		const { client, query, customResultMapper } = this;
		const { warning, records } = await client.sql({
			statement: query.sql,
			params,
			responseType: "json"
		});
		if (warning) console.warn(warning);
		return customResultMapper(records);
	}
	all(placeholderValues = {}) {
		const params = (0, __sql_sql_ts.fillPlaceholders)(this.query.params, placeholderValues);
		this.logger.logQuery(this.query.sql, params);
		return this.queryWithCache(this.query.sql, params, async () => {
			return this.client.sql({
				statement: this.query.sql,
				params,
				responseType: "array"
			});
		}).then((result) => result.rows);
	}
	values(placeholderValues = {}) {
		const params = (0, __sql_sql_ts.fillPlaceholders)(this.query.params, placeholderValues);
		this.logger.logQuery(this.query.sql, params);
		return this.queryWithCache(this.query.sql, params, async () => {
			return this.client.sql({
				statement: this.query.sql,
				params
			});
		}).then((result) => result.records);
	}
	/** @internal */
	isResponseInArrayMode() {
		return this._isResponseInArrayMode;
	}
};
var XataHttpSession = class extends __pg_core_async_session_ts.PgAsyncSession {
	static [__entity_ts.entityKind] = "XataHttpSession";
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
		return new XataHttpPreparedQuery(this.client, query, this.logger, this.cache, queryMetadata, cacheConfig, fields, isResponseInArrayMode, customResultMapper);
	}
	prepareRelationalQuery(query, fields, name, customResultMapper) {
		return new XataHttpPreparedQuery(this.client, query, this.logger, this.cache, void 0, void 0, fields, false, customResultMapper, true);
	}
	async query(query, params) {
		this.logger.logQuery(query, params);
		const result = await this.client.sql({
			statement: query,
			params,
			responseType: "array"
		});
		return {
			rowCount: result.rows.length,
			rows: result.rows,
			rowAsArray: true
		};
	}
	async queryObjects(query, params) {
		const result = await this.client.sql({
			statement: query,
			params
		});
		return {
			rowCount: result.records.length,
			rows: result.records,
			rowAsArray: false
		};
	}
	async transaction(_transaction, _config = {}) {
		throw new Error("No transactions support in Xata Http driver");
	}
};
var XataTransaction = class extends __pg_core_async_session_ts.PgAsyncTransaction {
	static [__entity_ts.entityKind] = "XataHttpTransaction";
	async transaction(_transaction) {
		throw new Error("No transactions support in Xata Http driver");
	}
};

//#endregion
exports.XataHttpPreparedQuery = XataHttpPreparedQuery;
exports.XataHttpSession = XataHttpSession;
exports.XataTransaction = XataTransaction;
//# sourceMappingURL=session.cjs.map