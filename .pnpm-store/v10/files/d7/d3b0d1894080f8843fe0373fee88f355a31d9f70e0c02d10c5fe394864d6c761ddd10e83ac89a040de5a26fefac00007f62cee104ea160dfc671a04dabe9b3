import { GelClient, GelDbSession } from "./session.js";
import { entityKind } from "../entity.js";
import { DrizzleConfig } from "../utils.js";
import * as V1 from "../_relations.js";
import { Logger } from "../logger.js";
import { Cache } from "../cache/core/index.js";
import { Client, ConnectOptions } from "gel";
import { GelDatabase } from "../gel-core/db.js";
import { GelDialect } from "../gel-core/dialect.js";
import { GelQueryResultHKT } from "../gel-core/session.js";
import { AnyRelations, EmptyRelations } from "../relations.js";

//#region src/gel/driver.d.ts
interface GelDriverOptions {
  logger?: Logger;
  cache?: Cache;
}
declare class GelDriver {
  private client;
  private dialect;
  private options;
  static readonly [entityKind]: string;
  constructor(client: GelClient, dialect: GelDialect, options?: GelDriverOptions);
  createSession(relations: AnyRelations, schema: V1.RelationalSchemaConfig<V1.TablesRelationalConfig> | undefined): GelDbSession<Record<string, unknown>, AnyRelations, V1.TablesRelationalConfig>;
}
declare class GelJsDatabase<TSchema extends Record<string, unknown> = Record<string, never>, TRelations extends AnyRelations = EmptyRelations> extends GelDatabase<GelQueryResultHKT, TSchema, TRelations> {
  static readonly [entityKind]: string;
}
declare function drizzle<TSchema extends Record<string, unknown> = Record<string, never>, TRelations extends AnyRelations = EmptyRelations, TClient extends GelClient = Client>(...params: [string] | [string, DrizzleConfig<TSchema, TRelations>] | [DrizzleConfig<TSchema, TRelations> & ({
  connection: string | ConnectOptions;
} | {
  client: TClient;
})]): GelJsDatabase<TSchema, TRelations> & {
  $client: GelClient extends TClient ? Client : TClient;
};
declare namespace drizzle {
  function mock<TSchema extends Record<string, unknown> = Record<string, never>, TRelations extends AnyRelations = EmptyRelations>(config?: DrizzleConfig<TSchema, TRelations>): GelJsDatabase<TSchema, TRelations> & {
    $client: '$client is not available on drizzle.mock()';
  };
}
//#endregion
export { GelDriver, GelDriverOptions, GelJsDatabase, drizzle };
//# sourceMappingURL=driver.d.ts.map