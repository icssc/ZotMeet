import { entityKind } from "../entity.js";
import { mapResultRow } from "../utils.js";
import { fillPlaceholders } from "../sql/sql.js";
import { NoopLogger } from "../logger.js";
import { NoopCache } from "../cache/core/index.js";
import { PgAsyncPreparedQuery, PgAsyncSession, PgAsyncTransaction } from "../pg-core/async/session.js";

//#region src/xata-http/session.ts
var XataHttpPreparedQuery = class extends PgAsyncPreparedQuery {
	static [entityKind] = "XataHttpPreparedQuery";
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
		const params = fillPlaceholders(this.query.params, placeholderValues);
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
		return customResultMapper ? customResultMapper(rows) : rows.map((row) => mapResultRow(fields, row, joinsNotNullableMap));
	}
	async executeRqbV2(placeholderValues = {}) {
		const params = fillPlaceholders(this.query.params, placeholderValues);
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
		const params = fillPlaceholders(this.query.params, placeholderValues);
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
		const params = fillPlaceholders(this.query.params, placeholderValues);
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
var XataHttpSession = class extends PgAsyncSession {
	static [entityKind] = "XataHttpSession";
	logger;
	cache;
	constructor(client, dialect, relations, schema, options = {}) {
		super(dialect);
		this.client = client;
		this.relations = relations;
		this.schema = schema;
		this.options = options;
		this.logger = options.logger ?? new NoopLogger();
		this.cache = options.cache ?? new NoopCache();
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
var XataTransaction = class extends PgAsyncTransaction {
	static [entityKind] = "XataHttpTransaction";
	async transaction(_transaction) {
		throw new Error("No transactions support in Xata Http driver");
	}
};

//#endregion
export { XataHttpPreparedQuery, XataHttpSession, XataTransaction };
//# sourceMappingURL=session.js.map