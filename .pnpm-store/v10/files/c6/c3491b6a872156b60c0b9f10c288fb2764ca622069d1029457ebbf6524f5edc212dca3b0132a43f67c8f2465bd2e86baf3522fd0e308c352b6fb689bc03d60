import { getValueFromDataApi, toValueParam } from "../common/index.js";
import { entityKind } from "../../entity.js";
import { mapResultRow } from "../../utils.js";
import { fillPlaceholders, sql } from "../../sql/sql.js";
import { PgAsyncPreparedQuery, PgAsyncSession, PgAsyncTransaction } from "../../pg-core/async/session.js";
import { NoopCache } from "../../cache/core/cache.js";
import { BeginTransactionCommand, CommitTransactionCommand, ExecuteStatementCommand, RollbackTransactionCommand } from "@aws-sdk/client-rds-data";

//#region src/aws-data-api/pg/session.ts
var AwsDataApiPreparedQuery = class extends PgAsyncPreparedQuery {
	static [entityKind] = "AwsDataApiPreparedQuery";
	rawQuery;
	constructor(client, queryString, params, typings, options, cache, queryMetadata, cacheConfig, fields, transactionId, _isResponseInArrayMode, customResultMapper, isRqbV2Query) {
		super({
			sql: queryString,
			params
		}, cache, queryMetadata, cacheConfig);
		this.client = client;
		this.queryString = queryString;
		this.params = params;
		this.typings = typings;
		this.options = options;
		this.fields = fields;
		this.transactionId = transactionId;
		this._isResponseInArrayMode = _isResponseInArrayMode;
		this.customResultMapper = customResultMapper;
		this.isRqbV2Query = isRqbV2Query;
		this.rawQuery = new ExecuteStatementCommand({
			sql: queryString,
			parameters: [],
			secretArn: options.secretArn,
			resourceArn: options.resourceArn,
			database: options.database,
			transactionId,
			includeResultMetadata: isRqbV2Query || !fields && !customResultMapper
		});
	}
	async execute(placeholderValues = {}) {
		if (this.isRqbV2Query) return this.executeRqbV2(placeholderValues);
		const { fields, joinsNotNullableMap, customResultMapper } = this;
		const result = await this.values(placeholderValues);
		if (!fields && !customResultMapper) {
			const { columnMetadata, rows } = result;
			if (!columnMetadata) return result;
			const mappedRows = rows.map((sourceRow) => {
				const row = {};
				for (const [index, value] of sourceRow.entries()) {
					const metadata = columnMetadata[index];
					if (!metadata) throw new Error(`Unexpected state: no column metadata found for index ${index}. Please report this issue on GitHub: https://github.com/drizzle-team/drizzle-orm/issues/new/choose`);
					if (!metadata.name) throw new Error(`Unexpected state: no column name for index ${index} found in the column metadata. Please report this issue on GitHub: https://github.com/drizzle-team/drizzle-orm/issues/new/choose`);
					row[metadata.name] = value;
				}
				return row;
			});
			return Object.assign(result, { rows: mappedRows });
		}
		return customResultMapper ? customResultMapper(result.rows) : result.rows.map((row) => mapResultRow(fields, row, joinsNotNullableMap));
	}
	async executeRqbV2(placeholderValues = {}) {
		const { customResultMapper } = this;
		const { columnMetadata, rows } = await this.values(placeholderValues);
		if (!columnMetadata) return customResultMapper(rows);
		return customResultMapper(rows.map((sourceRow) => {
			const row = {};
			for (const [index, value] of sourceRow.entries()) {
				const metadata = columnMetadata[index];
				if (!metadata) throw new Error(`Unexpected state: no column metadata found for index ${index}. Please report this issue on GitHub: https://github.com/drizzle-team/drizzle-orm/issues/new/choose`);
				if (!metadata.name) throw new Error(`Unexpected state: no column name for index ${index} found in the column metadata. Please report this issue on GitHub: https://github.com/drizzle-team/drizzle-orm/issues/new/choose`);
				row[metadata.name] = value;
			}
			return row;
		}));
	}
	async all(placeholderValues) {
		const result = await this.execute(placeholderValues);
		if (!this.fields && !this.customResultMapper) return result.rows;
		return result;
	}
	async values(placeholderValues = {}) {
		const params = fillPlaceholders(this.params, placeholderValues ?? {});
		this.rawQuery.input.parameters = params.map((param, index) => ({
			name: `${index + 1}`,
			...toValueParam(param, this.typings[index])
		}));
		this.options.logger?.logQuery(this.rawQuery.input.sql, this.rawQuery.input.parameters);
		const result = await this.queryWithCache(this.queryString, params, async () => {
			return await this.client.send(this.rawQuery);
		});
		const rows = result.records?.map((row) => {
			return row.map((field) => getValueFromDataApi(field));
		}) ?? [];
		return {
			...result,
			rows
		};
	}
	/** @internal */
	mapResultRows(records, columnMetadata) {
		return records.map((record) => {
			const row = {};
			for (const [index, field] of record.entries()) {
				const { name } = columnMetadata[index];
				row[name ?? index] = getValueFromDataApi(field);
			}
			return row;
		});
	}
	/** @internal */
	isResponseInArrayMode() {
		return this._isResponseInArrayMode;
	}
};
var AwsDataApiSession = class AwsDataApiSession extends PgAsyncSession {
	static [entityKind] = "AwsDataApiSession";
	/** @internal */
	rawQuery;
	cache;
	constructor(client, dialect, relations, schema, options, transactionId) {
		super(dialect);
		this.client = client;
		this.relations = relations;
		this.schema = schema;
		this.options = options;
		this.transactionId = transactionId;
		this.rawQuery = {
			secretArn: options.secretArn,
			resourceArn: options.resourceArn,
			database: options.database
		};
		this.cache = options.cache ?? new NoopCache();
	}
	prepareQuery(query, fields, name, isResponseInArrayMode, customResultMapper, queryMetadata, cacheConfig, transactionId) {
		return new AwsDataApiPreparedQuery(this.client, query.sql, query.params, query.typings ?? [], this.options, this.cache, queryMetadata, cacheConfig, fields, transactionId ?? this.transactionId, isResponseInArrayMode, customResultMapper);
	}
	prepareRelationalQuery(query, fields, name, customResultMapper, transactionId) {
		return new AwsDataApiPreparedQuery(this.client, query.sql, query.params, query.typings ?? [], this.options, this.cache, void 0, void 0, fields, transactionId ?? this.transactionId, false, customResultMapper, true);
	}
	execute(query) {
		return this.prepareQuery(this.dialect.sqlToQuery(query), void 0, void 0, false, void 0, void 0, void 0, this.transactionId).execute();
	}
	async transaction(transaction, config) {
		const { transactionId } = await this.client.send(new BeginTransactionCommand(this.rawQuery));
		const session = new AwsDataApiSession(this.client, this.dialect, this.relations, this.schema, this.options, transactionId);
		const tx = new AwsDataApiTransaction(this.dialect, session, this.relations, this.schema, void 0, true);
		if (config) await tx.setTransaction(config);
		try {
			const result = await transaction(tx);
			await this.client.send(new CommitTransactionCommand({
				...this.rawQuery,
				transactionId
			}));
			return result;
		} catch (e) {
			await this.client.send(new RollbackTransactionCommand({
				...this.rawQuery,
				transactionId
			}));
			throw e;
		}
	}
};
var AwsDataApiTransaction = class AwsDataApiTransaction extends PgAsyncTransaction {
	static [entityKind] = "AwsDataApiTransaction";
	async transaction(transaction) {
		const savepointName = `sp${this.nestedIndex + 1}`;
		const tx = new AwsDataApiTransaction(this.dialect, this.session, this.relations, this.schema, this.nestedIndex + 1);
		await this.session.execute(sql.raw(`savepoint ${savepointName}`));
		try {
			const result = await transaction(tx);
			await this.session.execute(sql.raw(`release savepoint ${savepointName}`));
			return result;
		} catch (e) {
			await this.session.execute(sql.raw(`rollback to savepoint ${savepointName}`));
			throw e;
		}
	}
};

//#endregion
export { AwsDataApiPreparedQuery, AwsDataApiSession, AwsDataApiTransaction };
//# sourceMappingURL=session.js.map