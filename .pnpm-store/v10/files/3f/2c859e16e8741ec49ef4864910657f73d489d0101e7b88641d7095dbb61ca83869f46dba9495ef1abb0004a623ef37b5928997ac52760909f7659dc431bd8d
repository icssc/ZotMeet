import { VercelPgClient, VercelPgQueryResultHKT, VercelPgSession } from "./session.js";
import { entityKind } from "../entity.js";
import { DrizzleConfig } from "../utils.js";
import * as V1 from "../_relations.js";
import { Logger } from "../logger.js";
import { PgAsyncDatabase } from "../pg-core/async/db.js";
import { PgDialect } from "../pg-core/index.js";
import { sql } from "@vercel/postgres";
import { Cache } from "../cache/core/cache.js";
import { AnyRelations, EmptyRelations } from "../relations.js";

//#region src/vercel-postgres/driver.d.ts
interface VercelPgDriverOptions {
  logger?: Logger;
  cache?: Cache;
}
declare class VercelPgDriver {
  private client;
  private dialect;
  private options;
  static readonly [entityKind]: string;
  constructor(client: VercelPgClient, dialect: PgDialect, options?: VercelPgDriverOptions);
  createSession(relations: AnyRelations, schema: V1.RelationalSchemaConfig<V1.TablesRelationalConfig> | undefined): VercelPgSession<Record<string, unknown>, AnyRelations, V1.TablesRelationalConfig>;
}
declare class VercelPgDatabase<TSchema extends Record<string, unknown> = Record<string, never>, TRelations extends AnyRelations = EmptyRelations> extends PgAsyncDatabase<VercelPgQueryResultHKT, TSchema, TRelations> {
  static readonly [entityKind]: string;
}
declare function drizzle<TSchema extends Record<string, unknown> = Record<string, never>, TRelations extends AnyRelations = EmptyRelations, TClient extends VercelPgClient = typeof sql>(...params: [] | [TClient] | [TClient, DrizzleConfig<TSchema, TRelations>] | [(DrizzleConfig<TSchema, TRelations> & ({
  client?: TClient;
}))]): VercelPgDatabase<TSchema, TRelations> & {
  $client: VercelPgClient extends TClient ? typeof sql : TClient;
};
declare namespace drizzle {
  function mock<TSchema extends Record<string, unknown> = Record<string, never>, TRelations extends AnyRelations = EmptyRelations>(config?: DrizzleConfig<TSchema, TRelations>): VercelPgDatabase<TSchema, TRelations> & {
    $client: '$client is not available on drizzle.mock()';
  };
}
//#endregion
export { VercelPgDatabase, VercelPgDriver, VercelPgDriverOptions, drizzle };
//# sourceMappingURL=driver.d.ts.map