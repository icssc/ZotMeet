import { entityKind } from "../entity.cjs";
import { Query } from "../sql/sql.cjs";
import * as V1 from "../_relations.cjs";
import { AnyRelations } from "../relations.cjs";
import { SQLiteSyncDialect } from "../sqlite-core/dialect.cjs";
import { PreparedQueryConfig, SQLiteExecuteMethod, SQLitePreparedQuery, SQLiteSession, SQLiteTransactionConfig } from "../sqlite-core/session.cjs";
import { Logger } from "../logger.cjs";
import { SQLiteTransaction as SQLiteTransaction$1 } from "../sqlite-core/index.cjs";
import { SelectedFieldsOrdered as SelectedFieldsOrdered$1 } from "../sqlite-core/query-builders/select.types.cjs";
import { Database } from "sql.js";

//#region src/sql-js/session.d.ts
interface SQLJsSessionOptions {
  logger?: Logger;
}
type PreparedQueryConfig$2 = Omit<PreparedQueryConfig, 'statement' | 'run'>;
declare class SQLJsSession<TFullSchema extends Record<string, unknown>, TRelations extends AnyRelations, TSchema extends V1.TablesRelationalConfig> extends SQLiteSession<'sync', void, TFullSchema, TRelations, TSchema> {
  private client;
  private relations;
  private schema;
  static readonly [entityKind]: string;
  private logger;
  constructor(client: Database, dialect: SQLiteSyncDialect, relations: TRelations, schema: V1.RelationalSchemaConfig<TSchema> | undefined, options?: SQLJsSessionOptions);
  prepareQuery<T extends Omit<PreparedQueryConfig$2, 'run'>>(query: Query, fields: SelectedFieldsOrdered$1 | undefined, executeMethod: SQLiteExecuteMethod, isResponseInArrayMode: boolean): PreparedQuery<T>;
  prepareRelationalQuery<T extends Omit<PreparedQueryConfig$2, 'run'>>(query: Query, fields: SelectedFieldsOrdered$1 | undefined, executeMethod: SQLiteExecuteMethod, customResultMapper: (rows: Record<string, unknown>[]) => unknown): PreparedQuery<T, true>;
  transaction<T>(transaction: (tx: SQLJsTransaction<TFullSchema, TRelations, TSchema>) => T, config?: SQLiteTransactionConfig): T;
}
declare class SQLJsTransaction<TFullSchema extends Record<string, unknown>, TRelations extends AnyRelations, TSchema extends V1.TablesRelationalConfig> extends SQLiteTransaction$1<'sync', void, TFullSchema, TRelations, TSchema> {
  static readonly [entityKind]: string;
  transaction<T>(transaction: (tx: SQLJsTransaction<TFullSchema, TRelations, TSchema>) => T): T;
}
declare class PreparedQuery<T extends PreparedQueryConfig$2 = PreparedQueryConfig$2, TIsRqbV2 extends boolean = false> extends SQLitePreparedQuery<{
  type: 'sync';
  run: void;
  all: T['all'];
  get: T['get'];
  values: T['values'];
  execute: T['execute'];
}> {
  private client;
  private logger;
  private fields;
  private _isResponseInArrayMode;
  private customResultMapper?;
  private isRqbV2Query?;
  static readonly [entityKind]: string;
  constructor(client: Database, query: Query, logger: Logger, fields: SelectedFieldsOrdered$1 | undefined, executeMethod: SQLiteExecuteMethod, _isResponseInArrayMode: boolean, customResultMapper?: ((rows: TIsRqbV2 extends true ? Record<string, unknown>[] : unknown[][], mapColumnValue?: (value: unknown) => unknown) => unknown) | undefined, isRqbV2Query?: TIsRqbV2 | undefined);
  run(placeholderValues?: Record<string, unknown>): void;
  all(placeholderValues?: Record<string, unknown>): T['all'];
  private allRqbV2;
  get(placeholderValues?: Record<string, unknown>): T['get'];
  private getRqbV2;
  values(placeholderValues?: Record<string, unknown>): T['values'];
}
//#endregion
export { PreparedQuery, SQLJsSession, SQLJsSessionOptions, SQLJsTransaction };
//# sourceMappingURL=session.d.cts.map