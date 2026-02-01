import { XataHttpClient, XataHttpQueryResultHKT, XataHttpSession } from "./session.cjs";
import { entityKind } from "../entity.cjs";
import { DrizzleConfig } from "../utils.cjs";
import * as V1 from "../_relations.cjs";
import { Cache } from "../cache/core/cache.cjs";
import { AnyRelations, EmptyRelations } from "../relations.cjs";
import { PgDialect } from "../pg-core/dialect.cjs";
import { Logger } from "../logger.cjs";
import { PgAsyncDatabase } from "../pg-core/async/db.cjs";

//#region src/xata-http/driver.d.ts
interface XataDriverOptions {
  logger?: Logger;
  cache?: Cache;
}
declare class XataHttpDriver {
  private client;
  private dialect;
  private options;
  static readonly [entityKind]: string;
  constructor(client: XataHttpClient, dialect: PgDialect, options?: XataDriverOptions);
  createSession(relations: AnyRelations, schema: V1.RelationalSchemaConfig<V1.TablesRelationalConfig> | undefined): XataHttpSession<Record<string, unknown>, AnyRelations, V1.TablesRelationalConfig>;
  initMappers(): void;
}
declare class XataHttpDatabase<TSchema extends Record<string, unknown> = Record<string, never>, TRelations extends AnyRelations = EmptyRelations> extends PgAsyncDatabase<XataHttpQueryResultHKT, TSchema, TRelations> {
  static readonly [entityKind]: string;
}
declare function drizzle<TSchema extends Record<string, unknown> = Record<string, never>, TRelations extends AnyRelations = EmptyRelations>(client: XataHttpClient, config?: DrizzleConfig<TSchema, TRelations>): XataHttpDatabase<TSchema, TRelations> & {
  $client: XataHttpClient;
};
//#endregion
export { XataDriverOptions, XataHttpDatabase, XataHttpDriver, drizzle };
//# sourceMappingURL=driver.d.cts.map