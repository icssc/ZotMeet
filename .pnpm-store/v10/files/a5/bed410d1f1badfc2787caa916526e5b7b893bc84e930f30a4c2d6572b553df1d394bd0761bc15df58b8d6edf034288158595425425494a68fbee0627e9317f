import { PgRemoteQueryResultHKT } from "./session.cjs";
import { entityKind } from "../entity.cjs";
import { DrizzleConfig } from "../utils.cjs";
import { AnyRelations, EmptyRelations } from "../relations.cjs";
import { PgDialect } from "../pg-core/dialect.cjs";
import { PgAsyncDatabase } from "../pg-core/async/db.cjs";

//#region src/pg-proxy/driver.d.ts
declare class PgRemoteDatabase<TSchema extends Record<string, unknown> = Record<string, never>, TRelations extends AnyRelations = EmptyRelations> extends PgAsyncDatabase<PgRemoteQueryResultHKT, TSchema, TRelations> {
  static readonly [entityKind]: string;
}
type RemoteCallback = (sql: string, params: any[], method: 'all' | 'execute', typings?: any[]) => Promise<{
  rows: any[];
}>;
declare function drizzle<TSchema extends Record<string, unknown> = Record<string, never>, TRelations extends AnyRelations = EmptyRelations>(callback: RemoteCallback, config?: DrizzleConfig<TSchema, TRelations>, _dialect?: () => PgDialect): PgRemoteDatabase<TSchema, TRelations>;
//#endregion
export { PgRemoteDatabase, RemoteCallback, drizzle };
//# sourceMappingURL=driver.d.cts.map