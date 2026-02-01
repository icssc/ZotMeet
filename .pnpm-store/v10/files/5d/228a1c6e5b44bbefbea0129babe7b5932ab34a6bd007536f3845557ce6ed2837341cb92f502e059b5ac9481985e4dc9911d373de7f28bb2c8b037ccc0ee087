import { BunSQLiteRunResult } from "./session.cjs";
import { entityKind } from "../../entity.cjs";
import { DrizzleConfig } from "../../utils.cjs";
import { AnyRelations, EmptyRelations } from "../../relations.cjs";
import { BaseSQLiteDatabase } from "../../sqlite-core/db.cjs";
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
//# sourceMappingURL=driver.d.cts.map