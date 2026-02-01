const require_rolldown_runtime = require('../../_virtual/rolldown_runtime.cjs');
const require_aws_data_api_common_index = require('../common/index.cjs');
let __entity_ts = require("../../entity.cjs");
let __utils_ts = require("../../utils.cjs");
let __sql_sql_ts = require("../../sql/sql.cjs");
let __pg_core_async_session_ts = require("../../pg-core/async/session.cjs");
let __cache_core_cache_ts = require("../../cache/core/cache.cjs");
let _aws_sdk_client_rds_data = require("@aws-sdk/client-rds-data");

//#region src/aws-data-api/pg/session.ts
var AwsDataApiPreparedQuery = class extends __pg_core_async_session_ts.PgAsyncPreparedQuery {
	static [__entity_ts.entityKind] = "AwsDataApiPreparedQuery";
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
		this.rawQuery = new _aws_sdk_client_rds_data.ExecuteStatementCommand({
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
		return customResultMapper ? customResultMapper(result.rows) : result.rows.map((row) => (0, __utils_ts.mapResultRow)(fields, row, joinsNotNullableMap));
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
		const params = (0, __sql_sql_ts.fillPlaceholders)(this.params, placeholderValues ?? {});
		this.rawQuery.input.parameters = params.map((param, index) => ({
			name: `${index + 1}`,
			...require_aws_data_api_common_index.toValueParam(param, this.typings[index])
		}));
		this.options.logger?.logQuery(this.rawQuery.input.sql, this.rawQuery.input.parameters);
		const result = await this.queryWithCache(this.queryString, params, async () => {
			return await this.client.send(this.rawQuery);
		});
		const rows = result.records?.map((row) => {
			return row.map((field) => require_aws_data_api_common_index.getValueFromDataApi(field));
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
				row[name ?? index] = require_aws_data_api_common_index.getValueFromDataApi(field);
			}
			return row;
		});
	}
	/** @internal */
	isResponseInArrayMode() {
		return this._isResponseInArrayMode;
	}
};
var AwsDataApiSession = class AwsDataApiSession extends __pg_core_async_session_ts.PgAsyncSession {
	static [__entity_ts.entityKind] = "AwsDataApiSession";
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
		this.cache = options.cache ?? new __cache_core_cache_ts.NoopCache();
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
		const { transactionId } = await this.client.send(new _aws_sdk_client_rds_data.BeginTransactionCommand(this.rawQuery));
		const session = new AwsDataApiSession(this.client, this.dialect, this.relations, this.schema, this.options, transactionId);
		const tx = new AwsDataApiTransaction(this.dialect, session, this.relations, this.schema, void 0, true);
		if (config) await tx.setTransaction(config);
		try {
			const result = await transaction(tx);
			await this.client.send(new _aws_sdk_client_rds_data.CommitTransactionCommand({
				...this.rawQuery,
				transactionId
			}));
			return result;
		} catch (e) {
			await this.client.send(new _aws_sdk_client_rds_data.RollbackTransactionCommand({
				...this.rawQuery,
				transactionId
			}));
			throw e;
		}
	}
};
var AwsDataApiTransaction = class AwsDataApiTransaction extends __pg_core_async_session_ts.PgAsyncTransaction {
	static [__entity_ts.entityKind] = "AwsDataApiTransaction";
	async transaction(transaction) {
		const savepointName = `sp${this.nestedIndex + 1}`;
		const tx = new AwsDataApiTransaction(this.dialect, this.session, this.relations, this.schema, this.nestedIndex + 1);
		await this.session.execute(__sql_sql_ts.sql.raw(`savepoint ${savepointName}`));
		try {
			const result = await transaction(tx);
			await this.session.execute(__sql_sql_ts.sql.raw(`release savepoint ${savepointName}`));
			return result;
		} catch (e) {
			await this.session.execute(__sql_sql_ts.sql.raw(`rollback to savepoint ${savepointName}`));
			throw e;
		}
	}
};

//#endregion
exports.AwsDataApiPreparedQuery = AwsDataApiPreparedQuery;
exports.AwsDataApiSession = AwsDataApiSession;
exports.AwsDataApiTransaction = AwsDataApiTransaction;
//# sourceMappingURL=session.cjs.map