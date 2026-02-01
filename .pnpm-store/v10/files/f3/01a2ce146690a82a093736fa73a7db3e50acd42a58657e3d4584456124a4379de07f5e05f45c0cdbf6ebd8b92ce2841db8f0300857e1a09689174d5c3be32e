import { PlanetScalePreparedQueryHKT, PlanetscaleQueryResultHKT } from "./session.js";
import { entityKind } from "../entity.js";
import { DrizzleConfig } from "../utils.js";
import { Logger } from "../logger.js";
import { Client, Config } from "@planetscale/database";
import { MySqlDatabase } from "../mysql-core/db.js";
import { AnyRelations, EmptyRelations } from "../relations.js";

//#region src/planetscale-serverless/driver.d.ts
interface PlanetscaleSDriverOptions {
  logger?: Logger;
  cache?: Cache;
}
declare class PlanetScaleDatabase<TSchema extends Record<string, unknown> = Record<string, never>, TRelations extends AnyRelations = EmptyRelations> extends MySqlDatabase<PlanetscaleQueryResultHKT, PlanetScalePreparedQueryHKT, TSchema, TRelations> {
  static readonly [entityKind]: string;
}
declare function drizzle<TSchema extends Record<string, unknown> = Record<string, never>, TRelations extends AnyRelations = EmptyRelations, TClient extends Client = Client>(...params: [string] | [string, DrizzleConfig<TSchema, TRelations>] | [(DrizzleConfig<TSchema, TRelations> & ({
  connection: string | Config;
} | {
  client: TClient;
}))]): PlanetScaleDatabase<TSchema, TRelations> & {
  $client: TClient;
};
declare namespace drizzle {
  function mock<TSchema extends Record<string, unknown> = Record<string, never>, TRelations extends AnyRelations = EmptyRelations>(config?: DrizzleConfig<TSchema, TRelations>): PlanetScaleDatabase<TSchema, TRelations> & {
    $client: '$client is not available on drizzle.mock()';
  };
}
//#endregion
export { PlanetScaleDatabase, PlanetscaleSDriverOptions, drizzle };
//# sourceMappingURL=driver.d.ts.map