import { entityKind } from "../entity.js";
import { mapResultRow } from "../utils.js";
import { fillPlaceholders, sql } from "../sql/sql.js";
import { NoopLogger } from "../logger.js";
import { PgAsyncPreparedQuery, PgAsyncSession, PgAsyncTransaction } from "../pg-core/async/session.js";
import { NoopCache } from "../cache/core/cache.js";
import { types } from "@electric-sql/pglite";

//#region src/pglite/session.ts
var PglitePreparedQuery = class extends PgAsyncPreparedQuery {
	static [entityKind] = "PglitePreparedQuery";
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
			rowMode: "object",
			parsers: {
				[types.TIMESTAMP]: (value) => value,
				[types.TIMESTAMPTZ]: (value) => value,
				[types.INTERVAL]: (value) => value,
				[types.DATE]: (value) => value,
				[1231]: (value) => value,
				[1115]: (value) => value,
				[1185]: (value) => value,
				[1187]: (value) => value,
				[1182]: (value) => value
			}
		};
		this.queryConfig = {
			rowMode: "array",
			parsers: {
				[types.TIMESTAMP]: (value) => value,
				[types.TIMESTAMPTZ]: (value) => value,
				[types.INTERVAL]: (value) => value,
				[types.DATE]: (value) => value,
				[1231]: (value) => value,
				[1115]: (value) => value,
				[1185]: (value) => value,
				[1187]: (value) => value,
				[1182]: (value) => value
			}
		};
	}
	async execute(placeholderValues = {}) {
		if (this.isRqbV2Query) return this.executeRqbV2(placeholderValues);
		const params = fillPlaceholders(this.params, placeholderValues);
		this.logger.logQuery(this.queryString, params);
		const { fields, client, queryConfig, joinsNotNullableMap, customResultMapper, queryString, rawQueryConfig } = this;
		if (!fields && !customResultMapper) return this.queryWithCache(queryString, params, async () => {
			return await client.query(queryString, params, rawQueryConfig);
		});
		const result = await this.queryWithCache(queryString, params, async () => {
			return await client.query(queryString, params, queryConfig);
		});
		return customResultMapper ? customResultMapper(result.rows) : result.rows.map((row) => mapResultRow(fields, row, joinsNotNullableMap));
	}
	async executeRqbV2(placeholderValues = {}) {
		const params = fillPlaceholders(this.params, placeholderValues);
		this.logger.logQuery(this.queryString, params);
		const { rawQueryConfig, client, customResultMapper, queryString } = this;
		return customResultMapper((await client.query(queryString, params, rawQueryConfig)).rows);
	}
	all(placeholderValues = {}) {
		const params = fillPlaceholders(this.params, placeholderValues);
		this.logger.logQuery(this.queryString, params);
		return this.queryWithCache(this.queryString, params, async () => {
			return await this.client.query(this.queryString, params, this.rawQueryConfig);
		}).then((result) => result.rows);
	}
	/** @internal */
	isResponseInArrayMode() {
		return this._isResponseInArrayMode;
	}
};
var PgliteSession = class PgliteSession extends PgAsyncSession {
	static [entityKind] = "PgliteSession";
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
		return new PglitePreparedQuery(this.client, query.sql, query.params, this.logger, this.cache, queryMetadata, cacheConfig, fields, name, isResponseInArrayMode, customResultMapper);
	}
	prepareRelationalQuery(query, fields, name, customResultMapper) {
		return new PglitePreparedQuery(this.client, query.sql, query.params, this.logger, this.cache, void 0, void 0, fields, name, false, customResultMapper, true);
	}
	async transaction(transaction, config) {
		return this.client.transaction(async (client) => {
			const session = new PgliteSession(client, this.dialect, this.relations, this.schema, this.options);
			const tx = new PgliteTransaction(this.dialect, session, this.relations, this.schema);
			if (config) await tx.setTransaction(config);
			return transaction(tx);
		});
	}
};
var PgliteTransaction = class PgliteTransaction extends PgAsyncTransaction {
	static [entityKind] = "PgliteTransaction";
	async transaction(transaction) {
		const savepointName = `sp${this.nestedIndex + 1}`;
		const tx = new PgliteTransaction(this.dialect, this.session, this.relations, this.schema, this.nestedIndex + 1);
		await tx.execute(sql.raw(`savepoint ${savepointName}`));
		try {
			const result = await transaction(tx);
			await tx.execute(sql.raw(`release savepoint ${savepointName}`));
			return result;
		} catch (err) {
			await tx.execute(sql.raw(`rollback to savepoint ${savepointName}`));
			throw err;
		}
	}
};

//#endregion
export { PglitePreparedQuery, PgliteSession, PgliteTransaction };
//# sourceMappingURL=session.js.map