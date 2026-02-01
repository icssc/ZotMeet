import { NeonClient, NeonQueryResultHKT, NeonSession } from "./session.cjs";
import { entityKind } from "../entity.cjs";
import { DrizzleConfig } from "../utils.cjs";
import * as V1 from "../_relations.cjs";
import { Cache } from "../cache/core/cache.cjs";
import { AnyRelations, EmptyRelations } from "../relations.cjs";
import { PgDialect } from "../pg-core/dialect.cjs";
import { Logger } from "../logger.cjs";
import { PgAsyncDatabase } from "../pg-core/async/db.cjs";
import { Pool, PoolConfig } from "@neondatabase/serverless";

//#region src/neon-serverless/driver.d.ts
interface NeonDriverOptions {
  logger?: Logger;
  cache?: Cache;
}
declare class NeonDriver {
  private client;
  private dialect;
  private options;
  static readonly [entityKind]: string;
  constructor(client: NeonClient, dialect: PgDialect, options?: NeonDriverOptions);
  createSession(relations: AnyRelations, schema: V1.RelationalSchemaConfig<V1.TablesRelationalConfig> | undefined): NeonSession<Record<string, unknown>, AnyRelations, V1.TablesRelationalConfig>;
}
declare class NeonDatabase<TSchema extends Record<string, unknown> = Record<string, never>, TRelations extends AnyRelations = EmptyRelations> extends PgAsyncDatabase<NeonQueryResultHKT, TSchema, TRelations> {
  static readonly [entityKind]: string;
}
declare function drizzle<TSchema extends Record<string, unknown> = Record<string, never>, TRelations extends AnyRelations = EmptyRelations, TClient extends NeonClient = Pool>(...params: [string] | [string, DrizzleConfig<TSchema, TRelations>] | [(DrizzleConfig<TSchema, TRelations> & ({
  connection: string | PoolConfig;
} | {
  client: TClient;
}) & {
  ws?: any;
})]): NeonDatabase<TSchema, TRelations> & {
  $client: NeonClient extends TClient ? Pool : TClient;
};
declare namespace drizzle {
  function mock<TSchema extends Record<string, unknown> = Record<string, never>, TRelations extends AnyRelations = EmptyRelations>(config?: DrizzleConfig<TSchema, TRelations>): NeonDatabase<TSchema> & {
    $client: '$client is not available on drizzle.mock()';
  };
}
//#endregion
export { NeonDatabase, NeonDriver, NeonDriverOptions, drizzle };
//# sourceMappingURL=driver.d.cts.map