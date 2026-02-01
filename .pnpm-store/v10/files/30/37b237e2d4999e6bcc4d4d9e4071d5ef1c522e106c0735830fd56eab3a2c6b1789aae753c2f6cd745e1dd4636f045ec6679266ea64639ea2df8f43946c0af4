import { MySqlRemotePreparedQueryHKT, MySqlRemoteQueryResultHKT } from "./session.cjs";
import { entityKind } from "../entity.cjs";
import { DrizzleConfig } from "../utils.cjs";
import { AnyRelations, EmptyRelations } from "../relations.cjs";
import { MySqlDialect } from "../mysql-core/dialect.cjs";
import { MySqlDatabase } from "../mysql-core/db.cjs";

//#region src/mysql-proxy/driver.d.ts
declare class MySqlRemoteDatabase<TSchema extends Record<string, unknown> = Record<string, never>, TRelations extends AnyRelations = EmptyRelations> extends MySqlDatabase<MySqlRemoteQueryResultHKT, MySqlRemotePreparedQueryHKT, TSchema, TRelations> {
  static readonly [entityKind]: string;
}
type RemoteCallback = (sql: string, params: any[], method: 'all' | 'execute') => Promise<{
  rows: any[];
  insertId?: number;
  affectedRows?: number;
}>;
declare function drizzle<TSchema extends Record<string, unknown> = Record<string, never>, TRelations extends AnyRelations = EmptyRelations>(callback: RemoteCallback, config?: DrizzleConfig<TSchema, TRelations>, _dialect?: () => MySqlDialect): MySqlRemoteDatabase<TSchema, TRelations>;
//#endregion
export { MySqlRemoteDatabase, RemoteCallback, drizzle };
//# sourceMappingURL=driver.d.cts.map