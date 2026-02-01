const require_rolldown_runtime = require('../_virtual/rolldown_runtime.cjs');
let __entity_ts = require("../entity.cjs");
let __column_ts = require("../column.cjs");
let __utils_ts = require("../utils.cjs");
let __sql_sql_ts = require("../sql/sql.cjs");
let __logger_ts = require("../logger.cjs");
let __cache_core_index_ts = require("../cache/core/index.cjs");
let __mysql_core_session_ts = require("../mysql-core/session.cjs");

//#region src/planetscale-serverless/session.ts
var PlanetScalePreparedQuery = class extends __mysql_core_session_ts.MySqlPreparedQuery {
	static [__entity_ts.entityKind] = "PlanetScalePreparedQuery";
	rawQuery = { as: "object" };
	query = { as: "array" };
	constructor(client, queryString, params, logger, cache, queryMetadata, cacheConfig, fields, customResultMapper, generatedIds, returningIds, isRqbV2Query) {
		super(cache, queryMetadata, cacheConfig);
		this.client = client;
		this.queryString = queryString;
		this.params = params;
		this.logger = logger;
		this.fields = fields;
		this.customResultMapper = customResultMapper;
		this.generatedIds = generatedIds;
		this.returningIds = returningIds;
		this.isRqbV2Query = isRqbV2Query;
	}
	async execute(placeholderValues = {}) {
		if (this.isRqbV2Query) return this.executeRqbV2(placeholderValues);
		const params = (0, __sql_sql_ts.fillPlaceholders)(this.params, placeholderValues);
		this.logger.logQuery(this.queryString, params);
		const { fields, client, queryString, rawQuery, query, joinsNotNullableMap, customResultMapper, returningIds, generatedIds } = this;
		if (!fields && !customResultMapper) {
			const res = await this.queryWithCache(queryString, params, async () => {
				return await client.execute(queryString, params, rawQuery);
			});
			const insertId = Number.parseFloat(res.insertId);
			const affectedRows = res.rowsAffected;
			if (returningIds) {
				const returningResponse = [];
				let j = 0;
				for (let i = insertId; i < insertId + affectedRows; i++) {
					for (const column of returningIds) {
						const key = returningIds[0].path[0];
						if ((0, __entity_ts.is)(column.field, __column_ts.Column)) {
							if (column.field.primary && column.field.autoIncrement) returningResponse.push({ [key]: i });
							if (column.field.defaultFn && generatedIds) returningResponse.push({ [key]: generatedIds[j][key] });
						}
					}
					j++;
				}
				return returningResponse;
			}
			return res;
		}
		const { rows } = await this.queryWithCache(queryString, params, async () => {
			return await client.execute(queryString, params, query);
		});
		if (customResultMapper) return customResultMapper(rows);
		return rows.map((row) => (0, __utils_ts.mapResultRow)(fields, row, joinsNotNullableMap));
	}
	async executeRqbV2(placeholderValues = {}) {
		const params = (0, __sql_sql_ts.fillPlaceholders)(this.params, placeholderValues);
		this.logger.logQuery(this.queryString, params);
		const { client, queryString, rawQuery, customResultMapper } = this;
		return customResultMapper((await client.execute(queryString, params, rawQuery)).rows);
	}
	iterator(_placeholderValues) {
		throw new Error("Streaming is not supported by the PlanetScale Serverless driver");
	}
};
var PlanetscaleSession = class PlanetscaleSession extends __mysql_core_session_ts.MySqlSession {
	static [__entity_ts.entityKind] = "PlanetscaleSession";
	logger;
	client;
	cache;
	constructor(baseClient, dialect, tx, relations, schema, options = {}) {
		super(dialect);
		this.baseClient = baseClient;
		this.relations = relations;
		this.schema = schema;
		this.options = options;
		this.client = tx ?? baseClient;
		this.logger = options.logger ?? new __logger_ts.NoopLogger();
		this.cache = options.cache ?? new __cache_core_index_ts.NoopCache();
	}
	prepareQuery(query, fields, customResultMapper, generatedIds, returningIds, queryMetadata, cacheConfig) {
		return new PlanetScalePreparedQuery(this.client, query.sql, query.params, this.logger, this.cache, queryMetadata, cacheConfig, fields, customResultMapper, generatedIds, returningIds);
	}
	prepareRelationalQuery(query, fields, customResultMapper, generatedIds, returningIds) {
		return new PlanetScalePreparedQuery(this.client, query.sql, query.params, this.logger, this.cache, void 0, void 0, fields, customResultMapper, generatedIds, returningIds, true);
	}
	async query(query, params) {
		this.logger.logQuery(query, params);
		return await this.client.execute(query, params, { as: "array" });
	}
	async queryObjects(query, params) {
		return this.client.execute(query, params, { as: "object" });
	}
	all(query) {
		const querySql = this.dialect.sqlToQuery(query);
		this.logger.logQuery(querySql.sql, querySql.params);
		return this.client.execute(querySql.sql, querySql.params, { as: "object" }).then((eQuery) => eQuery.rows);
	}
	async count(sql$1) {
		const res = await this.execute(sql$1);
		return Number(res["rows"][0]["count"]);
	}
	transaction(transaction) {
		return this.baseClient.transaction((pstx) => {
			const session = new PlanetscaleSession(this.baseClient, this.dialect, pstx, this.relations, this.schema, this.options);
			return transaction(new PlanetScaleTransaction(this.dialect, session, this.relations, this.schema));
		});
	}
};
var PlanetScaleTransaction = class PlanetScaleTransaction extends __mysql_core_session_ts.MySqlTransaction {
	static [__entity_ts.entityKind] = "PlanetScaleTransaction";
	constructor(dialect, session, relations, schema, nestedIndex = 0) {
		super(dialect, session, relations, schema, nestedIndex, "planetscale");
	}
	async transaction(transaction) {
		const savepointName = `sp${this.nestedIndex + 1}`;
		const tx = new PlanetScaleTransaction(this.dialect, this.session, this.relations, this.schema, this.nestedIndex + 1);
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
exports.PlanetScalePreparedQuery = PlanetScalePreparedQuery;
exports.PlanetScaleTransaction = PlanetScaleTransaction;
exports.PlanetscaleSession = PlanetscaleSession;
//# sourceMappingURL=session.cjs.map