import { PostgresJsQueryResultHKT } from "./session.cjs";
import { entityKind } from "../entity.cjs";
import { DrizzleConfig } from "../utils.cjs";
import { AnyRelations, EmptyRelations } from "../relations.cjs";
import { PgAsyncDatabase } from "../pg-core/async/db.cjs";
import { Options, PostgresType, Sql } from "postgres";

//#region src/postgres-js/driver.d.ts
declare class PostgresJsDatabase<TSchema extends Record<string, unknown> = Record<string, never>, TRelations extends AnyRelations = EmptyRelations> extends PgAsyncDatabase<PostgresJsQueryResultHKT, TSchema, TRelations> {
  static readonly [entityKind]: string;
}
declare function drizzle<TSchema extends Record<string, unknown> = Record<string, never>, TRelations extends AnyRelations = EmptyRelations, TClient extends Sql = Sql>(...params: [string] | [string, DrizzleConfig<TSchema, TRelations>] | [(DrizzleConfig<TSchema, TRelations> & ({
  connection: string | ({
    url?: string;
  } & Options<Record<string, PostgresType>>);
} | {
  client: TClient;
}))]): PostgresJsDatabase<TSchema, TRelations> & {
  $client: TClient;
};
declare namespace drizzle {
  function mock<TSchema extends Record<string, unknown> = Record<string, never>, TRelations extends AnyRelations = EmptyRelations>(config?: DrizzleConfig<TSchema, TRelations>): PostgresJsDatabase<TSchema, TRelations> & {
    $client: '$client is not available on drizzle.mock()';
  };
}
//#endregion
export { PostgresJsDatabase, drizzle };
//# sourceMappingURL=driver.d.cts.map