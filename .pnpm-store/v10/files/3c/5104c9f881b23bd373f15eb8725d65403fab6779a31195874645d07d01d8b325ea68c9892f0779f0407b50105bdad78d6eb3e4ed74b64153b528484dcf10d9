import { NodePgClient, NodePgQueryResultHKT } from "./session.js";
import { entityKind } from "../entity.js";
import { DrizzleConfig } from "../utils.js";
import { Logger } from "../logger.js";
import { PgAsyncDatabase } from "../pg-core/async/db.js";
import { Cache } from "../cache/core/cache.js";
import { AnyRelations, EmptyRelations } from "../relations.js";
import { Pool, PoolConfig } from "pg";

//#region src/node-postgres/driver.d.ts
interface PgDriverOptions {
  logger?: Logger;
  cache?: Cache;
}
declare class NodePgDatabase<TSchema extends Record<string, unknown> = Record<string, never>, TRelations extends AnyRelations = EmptyRelations> extends PgAsyncDatabase<NodePgQueryResultHKT, TSchema, TRelations> {
  static readonly [entityKind]: string;
}
declare function drizzle<TSchema extends Record<string, unknown> = Record<string, never>, TRelations extends AnyRelations = EmptyRelations, TClient extends NodePgClient = Pool>(...params: [string] | [string, DrizzleConfig<TSchema, TRelations>] | [DrizzleConfig<TSchema, TRelations> & ({
  client: TClient;
} | {
  connection: string | PoolConfig;
})]): NodePgDatabase<TSchema, TRelations> & {
  $client: NodePgClient extends TClient ? Pool : TClient;
};
declare namespace drizzle {
  function mock<TSchema extends Record<string, unknown> = Record<string, never>, TRelations extends AnyRelations = EmptyRelations>(config?: DrizzleConfig<TSchema, TRelations>): NodePgDatabase<TSchema, TRelations> & {
    $client: '$client is not available on drizzle.mock()';
  };
}
//#endregion
export { NodePgDatabase, PgDriverOptions, drizzle };
//# sourceMappingURL=driver.d.ts.map