import { GelClient, GelDbSession } from "./session.cjs";
import { entityKind } from "../entity.cjs";
import { DrizzleConfig } from "../utils.cjs";
import * as V1 from "../_relations.cjs";
import { AnyRelations, EmptyRelations } from "../relations.cjs";
import { GelDialect } from "../gel-core/dialect.cjs";
import { GelQueryResultHKT } from "../gel-core/session.cjs";
import { Client, ConnectOptions } from "gel";
import { Logger } from "../logger.cjs";
import { Cache } from "../cache/core/index.cjs";
import { GelDatabase } from "../gel-core/db.cjs";

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
//# sourceMappingURL=driver.d.cts.map