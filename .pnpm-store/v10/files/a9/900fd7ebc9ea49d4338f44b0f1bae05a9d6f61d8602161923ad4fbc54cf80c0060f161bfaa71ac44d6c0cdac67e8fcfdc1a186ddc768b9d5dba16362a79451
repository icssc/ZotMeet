import { entityKind } from "../entity.cjs";
import { Query } from "../sql/sql.cjs";
import * as V1 from "../_relations.cjs";
import { AnyRelations } from "../relations.cjs";
import { SQLiteSyncDialect } from "../sqlite-core/dialect.cjs";
import { PreparedQueryConfig, SQLiteExecuteMethod, SQLitePreparedQuery, SQLiteSession, SQLiteTransactionConfig } from "../sqlite-core/session.cjs";
import { Logger } from "../logger.cjs";
import { SQLiteTransaction as SQLiteTransaction$1 } from "../sqlite-core/index.cjs";
import { SelectedFieldsOrdered as SelectedFieldsOrdered$1 } from "../sqlite-core/query-builders/select.types.cjs";
import { SQLiteDatabase, SQLiteRunResult, SQLiteStatement } from "expo-sqlite";

//#region src/expo-sqlite/session.d.ts
interface ExpoSQLiteSessionOptions {
  logger?: Logger;
}
type PreparedQueryConfig$2 = Omit<PreparedQueryConfig, 'statement' | 'run'>;
declare class ExpoSQLiteSession<TFullSchema extends Record<string, unknown>, TRelations extends AnyRelations, TSchema extends V1.TablesRelationalConfig> extends SQLiteSession<'sync', SQLiteRunResult, TFullSchema, TRelations, TSchema> {
  private client;
  private relations;
  private schema;
  static readonly [entityKind]: string;
  private logger;
  constructor(client: SQLiteDatabase, dialect: SQLiteSyncDialect, relations: TRelations, schema: V1.RelationalSchemaConfig<TSchema> | undefined, options?: ExpoSQLiteSessionOptions);
  prepareQuery<T extends Omit<PreparedQueryConfig$2, 'run'>>(query: Query, fields: SelectedFieldsOrdered$1 | undefined, executeMethod: SQLiteExecuteMethod, isResponseInArrayMode: boolean, customResultMapper?: (rows: unknown[][]) => unknown): ExpoSQLitePreparedQuery<T>;
  prepareRelationalQuery<T extends Omit<PreparedQueryConfig$2, 'run'>>(query: Query, fields: SelectedFieldsOrdered$1 | undefined, executeMethod: SQLiteExecuteMethod, customResultMapper: (rows: Record<string, unknown>[]) => unknown): ExpoSQLitePreparedQuery<T, true>;
  transaction<T>(transaction: (tx: ExpoSQLiteTransaction<TFullSchema, TRelations, TSchema>) => T, config?: SQLiteTransactionConfig): T;
}
declare class ExpoSQLiteTransaction<TFullSchema extends Record<string, unknown>, TRelations extends AnyRelations, TSchema extends V1.TablesRelationalConfig> extends SQLiteTransaction$1<'sync', SQLiteRunResult, TFullSchema, TRelations, TSchema> {
  static readonly [entityKind]: string;
  transaction<T>(transaction: (tx: ExpoSQLiteTransaction<TFullSchema, TRelations, TSchema>) => T): T;
}
declare class ExpoSQLitePreparedQuery<T extends PreparedQueryConfig$2 = PreparedQueryConfig$2, TIsRqbV2 extends boolean = false> extends SQLitePreparedQuery<{
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
  constructor(stmt: SQLiteStatement, query: Query, logger: Logger, fields: SelectedFieldsOrdered$1 | undefined, executeMethod: SQLiteExecuteMethod, _isResponseInArrayMode: boolean, customResultMapper?: ((rows: TIsRqbV2 extends true ? Record<string, unknown>[] : unknown[][]) => unknown) | undefined, isRqbV2Query?: TIsRqbV2 | undefined);
  run(placeholderValues?: Record<string, unknown>): SQLiteRunResult;
  all(placeholderValues?: Record<string, unknown>): T['all'];
  private allRqbV2;
  get(placeholderValues?: Record<string, unknown>): T['get'];
  private getRqbV2;
  values(placeholderValues?: Record<string, unknown>): T['values'];
}
//#endregion
export { ExpoSQLitePreparedQuery, ExpoSQLiteSession, ExpoSQLiteSessionOptions, ExpoSQLiteTransaction };
//# sourceMappingURL=session.d.cts.map