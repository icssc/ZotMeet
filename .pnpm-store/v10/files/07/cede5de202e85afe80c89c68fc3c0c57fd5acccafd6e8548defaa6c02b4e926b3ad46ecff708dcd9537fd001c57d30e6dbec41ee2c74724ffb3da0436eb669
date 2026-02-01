import { entityKind, is } from "../entity.js";
import { Column } from "../column.js";
import { mapResultRow } from "../utils.js";
import { fillPlaceholders } from "../sql/sql.js";
import { NoopLogger } from "../logger.js";
import { SingleStorePreparedQuery, SingleStoreSession } from "../singlestore-core/session.js";
import { SingleStoreTransaction as SingleStoreTransaction$1 } from "../singlestore-core/index.js";

//#region src/singlestore-proxy/session.ts
var SingleStoreRemoteSession = class extends SingleStoreSession {
	static [entityKind] = "SingleStoreRemoteSession";
	logger;
	constructor(client, dialect, relations, schema, options) {
		super(dialect);
		this.client = client;
		this.relations = relations;
		this.schema = schema;
		this.logger = options.logger ?? new NoopLogger();
	}
	prepareQuery(query, fields, customResultMapper, generatedIds, returningIds) {
		return new PreparedQuery(this.client, query.sql, query.params, this.logger, fields, customResultMapper, generatedIds, returningIds);
	}
	prepareRelationalQuery(query, fields, customResultMapper, generatedIds, returningIds) {
		return new PreparedQuery(this.client, query.sql, query.params, this.logger, fields, customResultMapper, generatedIds, returningIds, true);
	}
	all(query) {
		const querySql = this.dialect.sqlToQuery(query);
		this.logger.logQuery(querySql.sql, querySql.params);
		return this.client(querySql.sql, querySql.params, "all").then(({ rows }) => rows);
	}
	async transaction(_transaction, _config) {
		throw new Error("Transactions are not supported by the SingleStore Proxy driver");
	}
};
var SingleStoreProxyTransaction = class extends SingleStoreTransaction$1 {
	static [entityKind] = "SingleStoreProxyTransaction";
	async transaction(_transaction) {
		throw new Error("Transactions are not supported by the SingleStore Proxy driver");
	}
};
var PreparedQuery = class extends SingleStorePreparedQuery {
	static [entityKind] = "SingleStoreProxyPreparedQuery";
	constructor(client, queryString, params, logger, fields, customResultMapper, generatedIds, returningIds, isRqbV2Query) {
		super();
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
		const params = fillPlaceholders(this.params, placeholderValues);
		const { fields, client, queryString, logger, joinsNotNullableMap, customResultMapper, returningIds, generatedIds } = this;
		logger.logQuery(queryString, params);
		if (!fields && !customResultMapper) {
			const { rows: data } = await client(queryString, params, "execute");
			const insertId = data[0].insertId;
			const affectedRows = data[0].affectedRows;
			if (returningIds) {
				const returningResponse = [];
				let j = 0;
				for (let i = insertId; i < insertId + affectedRows; i++) {
					for (const column of returningIds) {
						const key = returningIds[0].path[0];
						if (is(column.field, Column)) {
							if (column.field.primary && column.field.autoIncrement) returningResponse.push({ [key]: i });
							if (column.field.defaultFn && generatedIds) returningResponse.push({ [key]: generatedIds[j][key] });
						}
					}
					j++;
				}
				return returningResponse;
			}
			return data;
		}
		const { rows } = await client(queryString, params, "all");
		if (customResultMapper) return customResultMapper(rows);
		return rows.map((row) => mapResultRow(fields, row, joinsNotNullableMap));
	}
	async executeRqbV2(placeholderValues = {}) {
		const params = fillPlaceholders(this.params, placeholderValues);
		const { client, queryString, logger, customResultMapper } = this;
		logger.logQuery(queryString, params);
		const { rows: res } = await client(queryString, params, "execute");
		const rows = res[0];
		return customResultMapper(rows);
	}
	iterator(_placeholderValues = {}) {
		throw new Error("Streaming is not supported by the SingleStore Proxy driver");
	}
};

//#endregion
export { PreparedQuery, SingleStoreProxyTransaction, SingleStoreRemoteSession };
//# sourceMappingURL=session.js.map