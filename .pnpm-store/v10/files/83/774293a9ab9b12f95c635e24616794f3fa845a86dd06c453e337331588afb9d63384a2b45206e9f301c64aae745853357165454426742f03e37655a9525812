import { entityKind } from "../entity.js";
import { DrizzleConfig } from "../utils.js";
import { BaseSQLiteDatabase } from "../sqlite-core/db.js";
import { AnyRelations, EmptyRelations } from "../relations.js";

//#region src/durable-sqlite/driver.d.ts
declare class DrizzleSqliteDODatabase<TSchema extends Record<string, unknown> = Record<string, never>, TRelations extends AnyRelations = EmptyRelations> extends BaseSQLiteDatabase<'sync', SqlStorageCursor<Record<string, SqlStorageValue>>, TSchema, TRelations> {
  static readonly [entityKind]: string;
}
declare function drizzle<TSchema extends Record<string, unknown> = Record<string, never>, TRelations extends AnyRelations = EmptyRelations, TClient extends DurableObjectStorage = DurableObjectStorage>(client: TClient, config?: DrizzleConfig<TSchema, TRelations>): DrizzleSqliteDODatabase<TSchema, TRelations> & {
  $client: TClient;
};
//#endregion
export { DrizzleSqliteDODatabase, drizzle };
//# sourceMappingURL=driver.d.ts.map