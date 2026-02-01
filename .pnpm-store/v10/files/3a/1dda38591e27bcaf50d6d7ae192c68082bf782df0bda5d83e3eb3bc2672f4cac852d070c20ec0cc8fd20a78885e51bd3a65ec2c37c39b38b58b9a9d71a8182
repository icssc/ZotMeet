import { TiDBServerlessPreparedQueryHKT, TiDBServerlessQueryResultHKT } from "./session.js";
import { entityKind } from "../entity.js";
import { DrizzleConfig } from "../utils.js";
import { Logger } from "../logger.js";
import { MySqlDatabase } from "../mysql-core/db.js";
import { Config, Connection } from "@tidbcloud/serverless";
import { AnyRelations, EmptyRelations } from "../relations.js";

//#region src/tidb-serverless/driver.d.ts
interface TiDBServerlessSDriverOptions {
  logger?: Logger;
  cache?: Cache;
}
declare class TiDBServerlessDatabase<TSchema extends Record<string, unknown> = Record<string, never>, TRelations extends AnyRelations = EmptyRelations> extends MySqlDatabase<TiDBServerlessQueryResultHKT, TiDBServerlessPreparedQueryHKT, TSchema, TRelations> {
  static readonly [entityKind]: string;
}
declare function drizzle<TSchema extends Record<string, unknown> = Record<string, never>, TRelations extends AnyRelations = EmptyRelations, TClient extends Connection = Connection>(...params: [string] | [string, DrizzleConfig<TSchema, TRelations>] | [({
  connection: string | Config;
} | {
  client: TClient;
}) & DrizzleConfig<TSchema, TRelations>]): TiDBServerlessDatabase<TSchema, TRelations> & {
  $client: TClient;
};
declare namespace drizzle {
  function mock<TSchema extends Record<string, unknown> = Record<string, never>, TRelations extends AnyRelations = EmptyRelations>(config?: DrizzleConfig<TSchema, TRelations>): TiDBServerlessDatabase<TSchema, TRelations> & {
    $client: '$client is not available on drizzle.mock()';
  };
}
//#endregion
export { TiDBServerlessDatabase, TiDBServerlessSDriverOptions, drizzle };
//# sourceMappingURL=driver.d.ts.map