import { BunSQLQueryResultHKT } from "./session.cjs";
import { entityKind } from "../../entity.cjs";
import { DrizzleConfig } from "../../utils.cjs";
import { AnyRelations, EmptyRelations } from "../../relations.cjs";
import { PgAsyncDatabase } from "../../pg-core/async/db.cjs";
import { SQL } from "bun";

//#region src/bun-sql/postgres/driver.d.ts
declare class BunSQLDatabase<TSchema extends Record<string, unknown> = Record<string, never>, TRelations extends AnyRelations = EmptyRelations> extends PgAsyncDatabase<BunSQLQueryResultHKT, TSchema, TRelations> {
  static readonly [entityKind]: string;
}
declare function drizzle<TSchema extends Record<string, unknown> = Record<string, never>, TRelations extends AnyRelations = EmptyRelations, TClient extends SQL = SQL>(...params: [string] | [string, DrizzleConfig<TSchema, TRelations>] | [(DrizzleConfig<TSchema, TRelations> & ({
  connection: string | ({
    url?: string;
  } & SQL.Options);
} | {
  client: TClient;
}))]): BunSQLDatabase<TSchema, TRelations> & {
  $client: TClient;
};
declare namespace drizzle {
  function mock<TSchema extends Record<string, unknown> = Record<string, never>, TRelations extends AnyRelations = EmptyRelations>(config?: DrizzleConfig<TSchema, TRelations>): BunSQLDatabase<TSchema, TRelations> & {
    $client: '$client is not available on drizzle.mock()';
  };
}
//#endregion
export { BunSQLDatabase, drizzle };
//# sourceMappingURL=driver.d.cts.map