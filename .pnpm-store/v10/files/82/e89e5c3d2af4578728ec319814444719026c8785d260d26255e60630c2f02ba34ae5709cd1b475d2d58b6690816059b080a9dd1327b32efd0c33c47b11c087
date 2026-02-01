import { entityKind } from "../entity.cjs";
import { DrizzleConfig, IfNotImported } from "../utils.cjs";
import { AnyRelations, EmptyRelations } from "../relations.cjs";
import { BaseSQLiteDatabase } from "../sqlite-core/db.cjs";
import { D1Database as D1Database$1 } from "@miniflare/d1";
import { BatchItem, BatchResponse } from "../batch.cjs";

//#region src/d1/driver.d.ts
type AnyD1Database = IfNotImported<D1Database, D1Database$1, D1Database | IfNotImported<D1DatabaseSession, never, D1DatabaseSession> | IfNotImported<D1Database$1, never, D1Database$1>>;
declare class DrizzleD1Database<TSchema extends Record<string, unknown> = Record<string, never>, TRelations extends AnyRelations = EmptyRelations> extends BaseSQLiteDatabase<'async', D1Result, TSchema, TRelations> {
  static readonly [entityKind]: string;
  batch<U extends BatchItem<'sqlite'>, T extends Readonly<[U, ...U[]]>>(batch: T): Promise<BatchResponse<T>>;
}
declare function drizzle<TSchema extends Record<string, unknown> = Record<string, never>, TRelations extends AnyRelations = EmptyRelations, TClient extends AnyD1Database = AnyD1Database>(client: TClient, config?: DrizzleConfig<TSchema, TRelations>): DrizzleD1Database<TSchema, TRelations> & {
  $client: TClient;
};
//#endregion
export { AnyD1Database, DrizzleD1Database, drizzle };
//# sourceMappingURL=driver.d.cts.map