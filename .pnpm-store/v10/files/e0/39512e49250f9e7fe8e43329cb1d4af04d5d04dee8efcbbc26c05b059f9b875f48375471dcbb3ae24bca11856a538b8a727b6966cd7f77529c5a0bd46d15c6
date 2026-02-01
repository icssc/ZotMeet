import { PgliteClient, PgliteQueryResultHKT, PgliteSession } from "./session.cjs";
import { entityKind } from "../entity.cjs";
import { DrizzleConfig } from "../utils.cjs";
import * as V1 from "../_relations.cjs";
import { Cache } from "../cache/core/cache.cjs";
import { AnyRelations, EmptyRelations } from "../relations.cjs";
import { PgDialect } from "../pg-core/dialect.cjs";
import { Logger } from "../logger.cjs";
import { PgAsyncDatabase } from "../pg-core/async/db.cjs";
import { PGlite, PGliteOptions } from "@electric-sql/pglite";

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
//# sourceMappingURL=driver.d.cts.map