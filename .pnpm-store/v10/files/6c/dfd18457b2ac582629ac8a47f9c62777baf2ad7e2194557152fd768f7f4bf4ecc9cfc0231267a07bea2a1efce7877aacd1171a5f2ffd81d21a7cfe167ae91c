import { entityKind } from "../entity.js";
import { DrizzleConfig } from "../utils.js";
import { BaseSQLiteDatabase } from "../sqlite-core/db.js";
import { AnyRelations, EmptyRelations } from "../relations.js";
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
//# sourceMappingURL=driver.d.ts.map