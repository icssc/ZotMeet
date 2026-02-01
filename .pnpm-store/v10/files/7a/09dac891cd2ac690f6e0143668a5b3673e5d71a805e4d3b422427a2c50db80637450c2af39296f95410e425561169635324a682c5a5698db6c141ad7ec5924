import { RemoteCallback } from "./driver.cjs";
import { entityKind } from "../entity.cjs";
import { Query, SQL } from "../sql/sql.cjs";
import { Assume } from "../utils.cjs";
import * as V1 from "../_relations.cjs";
import { AnyRelations } from "../relations.cjs";
import { FieldPacket, ResultSetHeader } from "mysql2/promise";
import { SingleStoreDialect } from "../singlestore-core/dialect.cjs";
import { PreparedQueryKind, SingleStorePreparedQuery, SingleStorePreparedQueryConfig, SingleStorePreparedQueryHKT, SingleStoreQueryResultHKT, SingleStoreSession, SingleStoreTransactionConfig } from "../singlestore-core/session.cjs";
import { Logger } from "../logger.cjs";
import { SingleStoreTransaction as SingleStoreTransaction$1 } from "../singlestore-core/index.cjs";
import { SelectedFieldsOrdered } from "../singlestore-core/query-builders/select.types.cjs";

//#region src/singlestore-proxy/session.d.ts
type SingleStoreRawQueryResult = [ResultSetHeader, FieldPacket[]];
interface SingleStoreRemoteSessionOptions {
  logger?: Logger;
}
declare class SingleStoreRemoteSession<TFullSchema extends Record<string, unknown>, TRelations extends AnyRelations, TSchema extends V1.TablesRelationalConfig> extends SingleStoreSession<SingleStoreRemoteQueryResultHKT, SingleStoreRemotePreparedQueryHKT, TFullSchema, TRelations, TSchema> {
  private client;
  private relations;
  private schema;
  static readonly [entityKind]: string;
  private logger;
  constructor(client: RemoteCallback, dialect: SingleStoreDialect, relations: TRelations, schema: V1.RelationalSchemaConfig<TSchema> | undefined, options: SingleStoreRemoteSessionOptions);
  prepareQuery<T extends SingleStorePreparedQueryConfig>(query: Query, fields: SelectedFieldsOrdered | undefined, customResultMapper?: (rows: unknown[][]) => T['execute'], generatedIds?: Record<string, unknown>[], returningIds?: SelectedFieldsOrdered): PreparedQueryKind<SingleStoreRemotePreparedQueryHKT, T>;
  prepareRelationalQuery<T extends SingleStorePreparedQueryConfig>(query: Query, fields: SelectedFieldsOrdered | undefined, customResultMapper: (rows: Record<string, unknown>[]) => T['execute'], generatedIds?: Record<string, unknown>[], returningIds?: SelectedFieldsOrdered): PreparedQueryKind<SingleStoreRemotePreparedQueryHKT, T>;
  all<T = unknown>(query: SQL): Promise<T[]>;
  transaction<T>(_transaction: (tx: SingleStoreProxyTransaction<TFullSchema, TRelations, TSchema>) => Promise<T>, _config?: SingleStoreTransactionConfig): Promise<T>;
}
declare class SingleStoreProxyTransaction<TFullSchema extends Record<string, unknown>, TRelations extends AnyRelations, TSchema extends V1.TablesRelationalConfig> extends SingleStoreTransaction$1<SingleStoreRemoteQueryResultHKT, SingleStoreRemotePreparedQueryHKT, TFullSchema, TRelations, TSchema> {
  static readonly [entityKind]: string;
  transaction<T>(_transaction: (tx: SingleStoreProxyTransaction<TFullSchema, TRelations, TSchema>) => Promise<T>): Promise<T>;
}
declare class PreparedQuery<T extends SingleStorePreparedQueryConfig, TIsRqbV2 extends boolean = false> extends SingleStorePreparedQuery<T> {
  private client;
  private queryString;
  private params;
  private logger;
  private fields;
  private customResultMapper?;
  private generatedIds?;
  private returningIds?;
  private isRqbV2Query?;
  static readonly [entityKind]: string;
  constructor(client: RemoteCallback, queryString: string, params: unknown[], logger: Logger, fields: SelectedFieldsOrdered | undefined, customResultMapper?: ((rows: TIsRqbV2 extends true ? Record<string, unknown>[] : unknown[][]) => T["execute"]) | undefined, generatedIds?: Record<string, unknown>[] | undefined, returningIds?: SelectedFieldsOrdered | undefined, isRqbV2Query?: TIsRqbV2 | undefined);
  execute(placeholderValues?: Record<string, unknown> | undefined): Promise<T['execute']>;
  private executeRqbV2;
  iterator(_placeholderValues?: Record<string, unknown>): AsyncGenerator<T['iterator']>;
}
interface SingleStoreRemoteQueryResultHKT extends SingleStoreQueryResultHKT {
  type: SingleStoreRawQueryResult;
}
interface SingleStoreRemotePreparedQueryHKT extends SingleStorePreparedQueryHKT {
  type: PreparedQuery<Assume<this['config'], SingleStorePreparedQueryConfig>>;
}
//#endregion
export { PreparedQuery, SingleStoreProxyTransaction, SingleStoreRawQueryResult, SingleStoreRemotePreparedQueryHKT, SingleStoreRemoteQueryResultHKT, SingleStoreRemoteSession, SingleStoreRemoteSessionOptions };
//# sourceMappingURL=session.d.cts.map