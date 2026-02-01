import { PgliteClient, PgliteQueryResultHKT, PgliteSession } from "./session.js";
import { entityKind } from "../entity.js";
import { DrizzleConfig } from "../utils.js";
import * as V1 from "../_relations.js";
import { Logger } from "../logger.js";
import { PgAsyncDatabase } from "../pg-core/async/db.js";
import { PgDialect } from "../pg-core/dialect.js";
import { Cache } from "../cache/core/cache.js";
import { PGlite, PGliteOptions } from "@electric-sql/pglite";
import { AnyRelations, EmptyRelations } from "../relations.js";

//#region src/pglite/driver.d.ts
interface PgDriverOptions {
  logger?: Logger;
  cache?: Cache;
}
declare class PgliteDriver {
  private client;
  private dialect;
  private options;
  static readonly [entityKind]: string;
  constructor(client: PgliteClient, dialect: PgDialect, options?: PgDriverOptions);
  createSession(relations: AnyRelations, schema: V1.RelationalSchemaConfig<V1.TablesRelationalConfig> | undefined): PgliteSession<Record<string, unknown>, AnyRelations, V1.TablesRelationalConfig>;
}
declare class PgliteDatabase<TSchema extends Record<string, unknown> = Record<string, never>, TRelations extends AnyRelations = EmptyRelations> extends PgAsyncDatabase<PgliteQueryResultHKT, TSchema, TRelations> {
  static readonly [entityKind]: string;
}
declare function drizzle<TSchema extends Record<string, unknown> = Record<string, never>, TRelations extends AnyRelations = EmptyRelations, TClient extends PGlite = PGlite>(...params: [] | [string] | [string, DrizzleConfig<TSchema, TRelations>] | [(DrizzleConfig<TSchema, TRelations> & ({
  connection?: (PGliteOptions & {
    dataDir?: string;
  }) | string;
} | {
  client: TClient;
}))]): PgliteDatabase<TSchema, TRelations> & {
  $client: TClient;
};
declare namespace drizzle {
  function mock<TSchema extends Record<string, unknown> = Record<string, never>, TRelations extends AnyRelations = EmptyRelations>(config?: DrizzleConfig<TSchema, TRelations>): PgliteDatabase<TSchema, TRelations> & {
    $client: '$client is not available on drizzle.mock()';
  };
}
//#endregion
export { PgDriverOptions, PgliteDatabase, PgliteDriver, drizzle };
//# sourceMappingURL=driver.d.ts.map