import { BunSQLiteRunResult } from "./session.js";
import { entityKind } from "../../entity.js";
import { DrizzleConfig } from "../../utils.js";
import { BaseSQLiteDatabase } from "../../sqlite-core/db.js";
import { AnyRelations, EmptyRelations } from "../../relations.js";
import { SQL } from "bun";

//#region src/bun-sql/sqlite/driver.d.ts
declare class BunSQLiteDatabase<TSchema extends Record<string, unknown> = Record<string, never>, TRelations extends AnyRelations = EmptyRelations> extends BaseSQLiteDatabase<'async', BunSQLiteRunResult, TSchema, TRelations> {
  static readonly [entityKind]: string;
}
declare function drizzle<TSchema extends Record<string, unknown> = Record<string, never>, TRelations extends AnyRelations = EmptyRelations, TClient extends SQL = SQL>(...params: [string] | [string, DrizzleConfig<TSchema, TRelations>] | [(DrizzleConfig<TSchema, TRelations> & ({
  connection: string | ({
    url?: string;
  } & SQL.Options);
} | {
  client: TClient;
}))]): BunSQLiteDatabase<TSchema, TRelations> & {
  $client: TClient;
};
declare namespace drizzle {
  function mock<TSchema extends Record<string, unknown> = Record<string, never>, TRelations extends AnyRelations = EmptyRelations>(config?: DrizzleConfig<TSchema, TRelations>): BunSQLiteDatabase<TSchema, TRelations> & {
    $client: '$client is not available on drizzle.mock()';
  };
}
//#endregion
export { BunSQLiteDatabase, drizzle };
//# sourceMappingURL=driver.d.ts.map