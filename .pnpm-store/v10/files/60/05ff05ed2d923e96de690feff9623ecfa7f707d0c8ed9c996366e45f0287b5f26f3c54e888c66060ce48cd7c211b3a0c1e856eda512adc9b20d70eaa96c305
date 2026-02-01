import { DrizzleConfig } from "../utils.cjs";
import { AnyRelations, EmptyRelations } from "../relations.cjs";
import { BaseSQLiteDatabase } from "../sqlite-core/db.cjs";
import { Database } from "sql.js";

//#region src/sql-js/driver.d.ts
type SQLJsDatabase<TSchema extends Record<string, unknown> = Record<string, never>, TRelations extends AnyRelations = EmptyRelations> = BaseSQLiteDatabase<'sync', void, TSchema, TRelations>;
declare function drizzle<TSchema extends Record<string, unknown> = Record<string, never>, TRelations extends AnyRelations = EmptyRelations>(client: Database, config?: DrizzleConfig<TSchema, TRelations>): SQLJsDatabase<TSchema, TRelations>;
//#endregion
export { SQLJsDatabase, drizzle };
//# sourceMappingURL=driver.d.cts.map