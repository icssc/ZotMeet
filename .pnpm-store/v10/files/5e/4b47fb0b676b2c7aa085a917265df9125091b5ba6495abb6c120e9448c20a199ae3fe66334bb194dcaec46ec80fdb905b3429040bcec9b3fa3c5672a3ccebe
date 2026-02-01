import { entityKind } from "../../entity.js";
import { mapResultRow } from "../../utils.js";
import { fillPlaceholders } from "../../sql/sql.js";
import { NoopLogger } from "../../logger.js";
import { NoopCache } from "../../cache/core/index.js";
import { SQLiteTransaction } from "../../sqlite-core/index.js";
import { SQLitePreparedQuery as SQLitePreparedQuery$1, SQLiteSession as SQLiteSession$1 } from "../../sqlite-core/session.js";
import { DrizzleError } from "../../errors.js";

//#region src/bun-sql/sqlite/session.ts
var BunSQLiteSession = class BunSQLiteSession extends SQLiteSession$1 {
	static [entityKind] = "BunSQLiteSession";
	logger;
	cache;
	constructor(client, dialect, relations, schema, options) {
		super(dialect);
		this.client = client;
		this.relations = relations;
		this.schema = schema;
		this.options = options;
		this.logger = options.logger ?? new NoopLogger();
		this.cache = options.cache ?? new NoopCache();
	}
	prepareQuery(query, fields, executeMethod, isResponseInArrayMode, customResultMapper, queryMetadata, cacheConfig) {
		return new BunSQLitePreparedQuery(this.client, query, this.logger, this.cache, queryMetadata, cacheConfig, fields, executeMethod, isResponseInArrayMode, customResultMapper);
	}
	prepareRelationalQuery(query, fields, executeMethod, customResultMapper) {
		return new BunSQLitePreparedQuery(this.client, query, this.logger, this.cache, void 0, void 0, fields, executeMethod, false, customResultMapper, true);
	}
	async run(query) {
		const staticQuery = this.dialect.sqlToQuery(query);
		try {
			return await this.prepareOneTimeQuery(staticQuery, void 0, "run", false).run();
		} catch (err) {
			throw new DrizzleError({
				cause: err,
				message: `Failed to run the query '${staticQuery.sql}'`
			});
		}
	}
	async transaction(transaction, config) {
		return this.client.begin(config?.behavior ?? "", async (client) => {
			const session = new BunSQLiteSession(client, this.dialect, this.relations, this.schema, this.options);
			return await transaction(new BunSQLiteTransaction("async", this.dialect, session, this.relations, this.schema));
		});
	}
};
var BunSQLiteTransaction = class BunSQLiteTransaction extends SQLiteTransaction {
	static [entityKind] = "BunSQLiteTransaction";
	async transaction(transaction) {
		return this.session.client.savepoint(async (client) => {
			const session = new BunSQLiteSession(client, this.session.dialect, this.relations, this.schema, this.session.options);
			return await transaction(new BunSQLiteTransaction("async", this.dialect, session, this.relations, this.schema, this.nestedIndex + 1));
		});
	}
};
var BunSQLitePreparedQuery = class extends SQLitePreparedQuery$1 {
	static [entityKind] = "BunSQLitePreparedQuery";
	constructor(client, query, logger, cache, queryMetadata, cacheConfig, fields, executeMethod, _isResponseInArrayMode, customResultMapper, isRqbV2Query) {
		super("async", executeMethod, query, cache, queryMetadata, cacheConfig);
		this.client = client;
		this.logger = logger;
		this.fields = fields;
		this._isResponseInArrayMode = _isResponseInArrayMode;
		this.customResultMapper = customResultMapper;
		this.isRqbV2Query = isRqbV2Query;
	}
	async run(placeholderValues = {}) {
		const { logger, query, client } = this;
		const params = fillPlaceholders(query.params, placeholderValues);
		logger.logQuery(query.sql, params);
		return await this.queryWithCache(query.sql, params, async () => {
			return await client.unsafe(query.sql, params);
		});
	}
	async all(placeholderValues = {}) {
		if (this.isRqbV2Query) return this.allRqbV2(placeholderValues);
		const { logger, query, fields, joinsNotNullableMap, customResultMapper, client } = this;
		if (!fields && !customResultMapper) {
			const params = fillPlaceholders(query.params, placeholderValues);
			logger.logQuery(query.sql, params);
			return await this.queryWithCache(query.sql, params, async () => {
				return await client.unsafe(query.sql, params);
			});
		}
		const rows = await this.values(placeholderValues);
		if (customResultMapper) return customResultMapper(rows);
		return rows.map((row) => mapResultRow(fields, row, joinsNotNullableMap));
	}
	async allRqbV2(placeholderValues = {}) {
		const { logger, query, customResultMapper, client } = this;
		const params = fillPlaceholders(query.params, placeholderValues);
		logger.logQuery(query.sql, params);
		return customResultMapper(await client.unsafe(query.sql, params));
	}
	async get(placeholderValues = {}) {
		if (this.isRqbV2Query) return this.getRqbV2(placeholderValues);
		const { logger, query, fields, joinsNotNullableMap, customResultMapper, client } = this;
		if (!fields && !customResultMapper) {
			const params = fillPlaceholders(query.params, placeholderValues);
			logger.logQuery(query.sql, params);
			return await this.queryWithCache(query.sql, params, async () => {
				return (await client.unsafe(query.sql, params))[0];
			});
		}
		const rows = await this.values(placeholderValues);
		const row = rows[0];
		if (customResultMapper) return customResultMapper(rows);
		if (row === void 0) return row;
		return mapResultRow(fields, row, joinsNotNullableMap);
	}
	async getRqbV2(placeholderValues = {}) {
		const { logger, query, customResultMapper, client } = this;
		const params = fillPlaceholders(query.params, placeholderValues);
		logger.logQuery(query.sql, params);
		const row = (await client.unsafe(query.sql, params))[0];
		if (row === void 0) return row;
		return customResultMapper([row]);
	}
	async values(placeholderValues = {}) {
		const { client, logger, query } = this;
		const params = fillPlaceholders(query.params, placeholderValues);
		logger.logQuery(query.sql, params);
		return await this.queryWithCache(query.sql, params, async () => {
			return await client.unsafe(query.sql, params).values();
		});
	}
	/** @internal */
	isResponseInArrayMode() {
		return this._isResponseInArrayMode;
	}
};

//#endregion
export { BunSQLitePreparedQuery, BunSQLiteSession, BunSQLiteTransaction };
//# sourceMappingURL=session.js.map