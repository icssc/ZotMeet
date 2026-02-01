import { entityKind } from "../entity.cjs";
import { Query, SQL } from "../sql/sql.cjs";
import { Assume } from "../utils.cjs";
import * as V1 from "../_relations.cjs";
import { CockroachDialect } from "../cockroach-core/dialect.cjs";
import { CockroachPreparedQuery, CockroachQueryResultHKT, CockroachSession, CockroachTransactionConfig, PreparedQueryConfig } from "../cockroach-core/session.cjs";
import { SelectedFieldsOrdered } from "../cockroach-core/query-builders/select.types.cjs";
import { Logger } from "../logger.cjs";
import pg, { Client, PoolClient, QueryResult, QueryResultRow } from "pg";
import { CockroachTransaction as CockroachTransaction$1 } from "../cockroach-core/index.cjs";

//#region src/cockroach/session.d.ts
type NodeCockroachClient = pg.Pool | PoolClient | Client;
declare class NodeCockroachPreparedQuery<T extends PreparedQueryConfig> extends CockroachPreparedQuery<T> {
  private client;
  private params;
  private logger;
  private fields;
  private _isResponseInArrayMode;
  private customResultMapper?;
  static readonly [entityKind]: string;
  private rawQueryConfig;
  private queryConfig;
  constructor(client: NodeCockroachClient, queryString: string, params: unknown[], logger: Logger, fields: SelectedFieldsOrdered | undefined, name: string | undefined, _isResponseInArrayMode: boolean, customResultMapper?: ((rows: unknown[][]) => T["execute"]) | undefined);
  execute(placeholderValues?: Record<string, unknown> | undefined): Promise<T['execute']>;
  all(placeholderValues?: Record<string, unknown> | undefined): Promise<T['all']>;
}
interface NodeCockroachSessionOptions {
  logger?: Logger;
}
declare class NodeCockroachSession<TFullSchema extends Record<string, unknown>, TSchema extends V1.TablesRelationalConfig> extends CockroachSession<NodeCockroachQueryResultHKT, TFullSchema, TSchema> {
  private client;
  private schema;
  private options;
  static readonly [entityKind]: string;
  private logger;
  constructor(client: NodeCockroachClient, dialect: CockroachDialect, schema: V1.RelationalSchemaConfig<TSchema> | undefined, options?: NodeCockroachSessionOptions);
  prepareQuery<T extends PreparedQueryConfig = PreparedQueryConfig>(query: Query, fields: SelectedFieldsOrdered | undefined, name: string | undefined, isResponseInArrayMode: boolean, customResultMapper?: (rows: unknown[][]) => T['execute']): CockroachPreparedQuery<T>;
  transaction<T>(transaction: (tx: NodeCockroachTransaction<TFullSchema, TSchema>) => Promise<T>, config?: CockroachTransactionConfig | undefined): Promise<T>;
  count(sql: SQL): Promise<number>;
}
declare class NodeCockroachTransaction<TFullSchema extends Record<string, unknown>, TSchema extends V1.TablesRelationalConfig> extends CockroachTransaction$1<NodeCockroachQueryResultHKT, TFullSchema, TSchema> {
  static readonly [entityKind]: string;
  transaction<T>(transaction: (tx: NodeCockroachTransaction<TFullSchema, TSchema>) => Promise<T>): Promise<T>;
}
interface NodeCockroachQueryResultHKT extends CockroachQueryResultHKT {
  type: QueryResult<Assume<this['row'], QueryResultRow>>;
}
//#endregion
export { NodeCockroachClient, NodeCockroachPreparedQuery, NodeCockroachQueryResultHKT, NodeCockroachSession, NodeCockroachSessionOptions, NodeCockroachTransaction };
//# sourceMappingURL=session.d.cts.map