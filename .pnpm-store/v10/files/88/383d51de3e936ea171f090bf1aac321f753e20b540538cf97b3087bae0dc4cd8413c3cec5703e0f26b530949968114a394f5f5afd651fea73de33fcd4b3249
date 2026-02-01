const require_rolldown_runtime = require('../_virtual/rolldown_runtime.cjs');
let __entity_ts = require("../entity.cjs");
let __utils_ts = require("../utils.cjs");
let __sql_sql_ts = require("../sql/sql.cjs");
let __logger_ts = require("../logger.cjs");
let __cache_core_index_ts = require("../cache/core/index.cjs");
let __pg_core_async_session_ts = require("../pg-core/async/session.cjs");

//#region src/neon-http/session.ts
const rawQueryConfig = {
	arrayMode: false,
	fullResults: true
};
const queryConfig = {
	arrayMode: true,
	fullResults: true
};
var NeonHttpPreparedQuery = class extends __pg_core_async_session_ts.PgAsyncPreparedQuery {
	static [__entity_ts.entityKind] = "NeonHttpPreparedQuery";
	clientQuery;
	constructor(client, query, logger, cache, queryMetadata, cacheConfig, fields, _isResponseInArrayMode, customResultMapper, isRqbV2Query) {
		super(query, cache, queryMetadata, cacheConfig);
		this.client = client;
		this.logger = logger;
		this.fields = fields;
		this._isResponseInArrayMode = _isResponseInArrayMode;
		this.customResultMapper = customResultMapper;
		this.isRqbV2Query = isRqbV2Query;
		this.clientQuery = client.query ?? client;
	}
	/** @internal */
	async execute(placeholderValues = {}, token = this.authToken) {
		if (this.isRqbV2Query) return this.executeRqbV2(placeholderValues, token);
		const params = (0, __sql_sql_ts.fillPlaceholders)(this.query.params, placeholderValues);
		this.logger.logQuery(this.query.sql, params);
		const { fields, clientQuery, query, customResultMapper } = this;
		if (!fields && !customResultMapper) return this.queryWithCache(query.sql, params, async () => {
			return clientQuery(query.sql, params, token === void 0 ? rawQueryConfig : {
				...rawQueryConfig,
				authToken: token
			});
		});
		const result = await this.queryWithCache(query.sql, params, async () => {
			return await clientQuery(query.sql, params, token === void 0 ? queryConfig : {
				...queryConfig,
				authToken: token
			});
		});
		return this.mapResult(result);
	}
	async executeRqbV2(placeholderValues, token) {
		const params = (0, __sql_sql_ts.fillPlaceholders)(this.query.params, placeholderValues);
		this.logger.logQuery(this.query.sql, params);
		const { clientQuery, query, customResultMapper } = this;
		const rows = (await clientQuery(query.sql, params, token === void 0 ? rawQueryConfig : {
			...rawQueryConfig,
			authToken: token
		})).rows;
		return customResultMapper(rows);
	}
	mapResult(result) {
		if (!this.fields && !this.customResultMapper) return result;
		const rows = result.rows;
		if (this.customResultMapper) return this.customResultMapper(rows);
		return rows.map((row) => (0, __utils_ts.mapResultRow)(this.fields, row, this.joinsNotNullableMap));
	}
	all(placeholderValues = {}) {
		const params = (0, __sql_sql_ts.fillPlaceholders)(this.query.params, placeholderValues);
		this.logger.logQuery(this.query.sql, params);
		return this.clientQuery(this.query.sql, params, this.authToken === void 0 ? rawQueryConfig : {
			...rawQueryConfig,
			authToken: this.authToken
		}).then((result) => result.rows);
	}
	/** @internal */
	values(placeholderValues = {}, token) {
		const params = (0, __sql_sql_ts.fillPlaceholders)(this.query.params, placeholderValues);
		this.logger.logQuery(this.query.sql, params);
		return this.clientQuery(this.query.sql, params, {
			arrayMode: true,
			fullResults: true,
			authToken: token
		}).then((result) => result.rows);
	}
	/** @internal */
	isResponseInArrayMode() {
		return this._isResponseInArrayMode;
	}
};
var NeonHttpSession = class extends __pg_core_async_session_ts.PgAsyncSession {
	static [__entity_ts.entityKind] = "NeonHttpSession";
	clientQuery;
	logger;
	cache;
	constructor(client, dialect, relations, schema, options = {}) {
		super(dialect);
		this.client = client;
		this.relations = relations;
		this.schema = schema;
		this.options = options;
		this.clientQuery = client.query ?? client;
		this.logger = options.logger ?? new __logger_ts.NoopLogger();
		this.cache = options.cache ?? new __cache_core_index_ts.NoopCache();
	}
	prepareQuery(query, fields, name, isResponseInArrayMode, customResultMapper, queryMetadata, cacheConfig) {
		return new NeonHttpPreparedQuery(this.client, query, this.logger, this.cache, queryMetadata, cacheConfig, fields, isResponseInArrayMode, customResultMapper);
	}
	prepareRelationalQuery(query, fields, name, customResultMapper) {
		return new NeonHttpPreparedQuery(this.client, query, this.logger, this.cache, void 0, void 0, fields, false, customResultMapper, true);
	}
	async batch(queries) {
		const preparedQueries = [];
		const builtQueries = [];
		for (const query of queries) {
			const preparedQuery = query._prepare();
			const builtQuery = preparedQuery.getQuery();
			preparedQueries.push(preparedQuery);
			builtQueries.push(this.clientQuery(builtQuery.sql, builtQuery.params, {
				fullResults: true,
				arrayMode: preparedQuery.isResponseInArrayMode()
			}));
		}
		return (await this.client.transaction(builtQueries, queryConfig)).map((result, i) => preparedQueries[i].mapResult(result, true));
	}
	async query(query, params) {
		this.logger.logQuery(query, params);
		return await this.clientQuery(query, params, {
			arrayMode: true,
			fullResults: true
		});
	}
	async queryObjects(query, params) {
		return this.clientQuery(query, params, {
			arrayMode: false,
			fullResults: true
		});
	}
	async transaction(_transaction, _config = {}) {
		throw new Error("No transactions support in neon-http driver");
	}
};
var NeonTransaction = class extends __pg_core_async_session_ts.PgAsyncTransaction {
	static [__entity_ts.entityKind] = "NeonHttpTransaction";
	async transaction(_transaction) {
		throw new Error("No transactions support in neon-http driver");
	}
};

//#endregion
exports.NeonHttpPreparedQuery = NeonHttpPreparedQuery;
exports.NeonHttpSession = NeonHttpSession;
exports.NeonTransaction = NeonTransaction;
//# sourceMappingURL=session.cjs.map