import { NodePgClient, NodePgQueryResultHKT } from "./session.cjs";
import { entityKind } from "../entity.cjs";
import { DrizzleConfig } from "../utils.cjs";
import { Cache } from "../cache/core/cache.cjs";
import { AnyRelations, EmptyRelations } from "../relations.cjs";
import { Logger } from "../logger.cjs";
import { PgAsyncDatabase } from "../pg-core/async/db.cjs";
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
//# sourceMappingURL=driver.d.cts.map