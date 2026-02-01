import { entityKind } from "../entity.cjs";
import { DrizzleConfig } from "../utils.cjs";
import { AnyRelations, EmptyRelations } from "../relations.cjs";
import { Database, Options, RunResult } from "better-sqlite3";
import { BaseSQLiteDatabase } from "../sqlite-core/db.cjs";

//#region src/better-sqlite3/driver.d.ts
type DrizzleBetterSQLite3DatabaseConfig = ({
  source?: string | Buffer;
} & Options) | string | undefined;
declare class BetterSQLite3Database<TSchema extends Record<string, unknown> = Record<string, never>, TRelations extends AnyRelations = EmptyRelations> extends BaseSQLiteDatabase<'sync', RunResult, TSchema, TRelations> {
  static readonly [entityKind]: string;
}
declare function drizzle<TSchema extends Record<string, unknown> = Record<string, never>, TRelations extends AnyRelations = EmptyRelations>(...params: [] | [string] | [string, DrizzleConfig<TSchema, TRelations>] | [(DrizzleConfig<TSchema, TRelations> & ({
  connection?: DrizzleBetterSQLite3DatabaseConfig;
} | {
  client: Database;
}))]): BetterSQLite3Database<TSchema, TRelations> & {
  $client: Database;
};
declare namespace drizzle {
  function mock<TSchema extends Record<string, unknown> = Record<string, never>, TRelations extends AnyRelations = EmptyRelations>(config?: DrizzleConfig<TSchema, TRelations>): BetterSQLite3Database<TSchema, TRelations> & {
    $client: '$client is not available on drizzle.mock()';
  };
}
//#endregion
export { BetterSQLite3Database, DrizzleBetterSQLite3DatabaseConfig, drizzle };
//# sourceMappingURL=driver.d.cts.map