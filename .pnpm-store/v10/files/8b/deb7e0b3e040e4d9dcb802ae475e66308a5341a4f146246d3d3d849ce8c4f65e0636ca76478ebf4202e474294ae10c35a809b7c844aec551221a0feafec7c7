import { entityKind } from "../entity.js";
import { DrizzleConfig } from "../utils.js";
import { BaseSQLiteDatabase } from "../sqlite-core/db.js";
import { AnyRelations, EmptyRelations } from "../relations.js";
import { Database } from "bun:sqlite";

//#region src/bun-sqlite/driver.d.ts
declare class SQLiteBunDatabase<TSchema extends Record<string, unknown> = Record<string, never>, TRelations extends AnyRelations = EmptyRelations> extends BaseSQLiteDatabase<'sync', void, TSchema, TRelations> {
  static readonly [entityKind]: string;
}
type DrizzleSqliteBunDatabaseOptions = {
  /**
   * Open the database as read-only (no write operations, no create).
   *
   * Equivalent to {@link constants.SQLITE_OPEN_READONLY}
   */
  readonly?: boolean;
  /**
   * Allow creating a new database
   *
   * Equivalent to {@link constants.SQLITE_OPEN_CREATE}
   */
  create?: boolean;
  /**
   * Open the database as read-write
   *
   * Equivalent to {@link constants.SQLITE_OPEN_READWRITE}
   */
  readwrite?: boolean;
};
type DrizzleBunSqliteDatabaseConfig = ({
  source?: string;
} & DrizzleSqliteBunDatabaseOptions) | string | undefined;
declare function drizzle<TSchema extends Record<string, unknown> = Record<string, never>, TRelations extends AnyRelations = EmptyRelations, TClient extends Database = Database>(...params: [] | [string] | [string, DrizzleConfig<TSchema, TRelations>] | [(DrizzleConfig<TSchema, TRelations> & ({
  connection?: DrizzleBunSqliteDatabaseConfig;
} | {
  client: TClient;
}))]): SQLiteBunDatabase<TSchema, TRelations> & {
  $client: TClient;
};
declare namespace drizzle {
  function mock<TSchema extends Record<string, unknown> = Record<string, never>, TRelations extends AnyRelations = EmptyRelations>(config?: DrizzleConfig<TSchema, TRelations>): SQLiteBunDatabase<TSchema, TRelations> & {
    $client: '$client is not available on drizzle.mock()';
  };
}
//#endregion
export { DrizzleBunSqliteDatabaseConfig, SQLiteBunDatabase, drizzle };
//# sourceMappingURL=driver.d.ts.map