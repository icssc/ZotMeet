import { XataHttpClient, XataHttpQueryResultHKT, XataHttpSession } from "./session.js";
import { entityKind } from "../entity.js";
import { DrizzleConfig } from "../utils.js";
import * as V1 from "../_relations.js";
import { Logger } from "../logger.js";
import { PgAsyncDatabase } from "../pg-core/async/db.js";
import { PgDialect } from "../pg-core/dialect.js";
import { Cache } from "../cache/core/cache.js";
import { AnyRelations, EmptyRelations } from "../relations.js";

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
//# sourceMappingURL=driver.d.ts.map