import { entityKind } from "../entity.js";
import { Query } from "../sql/sql.js";
import * as V1 from "../_relations.js";
import { Logger } from "../logger.js";
import { SQLiteSyncDialect } from "../sqlite-core/dialect.js";
import { SQLiteTransaction } from "../sqlite-core/index.js";
import { PreparedQueryConfig as PreparedQueryConfig$1, SQLiteExecuteMethod as SQLiteExecuteMethod$1, SQLitePreparedQuery as SQLitePreparedQuery$1, SQLiteSession as SQLiteSession$1, SQLiteTransactionConfig as SQLiteTransactionConfig$1 } from "../sqlite-core/session.js";
import { AnyRelations } from "../relations.js";
import { SQLiteDatabase, SQLiteRunResult, SQLiteStatement } from "expo-sqlite";
import { SelectedFieldsOrdered as SelectedFieldsOrdered$1 } from "../sqlite-core/query-builders/select.types.js";

//#region src/expo-sqlite/session.d.ts
interface ExpoSQLiteSessionOptions {
  logger?: Logger;
}
type PreparedQueryConfig$2 = Omit<PreparedQueryConfig$1, 'statement' | 'run'>;
declare class ExpoSQLiteSession<TFullSchema extends Record<string, unknown>, TRelations extends AnyRelations, TSchema extends V1.TablesRelationalConfig> extends SQLiteSession$1<'sync', SQLiteRunResult, TFullSchema, TRelations, TSchema> {
  private client;
  private relations;
  private schema;
  static readonly [entityKind]: string;
  private logger;
  constructor(client: SQLiteDatabase, dialect: SQLiteSyncDialect, relations: TRelations, schema: V1.RelationalSchemaConfig<TSchema> | undefined, options?: ExpoSQLiteSessionOptions);
  prepareQuery<T extends Omit<PreparedQueryConfig$2, 'run'>>(query: Query, fields: SelectedFieldsOrdered$1 | undefined, executeMethod: SQLiteExecuteMethod$1, isResponseInArrayMode: boolean, customResultMapper?: (rows: unknown[][]) => unknown): ExpoSQLitePreparedQuery<T>;
  prepareRelationalQuery<T extends Omit<PreparedQueryConfig$2, 'run'>>(query: Query, fields: SelectedFieldsOrdered$1 | undefined, executeMethod: SQLiteExecuteMethod$1, customResultMapper: (rows: Record<string, unknown>[]) => unknown): ExpoSQLitePreparedQuery<T, true>;
  transaction<T>(transaction: (tx: ExpoSQLiteTransaction<TFullSchema, TRelations, TSchema>) => T, config?: SQLiteTransactionConfig$1): T;
}
declare class ExpoSQLiteTransaction<TFullSchema extends Record<string, unknown>, TRelations extends AnyRelations, TSchema extends V1.TablesRelationalConfig> extends SQLiteTransaction<'sync', SQLiteRunResult, TFullSchema, TRelations, TSchema> {
  static readonly [entityKind]: string;
  transaction<T>(transaction: (tx: ExpoSQLiteTransaction<TFullSchema, TRelations, TSchema>) => T): T;
}
declare class ExpoSQLitePreparedQuery<T extends PreparedQueryConfig$2 = PreparedQueryConfig$2, TIsRqbV2 extends boolean = false> extends SQLitePreparedQuery$1<{
  type: 'sync';
  run: SQLiteRunResult;
  all: T['all'];
  get: T['get'];
  values: T['values'];
  execute: T['execute'];
}> {
  private stmt;
  private logger;
  private fields;
  private _isResponseInArrayMode;
  private customResultMapper?;
  private isRqbV2Query?;
  static readonly [entityKind]: string;
  constructor(stmt: SQLiteStatement, query: Query, logger: Logger, fields: SelectedFieldsOrdered$1 | undefined, executeMethod: SQLiteExecuteMethod$1, _isResponseInArrayMode: boolean, customResultMapper?: ((rows: TIsRqbV2 extends true ? Record<string, unknown>[] : unknown[][]) => unknown) | undefined, isRqbV2Query?: TIsRqbV2 | undefined);
  run(placeholderValues?: Record<string, unknown>): SQLiteRunResult;
  all(placeholderValues?: Record<string, unknown>): T['all'];
  private allRqbV2;
  get(placeholderValues?: Record<string, unknown>): T['get'];
  private getRqbV2;
  values(placeholderValues?: Record<string, unknown>): T['values'];
}
//#endregion
export { ExpoSQLitePreparedQuery, ExpoSQLiteSession, ExpoSQLiteSessionOptions, ExpoSQLiteTransaction };
//# sourceMappingURL=session.d.ts.map