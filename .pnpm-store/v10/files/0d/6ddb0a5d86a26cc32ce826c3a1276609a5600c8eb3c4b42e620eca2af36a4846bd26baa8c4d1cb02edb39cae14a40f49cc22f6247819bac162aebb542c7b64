import { entityKind } from "../entity.cjs";
import { DrizzleConfig } from "../utils.cjs";
import { AnyRelations, EmptyRelations } from "../relations.cjs";
import { BaseSQLiteDatabase } from "../sqlite-core/db.cjs";
import { SQLiteDatabase, SQLiteRunResult } from "expo-sqlite";

//#region src/expo-sqlite/driver.d.ts
declare class ExpoSQLiteDatabase<TSchema extends Record<string, unknown> = Record<string, never>, TRelations extends AnyRelations = EmptyRelations> extends BaseSQLiteDatabase<'sync', SQLiteRunResult, TSchema, TRelations> {
  static readonly [entityKind]: string;
}
declare function drizzle<TSchema extends Record<string, unknown> = Record<string, never>, TRelations extends AnyRelations = EmptyRelations>(client: SQLiteDatabase, config?: DrizzleConfig<TSchema, TRelations>): ExpoSQLiteDatabase<TSchema, TRelations> & {
  $client: SQLiteDatabase;
};
//#endregion
export { ExpoSQLiteDatabase, drizzle };
//# sourceMappingURL=driver.d.cts.map