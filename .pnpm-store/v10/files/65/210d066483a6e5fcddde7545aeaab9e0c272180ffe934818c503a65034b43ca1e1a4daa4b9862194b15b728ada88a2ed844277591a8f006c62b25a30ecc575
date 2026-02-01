import { entityKind } from "../entity.cjs";
import { DrizzleConfig } from "../utils.cjs";
import { AnyRelations, EmptyRelations } from "../relations.cjs";
import { BaseSQLiteDatabase } from "../sqlite-core/db.cjs";
import { OPSQLiteConnection, QueryResult } from "@op-engineering/op-sqlite";

//#region src/op-sqlite/driver.d.ts
declare class OPSQLiteDatabase<TSchema extends Record<string, unknown> = Record<string, never>, TRelations extends AnyRelations = EmptyRelations> extends BaseSQLiteDatabase<'async', QueryResult, TSchema, TRelations> {
  static readonly [entityKind]: string;
}
declare function drizzle<TSchema extends Record<string, unknown> = Record<string, never>, TRelations extends AnyRelations = EmptyRelations>(client: OPSQLiteConnection, config?: DrizzleConfig<TSchema, TRelations>): OPSQLiteDatabase<TSchema, TRelations> & {
  $client: OPSQLiteConnection;
};
//#endregion
export { OPSQLiteDatabase, drizzle };
//# sourceMappingURL=driver.d.cts.map