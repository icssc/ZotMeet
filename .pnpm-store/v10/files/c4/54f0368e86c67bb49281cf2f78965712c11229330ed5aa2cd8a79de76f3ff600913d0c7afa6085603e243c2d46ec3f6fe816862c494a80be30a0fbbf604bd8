import { entityKind } from "../entity.js";
import { Query } from "../sql/sql.js";
import * as V1 from "../_relations.js";
import { Logger } from "../logger.js";
import { SQLiteSyncDialect } from "../sqlite-core/dialect.js";
import { SQLiteTransaction } from "../sqlite-core/index.js";
import { PreparedQueryConfig as PreparedQueryConfig$1, SQLiteExecuteMethod as SQLiteExecuteMethod$1, SQLitePreparedQuery as SQLitePreparedQuery$1, SQLiteSession as SQLiteSession$1, SQLiteTransactionConfig as SQLiteTransactionConfig$1 } from "../sqlite-core/session.js";
import { AnyRelations } from "../relations.js";
import { SelectedFieldsOrdered as SelectedFieldsOrdered$1 } from "../sqlite-core/query-builders/select.types.js";
import { Database } from "sql.js";

//#region src/sql-js/session.d.ts
interface SQLJsSessionOptions {
  logger?: Logger;
}
type PreparedQueryConfig$2 = Omit<PreparedQueryConfig$1, 'statement' | 'run'>;
declare class SQLJsSession<TFullSchema extends Record<string, unknown>, TRelations extends AnyRelations, TSchema extends V1.TablesRelationalConfig> extends SQLiteSession$1<'sync', void, TFullSchema, TRelations, TSchema> {
  private client;
  private relations;
  private schema;
  static readonly [entityKind]: string;
  private logger;
  constructor(client: Database, dialect: SQLiteSyncDialect, relations: TRelations, schema: V1.RelationalSchemaConfig<TSchema> | undefined, options?: SQLJsSessionOptions);
  prepareQuery<T extends Omit<PreparedQueryConfig$2, 'run'>>(query: Query, fields: SelectedFieldsOrdered$1 | undefined, executeMethod: SQLiteExecuteMethod$1, isResponseInArrayMode: boolean): PreparedQuery<T>;
  prepareRelationalQuery<T extends Omit<PreparedQueryConfig$2, 'run'>>(query: Query, fields: SelectedFieldsOrdered$1 | undefined, executeMethod: SQLiteExecuteMethod$1, customResultMapper: (rows: Record<string, unknown>[]) => unknown): PreparedQuery<T, true>;
  transaction<T>(transaction: (tx: SQLJsTransaction<TFullSchema, TRelations, TSchema>) => T, config?: SQLiteTransactionConfig$1): T;
}
declare class SQLJsTransaction<TFullSchema extends Record<string, unknown>, TRelations extends AnyRelations, TSchema extends V1.TablesRelationalConfig> extends SQLiteTransaction<'sync', void, TFullSchema, TRelations, TSchema> {
  static readonly [entityKind]: string;
  transaction<T>(transaction: (tx: SQLJsTransaction<TFullSchema, TRelations, TSchema>) => T): T;
}
declare class PreparedQuery<T extends PreparedQueryConfig$2 = PreparedQueryConfig$2, TIsRqbV2 extends boolean = false> extends SQLitePreparedQuery$1<{
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
  constructor(client: Database, query: Query, logger: Logger, fields: SelectedFieldsOrdered$1 | undefined, executeMethod: SQLiteExecuteMethod$1, _isResponseInArrayMode: boolean, customResultMapper?: ((rows: TIsRqbV2 extends true ? Record<string, unknown>[] : unknown[][], mapColumnValue?: (value: unknown) => unknown) => unknown) | undefined, isRqbV2Query?: TIsRqbV2 | undefined);
  run(placeholderValues?: Record<string, unknown>): void;
  all(placeholderValues?: Record<string, unknown>): T['all'];
  private allRqbV2;
  get(placeholderValues?: Record<string, unknown>): T['get'];
  private getRqbV2;
  values(placeholderValues?: Record<string, unknown>): T['values'];
}
//#endregion
export { PreparedQuery, SQLJsSession, SQLJsSessionOptions, SQLJsTransaction };
//# sourceMappingURL=session.d.ts.map