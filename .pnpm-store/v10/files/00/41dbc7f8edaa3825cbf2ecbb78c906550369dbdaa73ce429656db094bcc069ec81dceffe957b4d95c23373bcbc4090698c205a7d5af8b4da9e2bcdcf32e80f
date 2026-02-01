import { DrizzleConfig } from "../utils.js";
import { BaseSQLiteDatabase } from "../sqlite-core/db.js";
import { AnyRelations, EmptyRelations } from "../relations.js";
import { Database } from "sql.js";

//#region src/sql-js/driver.d.ts
type SQLJsDatabase<TSchema extends Record<string, unknown> = Record<string, never>, TRelations extends AnyRelations = EmptyRelations> = BaseSQLiteDatabase<'sync', void, TSchema, TRelations>;
declare function drizzle<TSchema extends Record<string, unknown> = Record<string, never>, TRelations extends AnyRelations = EmptyRelations>(client: Database, config?: DrizzleConfig<TSchema, TRelations>): SQLJsDatabase<TSchema, TRelations>;
//#endregion
export { SQLJsDatabase, drizzle };
//# sourceMappingURL=driver.d.ts.map