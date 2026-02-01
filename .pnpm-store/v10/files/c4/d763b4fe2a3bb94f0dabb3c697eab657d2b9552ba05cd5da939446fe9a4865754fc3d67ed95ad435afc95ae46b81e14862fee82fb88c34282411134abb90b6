import { SingleStoreRemotePreparedQueryHKT, SingleStoreRemoteQueryResultHKT } from "./session.cjs";
import { entityKind } from "../entity.cjs";
import { DrizzleConfig } from "../utils.cjs";
import { AnyRelations, EmptyRelations } from "../relations.cjs";
import { SingleStoreDatabase } from "../singlestore-core/db.cjs";

//#region src/singlestore-proxy/driver.d.ts
declare class SingleStoreRemoteDatabase<TSchema extends Record<string, unknown> = Record<string, never>, TRelations extends AnyRelations = EmptyRelations> extends SingleStoreDatabase<SingleStoreRemoteQueryResultHKT, SingleStoreRemotePreparedQueryHKT, TSchema, TRelations> {
  static readonly [entityKind]: string;
}
type RemoteCallback = (sql: string, params: any[], method: 'all' | 'execute') => Promise<{
  rows: any[];
  insertId?: number;
  affectedRows?: number;
}>;
declare function drizzle<TSchema extends Record<string, unknown> = Record<string, never>, TRelations extends AnyRelations = EmptyRelations>(callback: RemoteCallback, config?: DrizzleConfig<TSchema, TRelations>): SingleStoreRemoteDatabase<TSchema, TRelations>;
//#endregion
export { RemoteCallback, SingleStoreRemoteDatabase, drizzle };
//# sourceMappingURL=driver.d.cts.map