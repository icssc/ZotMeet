import { entityKind } from "../entity.js";
import { DrizzleConfig } from "../utils.js";
import { BaseSQLiteDatabase } from "../sqlite-core/db.js";
import { AnyRelations, EmptyRelations } from "../relations.js";
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
//# sourceMappingURL=driver.d.ts.map