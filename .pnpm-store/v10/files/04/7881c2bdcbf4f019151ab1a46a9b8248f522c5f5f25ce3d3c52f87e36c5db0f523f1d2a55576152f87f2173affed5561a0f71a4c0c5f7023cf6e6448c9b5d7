import { entityKind } from "../entity.cjs";
import { DrizzleConfig } from "../utils.cjs";
import { AnyRelations, EmptyRelations } from "../relations.cjs";
import { BaseSQLiteDatabase } from "../sqlite-core/db.cjs";

//#region src/durable-sqlite/driver.d.ts
declare class DrizzleSqliteDODatabase<TSchema extends Record<string, unknown> = Record<string, never>, TRelations extends AnyRelations = EmptyRelations> extends BaseSQLiteDatabase<'sync', SqlStorageCursor<Record<string, SqlStorageValue>>, TSchema, TRelations> {
  static readonly [entityKind]: string;
}
declare function drizzle<TSchema extends Record<string, unknown> = Record<string, never>, TRelations extends AnyRelations = EmptyRelations, TClient extends DurableObjectStorage = DurableObjectStorage>(client: TClient, config?: DrizzleConfig<TSchema, TRelations>): DrizzleSqliteDODatabase<TSchema, TRelations> & {
  $client: TClient;
};
//#endregion
export { DrizzleSqliteDODatabase, drizzle };
//# sourceMappingURL=driver.d.cts.map