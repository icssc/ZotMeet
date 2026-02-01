import { entityKind } from "../entity.cjs";
import { DrizzleConfig } from "../utils.cjs";
import { AnyRelations, EmptyRelations } from "../relations.cjs";
import { BaseSQLiteDatabase } from "../sqlite-core/db.cjs";
import { Database } from "@sqlitecloud/drivers";

//#region src/sqlite-cloud/driver.d.ts
type SQLiteCloudRunResult = unknown;
declare class SQLiteCloudDatabase<TSchema extends Record<string, unknown> = Record<string, never>, TRelations extends AnyRelations = EmptyRelations> extends BaseSQLiteDatabase<'async', SQLiteCloudRunResult, TSchema, TRelations> {
  static readonly [entityKind]: string;
}
type DatabaseOpts = (Database extends {
  new (path: string, opts: infer D): any;
} ? D : any) & {
  path: string;
};
declare function drizzle<TSchema extends Record<string, unknown> = Record<string, never>, TRelations extends AnyRelations = EmptyRelations, TClient extends Database = Database>(...params: [string] | [string, DrizzleConfig<TSchema, TRelations>] | [(DrizzleConfig<TSchema, TRelations> & ({
  connection: string | DatabaseOpts;
} | {
  client: TClient;
}))]): SQLiteCloudDatabase<TSchema, TRelations> & {
  $client: TClient;
};
declare namespace drizzle {
  function mock<TSchema extends Record<string, unknown> = Record<string, never>, TRelations extends AnyRelations = EmptyRelations>(config?: DrizzleConfig<TSchema, TRelations>): SQLiteCloudDatabase<TSchema, TRelations> & {
    $client: '$client is not available on drizzle.mock()';
  };
}
//#endregion
export { DatabaseOpts, SQLiteCloudDatabase, SQLiteCloudRunResult, drizzle };
//# sourceMappingURL=driver.d.cts.map