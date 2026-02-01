import { AutoPool } from "./pool.cjs";
import { entityKind } from "../entity.cjs";
import { Query, SQL } from "../sql/sql.cjs";
import { Assume } from "../utils.cjs";
import * as V1 from "../_relations.cjs";
import { MsSqlDialect } from "../mssql-core/dialect.cjs";
import { MsSqlSession, MsSqlTransaction, MsSqlTransactionConfig, PreparedQuery, PreparedQueryConfig, PreparedQueryHKT, PreparedQueryKind, QueryResultHKT } from "../mssql-core/session.cjs";
import { Logger } from "../logger.cjs";
import { ConnectionPool, IResult } from "mssql";
import { SelectedFieldsOrdered } from "../mssql-core/query-builders/select.types.cjs";

//#region src/node-mssql/session.d.ts
type NodeMsSqlClient = Pick<ConnectionPool, 'request'> | AutoPool;
type MsSqlQueryResult<T extends unknown | unknown[] = any> = IResult<T>;
declare class NodeMsSqlPreparedQuery<T extends PreparedQueryConfig> extends PreparedQuery<T> {
  private client;
  private params;
  private logger;
  private fields;
  private customResultMapper?;
  static readonly [entityKind]: string;
  private rawQuery;
  constructor(client: NodeMsSqlClient, queryString: string, params: unknown[], logger: Logger, fields: SelectedFieldsOrdered | undefined, customResultMapper?: ((rows: unknown[][]) => T["execute"]) | undefined);
  execute(placeholderValues?: Record<string, unknown>): Promise<T['execute']>;
  iterator(placeholderValues?: Record<string, unknown>): AsyncGenerator<T['execute'] extends any[] ? T['execute'][number] : T['execute']>;
}
interface NodeMsSqlSessionOptions {
  logger?: Logger;
}
declare class NodeMsSqlSession<TFullSchema extends Record<string, unknown>, TSchema extends V1.TablesRelationalConfig> extends MsSqlSession<NodeMsSqlQueryResultHKT, NodeMsSqlPreparedQueryHKT, TFullSchema, TSchema> {
  private client;
  private schema;
  private options;
  static readonly [entityKind]: string;
  private logger;
  constructor(client: NodeMsSqlClient, dialect: MsSqlDialect, schema: V1.RelationalSchemaConfig<TSchema> | undefined, options: NodeMsSqlSessionOptions);
  prepareQuery<T extends PreparedQueryConfig>(query: Query, fields: SelectedFieldsOrdered | undefined, customResultMapper?: (rows: unknown[][]) => T['execute']): PreparedQueryKind<NodeMsSqlPreparedQueryHKT, T>;
  all<T = unknown>(query: SQL): Promise<T[]>;
  transaction<T>(transaction: (tx: NodeMsSqlTransaction<TFullSchema, TSchema>) => Promise<T>, config?: MsSqlTransactionConfig): Promise<T>;
}
declare class NodeMsSqlTransaction<TFullSchema extends Record<string, unknown>, TSchema extends V1.TablesRelationalConfig> extends MsSqlTransaction<NodeMsSqlQueryResultHKT, NodeMsSqlPreparedQueryHKT, TFullSchema, TSchema> {
  static readonly [entityKind]: string;
  transaction<T>(transaction: (tx: NodeMsSqlTransaction<TFullSchema, TSchema>) => Promise<T>): Promise<T>;
}
interface NodeMsSqlQueryResultHKT extends QueryResultHKT {
  type: MsSqlQueryResult<this['row']>;
}
interface NodeMsSqlPreparedQueryHKT extends PreparedQueryHKT {
  type: NodeMsSqlPreparedQuery<Assume<this['config'], PreparedQueryConfig>>;
}
//#endregion
export { MsSqlQueryResult, NodeMsSqlClient, NodeMsSqlPreparedQuery, NodeMsSqlPreparedQueryHKT, NodeMsSqlQueryResultHKT, NodeMsSqlSession, NodeMsSqlSessionOptions, NodeMsSqlTransaction };
//# sourceMappingURL=session.d.cts.map