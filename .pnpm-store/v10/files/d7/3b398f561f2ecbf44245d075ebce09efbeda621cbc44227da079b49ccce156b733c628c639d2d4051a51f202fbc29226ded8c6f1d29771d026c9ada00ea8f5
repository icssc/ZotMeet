import { MySqlRemotePreparedQueryHKT, MySqlRemoteQueryResultHKT } from "./session.js";
import { entityKind } from "../entity.js";
import { DrizzleConfig } from "../utils.js";
import { MySqlDatabase } from "../mysql-core/db.js";
import { MySqlDialect } from "../mysql-core/dialect.js";
import { AnyRelations, EmptyRelations } from "../relations.js";

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
//# sourceMappingURL=driver.d.ts.map