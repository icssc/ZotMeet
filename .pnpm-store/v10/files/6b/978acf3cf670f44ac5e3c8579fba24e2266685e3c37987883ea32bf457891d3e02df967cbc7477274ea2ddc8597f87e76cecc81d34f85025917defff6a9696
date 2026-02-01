import { NodeCockroachClient, NodeCockroachQueryResultHKT, NodeCockroachSession } from "./session.cjs";
import { entityKind } from "../entity.cjs";
import { DrizzleConfig } from "../utils.cjs";
import * as V1 from "../_relations.cjs";
import { CockroachDialect } from "../cockroach-core/dialect.cjs";
import { Logger } from "../logger.cjs";
import { Pool, PoolConfig } from "pg";
import { CockroachDatabase } from "../cockroach-core/db.cjs";

//#region src/cockroach/driver.d.ts
interface CockroachDriverOptions {
  logger?: Logger;
}
declare class NodeCockroachDriver {
  private client;
  private dialect;
  private options;
  static readonly [entityKind]: string;
  constructor(client: NodeCockroachClient, dialect: CockroachDialect, options?: CockroachDriverOptions);
  createSession(schema: V1.RelationalSchemaConfig<V1.TablesRelationalConfig> | undefined): NodeCockroachSession<Record<string, unknown>, V1.TablesRelationalConfig>;
}
declare class NodeCockroachDatabase<TSchema extends Record<string, unknown> = Record<string, never>> extends CockroachDatabase<NodeCockroachQueryResultHKT, TSchema> {
  static readonly [entityKind]: string;
}
declare function drizzle<TSchema extends Record<string, unknown> = Record<string, never>, TClient extends NodeCockroachClient = Pool>(...params: [string] | [string, DrizzleConfig<TSchema>] | [(DrizzleConfig<TSchema> & ({
  connection: string | PoolConfig;
} | {
  client: TClient;
}))]): NodeCockroachDatabase<TSchema> & {
  $client: TClient;
};
declare namespace drizzle {
  function mock<TSchema extends Record<string, unknown> = Record<string, never>>(config?: DrizzleConfig<TSchema>): NodeCockroachDatabase<TSchema> & {
    $client: '$client is not available on drizzle.mock()';
  };
}
//#endregion
export { CockroachDriverOptions, NodeCockroachDatabase, NodeCockroachDriver, drizzle };
//# sourceMappingURL=driver.d.cts.map